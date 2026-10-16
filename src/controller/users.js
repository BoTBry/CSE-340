import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getUserInfo, getAllUserDetail, getUserDetailById, updateUser } from '../models/users.js';
import { addVolunteerToProject, removeVolunteerFromProject, getProjectsByVolunteer, isUserVolunteering } from '../models/volunteer.js';
import { getProjectDetails } from '../models/projects.js'
import { body, validationResult } from 'express-validator';

const registrationValidation = [
    // Name validation
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

    // Email validation
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    // Password validation
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 7 })
        .withMessage('Password must be at least 7 characters long')
        // .matches(/[A-Z]/)
        // .withMessage('Password must contain at least one uppercase letter')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('Password must contain at least one symbol')
];

const loginValidation = [
// Email validation
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    // Password validation
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 7 })
        .withMessage('Password must be at least 7 characters long')
        // .matches(/[A-Z]/)
        // .withMessage('Password must contain at least one uppercase letter')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('Password must contain at least one symbol')
];

const updateValidation = [
// Email validation
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

// Name validation
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the registration form
        return res.redirect('/register');
    }
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm  = async (req, res) => {
    const title = 'Login';

    res.render('login', {title});
};

const processLoginForm  = async (req, res) => {
        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the login form
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        
        if (user) {
            req.session.user = user;

            // req.session.userDetail = {
            //     user_id: user.user_id,
            //     name: user.name,
            //     email: user.email,
            //     role_id: user.role_id
            // };

            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
                console.log(user);
            }

            res.redirect('/dashboard');
        
        } else{
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
        
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }

};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    console.log(user);
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

const requireRole = (requiredRole) => {
    return (req, res, next) => {

        const user = req.session.user;
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
                console.log(user);
            }
            return res.redirect('/login');
        }

        if (user.role_name !== requiredRole) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.status(403).render('errors/403', {title: '403 Error'});
        }

        next();
    };
};

const showAdminDashboard = async (req, res) => {
    // const user = req.session.user;
    // console.log(user);

    res.render('admin-dashboard', { title: 'Welcome Admin' });
};

const showAllUserPage = async (req, res) => {
    const details = await getAllUserDetail();
    const title = `Users`;
    console.log(details);

    res.render('view-users', {details, title});
};

const getUserDetail = async (req, res) => {
    const queryparams = req.params.id;
    const details = await getUserDetailById(queryparams);
    const title = 'User info';
    console.log(details);

    res.render('edit-user', {title, details});
};

const processEditUserForm = async (req, res) => {
    const userId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect(`/edit-user/${userId}`);
    }

    const { name, email, role } = req.body;

    await updateUser(userId, name, email, role);
    
    // Set a success flash message
    req.flash('success', 'User details updated successfully!');

    res.redirect(`/view-users`);
};

const processVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const user = req.session.user.user_id;

    try{
        // const userDetail = await getUserDetailById(user.user_id);
        const volunteerUser = await addVolunteerToProject(user, projectId);
        console.log(volunteerUser);

        // Set a flash message
        req.flash('success', 'You have successfully volunteered for this project!');

        return res.redirect(`/project/${projectId}`);

    } catch (error) {
        console.error("Error volunteering for project:", error);

        req.flash("error", "Unable to volunteer for this project.");

        return res.redirect(`/project/${projectId}`);
    }
};


const showVolunteerStatus = async (req, res, next) => {
    const project_id = req.params.id;

    try {
        let isVolunteer = false;

        if (req.session.user) {
            isVolunteer = await isUserVolunteering(
                req.session.user.user_id,
                project_id
            );
        }

        res.locals.isVolunteer = isVolunteer;

        next();
    } catch (error) {
        next(error);
    }
};

const processRemoveVolunteer = async (req, res, next) => {
    const project_id = req.params.id;
    const user_id = req.session.user.user_id;

    try {
        await removeVolunteerFromProject(user_id, project_id);

        req.flash('success', 'You have successfully removed yourself as a volunteer.');
        res.redirect(`/project/${project_id}`);
    } catch (error) {
        next(error);
    }
};



export { registrationValidation, processRemoveVolunteer, showVolunteerStatus, processVolunteer, processEditUserForm, updateValidation,  getUserDetail, showAllUserPage, loginValidation, requireRole, showAdminDashboard, requireLogin, showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, showDashboard };