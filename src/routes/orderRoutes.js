import express from 'express';
import { asyncApiHandler } from '../utils/asyncHandler';
import Order from '../models/order';
import buildResponse from '../utils/build-response';
import { ERROR } from '../../public/js/utils/constants';

const router = express.Router();

// 내 주문 가져오기
router.get(
  '/api/order',
  asyncApiHandler(async (req, res) => {
    const myOrders = await Order.find({ userId: req.user._id })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    if (!myOrders.length) {
      return res.json(buildResponse({ myOrders: [] }));
    }

    res.json(buildResponse({ myOrders }));
  })
);

// 주문 등록
router.post(
  '/api/order',
  asyncApiHandler(async (req, res) => {
    const { products, address, phone, totalPrice } = req.body;

    const newOrder = new Order({
      products: products,
      userId: req.user._id,
      totalPrice: totalPrice,
      address: address,
      phone: phone,
    });

    await newOrder.save();

    res.json(buildResponse());
  })
);

// 주문 취소
router.put(
  '/api/order/cancel/:orderId',
  asyncApiHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json(buildResponse(null, ERROR.ORDER_NOT_FOUND));
    }
    order.status = '주문취소';
    await order.save();

    res.json(buildResponse());
  })
);

// 주문 전체 가져오기
router.get(
  '/api/orders',
  asyncApiHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate('userId', 'email username')
      .populate('products.productId', 'title')
      .sort({ createdAt: -1 });

    res.json(buildResponse({ orders }));
  })
);

// 주문 상태 수정
router.put(
  '/api/order/:orderId/status',
  asyncApiHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json(buildResponse(null, ERROR.ORDER_NOT_FOUND));
    }
    order.status = status;
    await order.save();
    res.json(buildResponse());
  })
);

// 주문 삭제
router.delete(
  '/api/order/:orderId',
  asyncApiHandler(async (req, res) => {
    const orderId = req.params.orderId;

    const order = await Order.findByIdAndRemove(orderId);
    if (!order) {
      return res.status(404).json(buildResponse(null, ERROR.ORDER_NOT_FOUND));
    }
    res.json(buildResponse());
  })
);

export default router;