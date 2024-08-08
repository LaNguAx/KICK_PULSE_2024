import { OrdersModel } from '../../models/dashboard/order.js';

const getOrders = async () => {
  try {
    return await OrdersModel.find();
  } catch (err) {
    console.error('Error retrieving orders:', err);
    throw new Error('Failed to retrieve orders');
  }
};

const getOrder = async (id) => {
  try {
    const order = await OrdersModel.findById(id);
    if (!order) throw new Error('Order not found');
    return order;
  } catch (err) {
    console.error(`Error finding order with ID ${id}:`, err);
    throw new Error('Failed to retrieve order');
  }
};

const createOrder = async (order) => {
  try {

    const { firstName, lastName, email, address, country, zip, ccName, ccNumber, ccExpiration, ccCvv, cart, total, orderedBy } = order;

    const validatedOrder = {
      firstName,
      lastName,
      email,
      address,
      country,
      zip,
      paymentDetails: { ccName, ccNumber, ccExpiration, ccCvv },
      cart,
      total
    };
    if (orderedBy)
      validatedOrder.orderedBy = orderedBy;

    const newOrder = new OrdersModel(validatedOrder);

    return await newOrder.save();
  } catch (err) {
    console.error('Error saving order:', err);
    throw new Error('Failed to save order');
  }
};

const deleteOrder = async (id) => {
  try {
    const deletedOrder = await OrdersModel.findByIdAndDelete(id);
    if (!deletedOrder) throw new Error('Order not found');
    return deletedOrder;
  } catch (err) {
    console.error(`Error deleting order with ID ${id}:`, err);
    throw new Error('Failed to delete order');
  }
};

const updateOrder = async (id, options) => {
  try {
    const updatedOrder = await OrdersModel.findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) throw new Error('Order not found');
    return updatedOrder;
  } catch (err) {
    console.error(`Error editing order with ID ${id}:`, err);
    throw new Error('Failed to edit order');
  }
};

const getOrdersByIds = async (orderIds) => {
  try {

    // Fetch the orders by their IDs
    const orders = await OrdersModel.find({ _id: { $in: orderIds } });

    return orders;
  } catch (error) {
    console.error('Error fetching orders by Ids:', error);
    throw error;
  }
}

export default {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  getOrdersByIds
};
