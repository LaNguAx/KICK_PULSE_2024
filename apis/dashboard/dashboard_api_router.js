import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  getProductsByGender,
  updateProduct
} from './products_api.js';

import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierBrands,
  getSuppliers,
} from './suppliers_api.js';
import {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands,
} from './brands_api.js';

import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrdersGroupedByEmail,
  getOrdersInAscOrder,
} from './orders_api.js';


import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryProducts,
} from './categories_api.js';

import {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  updateUserRole
} from './users_api.js';

import { isAdmin } from '../../controllers/auth_Controller.js';

const router = express.Router();

router.route('/products').get(getProducts).post(isAdmin, createProduct);
router.route('/products/:id').get(getProduct).delete(isAdmin, deleteProduct).put(isAdmin, updateProduct);
router.route('/products/gender/:gender').get(getProductsByGender);

router.route('/suppliers').get(getSuppliers).post(isAdmin, createSupplier);
router.route('/suppliers/:id').get(getSupplier).delete(isAdmin, deleteSupplier);
router.route('/suppliers/:id/brands').get(getSupplierBrands);

router.route('/brands').get(getBrands).post(isAdmin, createBrand);
router.route('/brands/:id').get(getBrand).put(isAdmin, updateBrand).delete(isAdmin, deleteBrand);


router.route('/categories').get(getCategories).post(isAdmin, createCategory);
router.route('/categories/:id').get(getCategory).delete(isAdmin, deleteCategory).put(isAdmin, updateCategory);
router.route('/categories/products/:id').get(getCategoryProducts);

router.route('/orders').get(getOrders).post(createOrder);
router.route('/orders/groupby').get(getOrdersGroupedByEmail);
router.route('/orders/asc').get(getOrdersInAscOrder);
router.route('/orders/:id').get(getOrder).put(isAdmin, updateOrder).delete(isAdmin, deleteOrder);

router.route('/users').get(getUsers);
router.route('/users/:email').get(getUser).delete(isAdmin, deleteUser).put(isAdmin, updateUser);
router.route('/users/:email/role').put(isAdmin, updateUserRole);


export default router;
