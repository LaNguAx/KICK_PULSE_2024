import CategoriesService from '../../services/dashboard/category_service.js';

export async function getIndex(req, res) {

  const categories = await CategoriesService.getCategories();
  res.render('../views/frontend/login', {
    categories, session: req.session
  });
}
