import db from './db.js';

// Add a volunteer to a project
const addVolunteerToProject = async (user_id, project_id) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        RETURNING user_id, project_id;
    `;

    const result = await db.query(query, [user_id, project_id]);

    return result.rows[0];
};

// Remove a volunteer from a project
const removeVolunteerFromProject = async (user_id, project_id) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2
        RETURNING user_id, project_id;
    `;

    const result = await db.query(query, [user_id, project_id]);

    if (result.rowCount === 0) {
        throw new Error("Volunteer record not found.");
    }

    return result.rows[0];
};

// Get all projects a user has volunteered for
const getProjectsByVolunteer = async (user_id) => {
    const query = `
        SELECT
            service_project.project_id,
            service_project.title,
            service_project.description,
            service_project.date,
            service_project.location,
            service_project.organization_id,
            organization.name AS organization_name
        FROM project_volunteer
        JOIN service_project
            ON project_volunteer.project_id = service_project.project_id
        JOIN organization
            ON service_project.organization_id = organization.organization_id
        WHERE project_volunteer.user_id = $1
        ORDER BY service_project.date ASC;
    `;

    const result = await db.query(query, [user_id]);

    return result.rows;
};


const isUserVolunteering = async (user_id, project_id) => {
    const query = `
        SELECT 1
        FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;

    const result = await db.query(query, [user_id, project_id]);

    return result.rowCount > 0;
};


export { addVolunteerToProject, removeVolunteerFromProject, getProjectsByVolunteer, isUserVolunteering };