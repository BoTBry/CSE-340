import bcrypt from 'bcrypt';
import db from './db.js'

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
        return null;
    }

    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
};

const getUserInfo = async (email) => {
    const sql = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.created_at,
            r.role_name,
            r.role_description
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;

    const result = await db.query(sql, [email]);

    return result.rows[0] || null;
};

const getAllUserDetail = async () => {
    const query = `SELECT
        users.user_id,
        users.name,
        users.email,
        users.created_at,
        roles.role_name
    FROM users
    JOIN roles
        ON users.role_id = roles.role_id;`;
    
    const result = await db.query(query);
    return result.rows.length > 0 ? result.rows : null;

};

const getUserDetailById = async (id) => {
    const query = `
    SELECT
        users.user_id,
        users.name,
        users.email,
        users.created_at,
        roles.role_name,
        users.role_id
    FROM users
    JOIN roles
        ON users.role_id = roles.role_id
    WHERE users.user_id = $1;`;

    const result = await db.query(query, [id]);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const updateUser = async (user_id, name, email, role_id) => {
    const query = `UPDATE users
        SET
            name = $1,
            email = $2,
            role_id = $3
        WHERE user_id = $4
        RETURNING user_id, name, email, created_at, role_id;`;

    const result = await db.query(query, [ name, email, role_id, user_id]);

    if (result.rowCount === 0) {
        throw new Error("User not found.");
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('User Updated:', result.rows[0].user_id);
    }

    return result.rows[0];
};

export { createUser, getUserInfo, authenticateUser, getAllUserDetail, getUserDetailById, updateUser };