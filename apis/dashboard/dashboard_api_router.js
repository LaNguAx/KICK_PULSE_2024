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

const router = express.Router();

router.route('/products').get(getProducts).post(createProduct);
router.route('/products/:id').get(getProduct).delete(deleteProduct).put(updateProduct);
router.route('/products/gender/:gender').get(getProductsByGender);

router.route('/suppliers').get(getSuppliers).post(createSupplier);
router.route('/suppliers/:id').get(getSupplier).delete(deleteSupplier);
router.route('/suppliers/:id/brands').get(getSupplierBrands);

router.route('/brands').get(getBrands).post(createBrand);
router.route('/brands/:id').get(getBrand).put(updateBrand).delete(deleteBrand);


router.route('/categories').get(getCategories).post(createCategory);
router.route('/categories/:id').get(getCategory).delete(deleteCategory).put(updateCategory);
router.route('/categories/products/:id').get(getCategoryProducts);

router.route('/orders').get(getOrders).post(createOrder);
router.route('/orders/:id').get(getOrder).put(updateOrder).delete(deleteOrder);

router.route('/users').get(getUsers);
router.route('/users/:email').get(getUser).delete(deleteUser).put(updateUser);
router.route('/users/:email/role').put(updateUserRole);


export default router;
