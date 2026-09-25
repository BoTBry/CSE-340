// Import any needed model functions
import { getAllCategories, getCategoryById, getCategoriesByServiceProjectId, getServiceProjectsByCategoryId, getServiceProjectByProjectId } from '../models/categories.js';

const showCategoriesPage = async (req, res) =>{
    const categories = await getAllCategories();
    console.log(categories);

    const title = 'Service Categories';
    res.render('categories', {title, categories});
}

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);
    const categoryService = await getCategoriesByServiceProjectId(categoryId);
    const projectCategory = await getServiceProjectsByCategoryId(categoryId);
    console.log(categoryDetails);
    console.log(projectCategory);
    console.log(categoryService);

    const title = categoryDetails.name;
    res.render('Category', { title, categoryDetails, categoryService, projectCategory });
}

const showProjectDetailsPageById = async (req, res) => {
    const categoryId = req.params.id;
    const projectCategory = await getServiceProjectByProjectId(categoryId);

    console.log(projectCategory);

    const title = projectCategory.title;
    res.render('service', { title, projectCategory });
}

export { showCategoriesPage, showCategoryDetailsPage, showProjectDetailsPageById };