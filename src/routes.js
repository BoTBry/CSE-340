import express from 'express';

import { showHomePage } from './controller/index.js';
import { showOrganizationsPage } from './controller/organizations.js';
import { showCategoriesPage } from './controller/categories.js';
import { showProjectsPage } from './controller/projects.js';
import { testErrorPage } from './controller/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/categories', showCategoriesPage);
router.get('/projects', showProjectsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;