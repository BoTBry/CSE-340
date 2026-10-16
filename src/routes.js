import express from 'express';

import { showHomePage } from './controller/index.js';
import { showOrganizationsPage, processNewOrganizationForm, organizationValidation } from './controller/organizations.js';
import { showCategoriesPage, showCategoryDetailsPage, showProjectDetailsPageById, showEditCategoryForm, processEditCategoryForm } from './controller/categories.js';
import { processAssignCategoriesForm, showAssignCategoriesForm, createNewCategoryPage, categoryValidation, processNewCategoryform } from './controller/categories.js';
import { showProjectsPage, processNewProjectForm, projectValidation, processEditProjectForm } from './controller/projects.js';
import { testErrorPage } from './controller/errors.js';
import { showOrganizationDetailsPage, showNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm } from './controller/organizations.js';
import { showProjectDetailsPage, showNewProjectForm, showEditProjectForm } from './controller/projects.js';
import { showUserRegistrationForm, registrationValidation, loginValidation, processUserRegistrationForm, getUserDetail, processEditUserForm, updateValidation, processRemoveVolunteer } from './controller/users.js';
import { showLoginForm, processLoginForm, processLogout, showDashboard, requireLogin, requireRole, showAllUserPage, showAdminDashboard, processVolunteer, showVolunteerStatus } from './controller/users.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);
router.get('/projects', showProjectsPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showVolunteerStatus, showProjectDetailsPage);

// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Route for service details page
router.get('/service/:id', showProjectDetailsPageById);

// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// Route to display the edit project form submission
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

//Route to handle the edit project form submission
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// Route for new category page
router.get('/new-category', requireRole('admin'), createNewCategoryPage);

// Route to handle new category form submission
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryform);

// Route to display the edit category form submission
router.get('/edit-category/:categoryId', requireRole('admin'), showEditCategoryForm);

// Route to handle the edit category form submission
router.post('/edit-category/:categoryId', requireRole('admin'), categoryValidation, processEditCategoryForm);

// User registration routes
router.get('/register', showUserRegistrationForm);

// Route to handle new user registration form submission
router.post('/register', registrationValidation, processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLoginForm);

// User logout route
router.get('/logout', requireLogin, processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Volunteer route
router.post('/project/:id/volunteer', requireLogin, processVolunteer);
router.post('/project/:id/remove-volunteer', requireLogin, processRemoveVolunteer);

// Protected admin only routes
router.get('/admin-dashboard', requireLogin, requireRole('admin'), showAdminDashboard);
router.get('/view-users', requireLogin, requireRole('admin'), showAllUserPage);
router.get('/edit-user/:id', requireLogin, requireRole('admin'), getUserDetail);
router.post('/edit-user/:id', requireLogin, requireRole('admin'), updateValidation, processEditUserForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;