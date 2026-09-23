// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) =>{
    const organizations = await getAllOrganizations();
    // console.log(organizations);

    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    console.log(organizationDetails);

    const projects = await getProjectsByOrganizationId(organizationId);
    console.log(projects);

    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};

export { showOrganizationsPage, showOrganizationDetailsPage };