// Import any needed model functions
import { getAllCategories } from '../models/categories.js';

const showCategoriesPage = async (req, res) =>{
    const categories = await getAllCategories();
    console.log(categories);

    const title = 'Service Categories';
    res.render('categories', {title, categories});
}

export { showCategoriesPage };