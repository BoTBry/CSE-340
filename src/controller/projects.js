// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects } from '../models/projects.js';
import { getProjectDetails } from '../models/projects.js';
import { getCategoriesByServiceProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    // const projects = await getAllProjects();
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    console.log(projects);

    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const queryParams = req.params.id;
    const projectDetails = await getProjectDetails(queryParams);
    const categories = await getCategoriesByServiceProjectId(queryParams);

    console.log(projectDetails);
    console.log(categories);
    const title = projectDetails.title;
    res.render('project', { title, projectDetails, categories });
};

export { showProjectsPage, showProjectDetailsPage };