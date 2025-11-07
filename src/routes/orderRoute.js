const express = require('express');
const { protect } = require('../middlewares/core/authMiddleware');

const {
    createOrderByCart,
    handleMidtransNotification,
    getOrderById,
    getUserOrders,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', protect, createOrderByCart);
router.post('/notification', handleMidtransNotification);
router.get('/:id', protect, getOrderById);
router.get('/', protect, getUserOrders);

module.exports = router;