import express from 'express';

import { showHomePage } from './controller/index.js';
import { showOrganizationsPage, processNewOrganizationForm, organizationValidation } from './controller/organizations.js';
import { showCategoriesPage, showCategoryDetailsPage, showProjectDetailsPageById, processAssignCategoriesForm, showAssignCategoriesForm } from './controller/categories.js';
import { showProjectsPage, processNewProjectForm, projectValidation, processEditProjectForm } from './controller/projects.js';
import { testErrorPage } from './controller/errors.js';
import { showOrganizationDetailsPage, showNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm } from './controller/organizations.js';
import { showProjectDetailsPage, showNewProjectForm, showEditProjectForm } from './controller/projects.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);
router.get('/projects', showProjectsPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Route for service details page
router.get('/service/:id', showProjectDetailsPageById);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Route to display the edit project form submission
router.get('/edit-project/:id', showEditProjectForm);

//Route to handle the edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;