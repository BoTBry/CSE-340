import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getUserInfo } from '../models/users.js';
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

        // Redirect back to the new project form
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

        // Redirect back to the new project form
        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        
        if (user) {
            req.session.user = user;

            req.session.userDetail = {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role_id: user.role_id
                };

            console.log(user);
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
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
        console.log(user);

        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
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


export { registrationValidation, loginValidation, requireRole, showAdminDashboard, requireLogin, showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, showDashboard };