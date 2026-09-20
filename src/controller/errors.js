// Import any needed model functions (none are needed for the error pages, so this is empty)
    
// Define any controller functions

// Test route for 500 errors
const testErrorPage = async (req, res) =>{
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
}

export { testErrorPage };