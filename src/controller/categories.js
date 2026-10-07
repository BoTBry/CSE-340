// Import any needed model functions
import { getAllCategories, getCategoryById, getServiceProjectsByCategoryId, getServiceProjectByProjectId, getCategoriesByServiceProjectId, updateCategoryAssignments, createNewCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Organization name must be between 3 and 100 characters'),
]

const showCategoriesPage = async (req, res) =>{
    const categories = await getAllCategories();
    console.log(categories);

    const title = 'Service Categories';
    res.render('categories', {title, categories});
}

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);
    const projectCategory = await getServiceProjectsByCategoryId(categoryId);
    console.log(categoryDetails);
    console.log(projectCategory);

    const title = categoryDetails.name;
    res.render('category', { title, categoryDetails, projectCategory });
}

const showProjectDetailsPageById = async (req, res) => {
    const categoryId = req.params.id;
    const projectCategory = await getServiceProjectByProjectId(categoryId);

    console.log(projectCategory);

    const title = projectCategory.title;
    res.render('service', { title, projectCategory });
}
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const createNewCategoryPage  = async (req, res) => {
    const allCategories = await getAllCategories();
    console.log(allCategories);

    const title = 'Create New Category';
    res.render('new-category', {title});
};

const processNewCategoryform = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-category');
    }

    const {name} = req.body;
    const newCategory = await createNewCategory(name);

    // Set a success flash message
    req.flash('success', 'Category added successfully');
    res.redirect('/categories');

};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.categoryId;
    const categoryDetails = await getCategoryById(categoryId);
    console.log(categoryDetails);

    const title = 'Edit Category';
    res.render('edit-category', {title, categoryDetails});
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.categoryId;

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    await updateCategory(categoryId, name);
    
    // Set a success flash message
    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
};

export { showCategoriesPage, showCategoryDetailsPage, showProjectDetailsPageById, processAssignCategoriesForm, showAssignCategoriesForm, createNewCategoryPage, categoryValidation, processNewCategoryform, showEditCategoryForm, processEditCategoryForm };