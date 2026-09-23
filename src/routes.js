import express from 'express';

import { showHomePage } from './controller/index.js';
import { showOrganizationsPage } from './controller/organizations.js';
import { showCategoriesPage } from './controller/categories.js';
import { showProjectsPage } from './controller/projects.js';
import { testErrorPage } from './controller/errors.js';
import { showOrganizationDetailsPage } from './controller/organizations.js';
import { showProjectDetailsPage } from './controller/projects.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);
router.get('/projects', showProjectsPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for Project details page
router.get('/project/:id', showProjectDetailsPage);


// error-handling routes
router.get('/test-error', testErrorPage);

export default router;