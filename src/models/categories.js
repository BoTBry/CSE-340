import db from './db.js'

const getAllCategories = async() => {
    const query = `SELECT category_id, name FROM category;`;
    const result = await db.query(query);

    return result.rows;
}

const getCategoryById = async (id) => {
    const query = `SELECT
    category_id, name
    FROM category
    WHERE category_id = $1;`;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
}

const getCategoriesByServiceProjectId = async (id) => {
    const query = `SELECT
        category.category_id,
        category.name
    FROM category
    JOIN project_category
        ON category.category_id = project_category.category_id
    WHERE project_category.project_id = $1;`;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getServiceProjectsByCategoryId = async (id) => {
    const query = `SELECT
        service_project.project_id,
        service_project.title,
        service_project.description,
        service_project.date,
        service_project.location,
        service_project.organization_id
    FROM service_project
    JOIN project_category
        ON service_project.project_id = project_category.project_id
    WHERE project_category.category_id = $1;`;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const getServiceProjectByProjectId = async (id) => {
    const query = `SELECT
        service_project.project_id,
        service_project.title,
        service_project.description,
        service_project.date,
        service_project.location,
        service_project.organization_id
    FROM service_project
    JOIN project_category
        ON service_project.project_id = project_category.project_id
    WHERE service_project.project_id = $1;`;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
    
}

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

export { getAllCategories, getCategoryById, getCategoriesByServiceProjectId, getServiceProjectsByCategoryId, getServiceProjectByProjectId, updateCategoryAssignments };