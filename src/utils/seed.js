require("dotenv").config();
const { sequelize, User, Category, Product, Review, Cart, CartItem, Coupon, Order, OrderItem } = require("../models/index.js");

const seed = async () => {
  try {
    console.log("Starting seed...");
    // sinkronisasi (dev). HATI-HATI: jangan pakai force:true kalau ada data penting.
    await sequelize.sync({ alter: true });
    console.log("DB synced (alter).");

    // ---------- USERS ----------
    console.log("Creating users...");
    const usersData = [
      { name: "Admin Toko", email: "admin@toko.test", password: "password123", role: "admin", phone: "081200000000", profile_img: "admin.jpg" },
      { name: "Budi Santoso", email: "budi@test.com", password: "secret1", role: "user", phone: "081211111111", profile_img: "budi.jpg" },
      { name: "Siti Aminah", email: "siti@test.com", password: "secret2", role: "user", phone: "081222222222", profile_img: "siti.jpg" },
      { name: "Rudi Pratama", email: "rudi@test.com", password: "secret3", role: "user", phone: "081233333333", profile_img: "rudi.jpg" },
    ];

    const users = [];
    for (const u of usersData) {
      const created = await User.create(u);
      users.push(created);
    }
    console.log(`Created ${users.length} users.`);

    // ---------- CATEGORIES ----------
    console.log("Creating categories...");
    const categoriesData = [
      { name: "Elektronik", slug: "elektronik", image: "elektronik.jpg" },
      { name: "Fashion", slug: "fashion", image: "fashion.jpg" },
      { name: "Rumah Tangga", slug: "rumah-tangga", image: "rumah.jpg" },
    ];
    const categories = [];
    for (const c of categoriesData) {
      const created = await Category.create(c);
      categories.push(created);
    }
    console.log(`Created ${categories.length} categories.`);

    // ---------- PRODUCTS ----------
    console.log("Creating products...");
    const productsData = [
      {
        title: "Smartphone X200",
        slug: "smartphone-x200",
        description: "Smartphone X200 dengan layar 6.5 inch, RAM 8GB, penyimpanan 128GB, kamera 48MP.",
        quantity: 50,
        price: 3500000,
        price_after_discount: 3200000,
        colors: ["black", "white"],
        image_cover: "x200-cover.jpg",
        images: ["x200-1.jpg", "x200-2.jpg"],
        category_id: categories.find(c => c.name === "Elektronik").id,
        ratings_average: 4.5,
        ratings_quantity: 10,
      },
      {
        title: "Headphone Bluetooth Z7",
        slug: "headphone-z7",
        description: "Headphone nirkabel Z7, noise-cancelling, baterai 30 jam pemakaian.",
        quantity: 100,
        price: 750000,
        price_after_discount: 650000,
        colors: ["black", "blue"],
        image_cover: "z7-cover.jpg",
        images: ["z7-1.jpg"],
        category_id: categories.find(c => c.name === "Elektronik").id,
        ratings_average: 4.2,
        ratings_quantity: 24,
      },
      {
        title: "T-Shirt Basic",
        slug: "tshirt-basic",
        description: "Kaos katun nyaman, tersedia S-M-L-XL.",
        quantity: 200,
        price: 80000,
        price_after_discount: 70000,
        colors: ["white", "black", "grey"],
        image_cover: "tshirt-cover.jpg",
        images: ["tshirt-1.jpg"],
        category_id: categories.find(c => c.name === "Fashion").id,
        ratings_average: 4.0,
        ratings_quantity: 15,
      },
      {
        title: "Sneakers Runner Pro",
        slug: "sneakers-runner-pro",
        description: "Sneakers untuk lari dengan bantalan empuk dan sol anti slip.",
        quantity: 60,
        price: 550000,
        price_after_discount: 0,
        colors: ["white", "black"],
        image_cover: "sneakers-cover.jpg",
        images: ["sneakers-1.jpg", "sneakers-2.jpg"],
        category_id: categories.find(c => c.name === "Fashion").id,
        ratings_average: 4.6,
        ratings_quantity: 40,
      },
      {
        title: "Blender DapurMax 500W",
        slug: "blender-dapurmax",
        description: "Blender serbaguna 500W, kapasitas 1.5L, cocok untuk jus dan sambal.",
        quantity: 80,
        price: 300000,
        price_after_discount: 270000,
        colors: ["red", "white"],
        image_cover: "blender-cover.jpg",
        images: ["blender-1.jpg"],
        category_id: categories.find(c => c.name === "Rumah Tangga").id,
        ratings_average: 4.1,
        ratings_quantity: 8,
      },
      {
        title: "Set Panci Stainless 3 pcs",
        slug: "set-panci-3pcs",
        description: "Set panci stainless anti lengket, cocok untuk masak sehari-hari.",
        quantity: 40,
        price: 420000,
        price_after_discount: 380000,
        colors: ["silver"],
        image_cover: "panci-cover.jpg",
        images: ["panci-1.jpg"],
        category_id: categories.find(c => c.name === "Rumah Tangga").id,
        ratings_average: 4.3,
        ratings_quantity: 12,
      },
      {
        title: "Lampu Meja LED",
        slug: "lampu-meja-led",
        description: "Lampu meja LED dengan brightness adjustable dan port USB.",
        quantity: 150,
        price: 120000,
        price_after_discount: 100000,
        colors: ["white"],
        image_cover: "lampu-cover.jpg",
        images: ["lampu-1.jpg"],
        category_id: categories.find(c => c.name === "Rumah Tangga").id,
        ratings_average: 4.0,
        ratings_quantity: 6,
      },
      {
        title: "Powerbank 20000mAh",
        slug: "powerbank-20000",
        description: "Powerbank kapasitas besar 20000mAh, dual output, fast charge.",
        quantity: 120,
        price: 220000,
        price_after_discount: 200000,
        colors: ["black"],
        image_cover: "powerbank-cover.jpg",
        images: ["powerbank-1.jpg"],
        category_id: categories.find(c => c.name === "Elektronik").id,
        ratings_average: 4.4,
        ratings_quantity: 20,
      },
    ];

    const products = [];
    for (const p of productsData) {
      const created = await Product.create(p);
      products.push(created);
    }
    console.log(`Created ${products.length} products.`);

    // ---------- CARTS & CART ITEMS ----------
    console.log("Creating carts and cart items...");
    const carts = [];
    for (const user of users) {
      const cart = await Cart.create({ user_id: user.id, total_cart_price: 0, total_price_after_discount: 0 });
      carts.push(cart);
    }

    // Add items to Budi's cart (users[1])
    const budiCart = carts[1];
    const addCartItem = async (cart, product, qty = 1, color = null) => {
      const item = await CartItem.create({
        cart_id: cart.id,
        product_id: product.id,
        quantity: qty,
        color,
        price: product.price_after_discount || product.price,
      });
      return item;
    };

    await addCartItem(budiCart, products.find(p => p.title === "Smartphone X200"), 1, "black");
    await addCartItem(budiCart, products.find(p => p.title === "Powerbank 20000mAh"), 2, "black");

    // Siti's cart
    const sitiCart = carts[2];
    await addCartItem(sitiCart, products.find(p => p.title === "T-Shirt Basic"), 3, "white");
    await addCartItem(sitiCart, products.find(p => p.title === "Sneakers Runner Pro"), 1, "white");

    // Rudi's cart (empty intentionally)
    console.log("Carts created and populated (some).");

    // ---------- REVIEWS ----------
    console.log("Creating reviews...");
    const reviewsData = [
      { user_id: users[1].id, product_id: products.find(p => p.title === "Smartphone X200").id, user_name: users[1].name, rating: 5, comment: "Performa mantap dan kameranya jernih." },
      { user_id: users[2].id, product_id: products.find(p => p.title === "T-Shirt Basic").id, user_name: users[2].name, rating: 4, comment: "Bahannya nyaman, ukuran pas." },
      { user_id: users[3].id, product_id: products.find(p => p.title === "Sneakers Runner Pro").id, user_name: users[3].name, rating: 5, comment: "Cushioning nya enak buat lari." },
      { user_id: users[2].id, product_id: products.find(p => p.title === "Powerbank 20000mAh").id, user_name: users[2].name, rating: 4, comment: "Isi daya cepat dan tahan lama." },
    ];

    for (const r of reviewsData) {
      await Review.create(r);
    }
    console.log(`${reviewsData.length} reviews created.`);

    // ---------- COUPON ----------
    console.log("Creating coupon...");
    const coupon = await Coupon.create({
      name: "DISKON10",
      expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari kedepan
      discount: 10, // interpret as percent in logic
      created_by: users[0].id, // admin created
    });
    console.log("Coupon created:", coupon.name);

    // ---------- ORDERS (checkout dari cart) ----------
    console.log("Creating orders from carts...");

    // helper to calculate totals
    const calcCartTotals = async (cart) => {
      const items = await CartItem.findAll({ where: { cart_id: cart.id }, include: [{ model: Product, as: "product" }] });
      let subtotal = 0;
      for (const it of items) {
        subtotal += (it.price || (it.product.price_after_discount || it.product.price)) * it.quantity;
      }
      return { items, subtotal };
    };

    // Budi checkout (apply coupon)
    const budiTotals = await calcCartTotals(budiCart);
    const budiTax = Math.round(budiTotals.subtotal * 0.02); // 2% tax
    const budiShipping = 25000;
    // apply coupon DISKON10 -> 10% off subtotal
    const discountValue = Math.round((coupon.discount / 100) * budiTotals.subtotal);
    const budiTotal = budiTotals.subtotal - discountValue + budiTax + budiShipping;

    const orderBudi = await Order.create({
      user_id: users[1].id,
      tax_price: budiTax,
      shipping_address: { details: "Jl. Kebon Jeruk 12", phone: users[1].phone, city: "Jakarta", postalCode: "11530" },
      shipping_price: budiShipping,
      total_order_price: budiTotal,
      payment_method_type: "card",
      is_paid: true,
      paid_at: new Date(),
      is_delivered: false,
    });

    for (const it of budiTotals.items) {
      await OrderItem.create({
        order_id: orderBudi.id,
        product_id: it.product_id,
        quantity: it.quantity,
        color: it.color,
        price: it.price,
      });
    }
    console.log("Order created for Budi:", orderBudi.id);

    // Siti checkout (no coupon)
    const sitiTotals = await calcCartTotals(sitiCart);
    const sitiTax = Math.round(sitiTotals.subtotal * 0.02);
    const sitiShipping = 20000;
    const sitiTotal = sitiTotals.subtotal + sitiTax + sitiShipping;

    const orderSiti = await Order.create({
      user_id: users[2].id,
      tax_price: sitiTax,
      shipping_address: { details: "Jl. Merdeka 7", phone: users[2].phone, city: "Bandung", postalCode: "40123" },
      shipping_price: sitiShipping,
      total_order_price: sitiTotal,
      payment_method_type: "cash",
      is_paid: false,
      is_delivered: false,
    });

    for (const it of sitiTotals.items) {
      await OrderItem.create({
        order_id: orderSiti.id,
        product_id: it.product_id,
        quantity: it.quantity,
        color: it.color,
        price: it.price,
      });
    }
    console.log("Order created for Siti:", orderSiti.id);

    // update carts totals (simple)
    const updateCartTotals = async (cart) => {
      const { subtotal } = await calcCartTotals(cart);
      // assume no coupon except Budi (we won't alter DB coupon usage)
      await cart.update({ total_cart_price: subtotal, total_price_after_discount: subtotal });
    };
    await updateCartTotals(budiCart);
    await updateCartTotals(sitiCart);

    console.log("Seed finished successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
