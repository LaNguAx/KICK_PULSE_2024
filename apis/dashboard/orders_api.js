import OrderService from '../../services/dashboard/order_service.js';

// Get all orders
export async function getOrders(req, res) {
  try {
    const orders = await OrderService.getOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new order
export async function createOrder(req, res) {
  try {
    const order = { ...req.body };

    const newOrder = await OrderService.createOrder(order);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single order by ID
export async function getOrder(req, res) {
  const { id } = req.params;
  try {
    const order = await OrderService.getOrder(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function updateOrder(req, res) {
  const { id } = req.params;
  const newOrderData = { ...req.body };

  try {
    const updatedOrder = await OrderService.updateOrder(id, newOrderData);
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


// Delete a order by ID
export async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    const deletedOrder = await OrderService.deleteOrder(id);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
