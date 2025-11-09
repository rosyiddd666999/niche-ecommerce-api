const {
  Order,
  OrderItem,
  Product,
  CartItem,
  Cart,
  User,
} = require("../models/index.js");
const { snap, coreApi } = require("../config/midtrans.js");
const { sendPaymentSuccessEmail } = require("../utils/services/emailService.js");
const crypto = require('crypto');

// Helper: Calculate cart totals
const calcCartTotals = async (cartId) => {
  const cartItems = await CartItem.findAll({
    where: { cart_id: cartId },
    include: [{ model: Product, as: "product" }],
  });

  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;
  for (const item of cartItems) {
    const price = item.price || item.product.price_after_discount || item.product.price;
    subtotal += price * item.quantity;
  }

  return { items: cartItems, subtotal };
};

// CREATE ORDER & GET SNAP TOKEN
const createOrderByCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = req.params.cartId;
    const { shipping_address, shipping_price = 0 } = req.body;

    // Validasi cart
    const cart = await Cart.findOne({ where: { id: cartId, user_id: userId } });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found"
      });
    }

    // Get cart items & calculate
    const { items, subtotal } = await calcCartTotals(cartId);

    // Get user data
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    // Determine shipping address
    let finalAddress = shipping_address;
    
    // Jika tidak ada input manual, ambil dari user addresses
    if (!finalAddress) {
      if (user.addresses && user.addresses.length > 0) {
        // Ambil address pertama sebagai default
        finalAddress = user.addresses[0];
      } else {
        return res.status(400).json({
          status: "error",
          message: "Shipping address is required. Please provide address or update your profile."
        });
      }
    }

    // Calculate tax (2%)
    const taxPrice = Math.round(subtotal * 0.02);
    const totalOrderPrice = subtotal + taxPrice + shipping_price;

    // Create order dengan status pending
    const order = await Order.create({
      user_id: userId,
      tax_price: taxPrice,
      shipping_address: finalAddress,
      shipping_price: shipping_price,
      total_order_price: totalOrderPrice,
      payment_method_type: "midtrans",
      payment_status: "pending",
      is_paid: false,
    });

    // Create order items
    const orderItemsData = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      color: item.color,
      price: item.price || item.product.price_after_discount || item.product.price,
    }));

    await OrderItem.bulkCreate(orderItemsData);

    // Prepare Midtrans Snap parameter
    const itemDetails = items.map(item => ({
      id: item.product_id,
      price: item.price || item.product.price_after_discount || item.product.price,
      quantity: item.quantity,
      name: item.product.title,
    }));

    // Tambahkan tax dan shipping sebagai item
    itemDetails.push({
      id: 'TAX',
      price: taxPrice,
      quantity: 1,
      name: 'Pajak (2%)'
    });

    if (shipping_price > 0) {
      itemDetails.push({
        id: 'SHIPPING',
        price: shipping_price,
        quantity: 1,
        name: 'Ongkos Kirim'
      });
    }

    const snapParameter = {
      transaction_details: {
        order_id: `ORDER-${order.id}-${Date.now()}`,
        gross_amount: totalOrderPrice,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.phone || finalAddress.phone,
        shipping_address: {
          first_name: user.name,
          email: user.email,
          phone: finalAddress.phone,
          address: finalAddress.details,
          city: finalAddress.city,
          postal_code: finalAddress.postalCode,
          country_code: 'IDN'
        }
      },
      callbacks: {
        finish: `${process.env.APP_URL}/api/orders/${order.id}/success`,
      }
    };

    // Create Snap transaction
    const transaction = await snap.createTransaction(snapParameter);
    
    // Update order dengan snap token
    await order.update({
      snap_token: transaction.token,
      payment_transaction_id: snapParameter.transaction_details.order_id
    });

    // Clear cart setelah order dibuat
    await CartItem.destroy({ where: { cart_id: cartId } });
    await cart.update({
      total_cart_price: 0,
      total_price_after_discount: 0
    });

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: {
        order_id: order.id,
        snap_token: transaction.token,
        snap_redirect_url: transaction.redirect_url,
        total_amount: totalOrderPrice
      }
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

const handleMidtransNotification = async (req, res) => {
  try {    
    const notification = req.body;

    // Verify notification authenticity
    const statusResponse = await coreApi.transaction.notification(notification);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const signatureKey = statusResponse.signature_key;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const grossAmount = statusResponse.gross_amount;
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${orderId}${statusResponse.status_code}${grossAmount}${serverKey}`)
      .digest('hex');

    if (signatureKey !== expectedSignature) {
      console.error('Invalid signature!');
      return res.status(403).json({
        status: "error",
        message: "Invalid signature"
      });
    }

    // Find order
    const order = await Order.findOne({
      where: { payment_transaction_id: orderId },
      include: [
        { model: User, as: "user" },
        { 
          model: OrderItem, 
          as: "items",
          include: [{ model: Product, as: "product" }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    let paymentStatus = "pending";
    let isPaid = false;
    let paidAt = null;

    // Handle transaction status
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        paymentStatus = "settlement";
        isPaid = true;
        paidAt = new Date();
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = "settlement";
      isPaid = true;
      paidAt = new Date();
    } else if (transactionStatus === 'pending') {
      paymentStatus = "pending";
    } else if (transactionStatus === 'deny') {
      paymentStatus = "deny";
    } else if (transactionStatus === 'expire') {
      paymentStatus = "expire";
    } else if (transactionStatus === 'cancel') {
      paymentStatus = "cancel";
    }

    // Update order
    await order.update({
      payment_status: paymentStatus,
      is_paid: isPaid,
      paid_at: paidAt
    });

    console.log(`Order ${order.id} updated: payment_status=${paymentStatus}, is_paid=${isPaid}`);

    if (paymentStatus === "settlement" && order.user) {
      await sendPaymentSuccessEmail(order.user, order, order.items);
    }

    res.status(200).json({
      status: "success",
      message: "Notification processed"
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// GET ORDER BY ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: order
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// GET ALL ORDERS (User)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

const successOrderPayment = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        },
        {
          model: User,
          as: "user",
          attributes: ['id', 'name', 'email'] // Hanya ambil data yang diperlukan
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    // Cek status payment real-time dari Midtrans
    if (order.payment_status === 'pending' && order.payment_transaction_id) {
      try {
        const statusResponse = await coreApi.transaction.status(order.payment_transaction_id);
        
        let paymentStatus = order.payment_status;
        let isPaid = order.is_paid;
        let paidAt = order.paid_at;

        // Update status berdasarkan response Midtrans
        if (statusResponse.transaction_status === 'settlement' || 
            (statusResponse.transaction_status === 'capture' && statusResponse.fraud_status === 'accept')) {
          paymentStatus = 'settlement';
          isPaid = true;
          paidAt = new Date();

          await order.update({
            payment_status: paymentStatus,
            is_paid: isPaid,
            paid_at: paidAt
          });

          await order.reload();
        }
      } catch (midtransError) {
        console.error('Error checking Midtrans status:', midtransError);
      }
    }

    res.status(200).json({
      status: "success",
      message: order.is_paid 
        ? "Payment successful! Your order is being processed." 
        : "Payment is being verified. Please wait a moment.",
      data: {
        id: order.id,
        payment_status: order.payment_status,
        is_paid: order.is_paid,
        paid_at: order.paid_at,
        total_order_price: order.total_order_price,
        payment_transaction_id: order.payment_transaction_id,
        created_at: order.createdAt,
        items: order.items
      }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

module.exports = {
  createOrderByCart,
  handleMidtransNotification,
  getOrderById,
  getUserOrders,
  successOrderPayment
};