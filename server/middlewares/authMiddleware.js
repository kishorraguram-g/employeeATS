const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
exports.employeeProtect = (req, res, next) => {
    console.log('Hello from Employee Middleware');
    authController.protect(req, res, next);
};

exports.staffProtect = (req, res, next) => {
    console.log('Hello from Staff Middleware');
    authController.staffProtect(req, res, next);
};

exports.authenticateUser = (req, res, next) => {
   
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'Authorization token missing' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ status: 'fail', message: 'Invalid token' });
        }
        req.user = decoded;  
        next();
    });
};
