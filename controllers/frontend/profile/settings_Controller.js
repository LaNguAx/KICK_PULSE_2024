import CategoriesService from '../../../services/dashboard/category_service.js';
import BrandService from '../../../services/dashboard/brand_service.js';

export async function getIndex(req, res) {
  const categories = await CategoriesService.getCategories();
  const brandNames = await BrandService.getBrands();
  categories.brandNames = brandNames;
  res.render('../views/frontend/profile/settings', { categories, session: req.session });
}
