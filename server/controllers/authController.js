const Employee = require('../models/EmployeeModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const handleError = require('./errorController');

const signin = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};


exports.signup = async (req, res) => {
    try {
        const {
            name, email, password, confirmPassword,
            department, designation,joiningDate
        } = req.body;
        console.log(req.body);

        if (password !== confirmPassword) {
            console.log("Password and confirmPassword do not match");
            return res.status(400).json({
                status: "fail",
                message: "Password and confirmPassword do not match 💥"
            });
        
        }


        const creator = req.user; 
        if (!creator) {
            console.log("Creator not found in request");
            return res.status(401).json({
                status: "fail",
                message: "You must be logged in to create users"
            });
        }


        const allowedRoles = [
            'Developer', 'Lead Developer', 'Project Manager', 
            'HR', 'Admin', 'Manager', 'QA', 'Tech Support', 
            'UX/UI Designer', 'System Architect'
        ];


        if (!allowedRoles.includes(designation)) {
            
            console.log("Invalid role designation");
            return res.status(400).json({
                status: "fail",
                message: "Invalid role designation"
            });
        }

        if (["Manager", "HR"].includes(designation)) {
            if (creator.designation !== "Admin") {
                console.log("Only Admin can create Manager or HR roles");
                return res.status(403).json({
                    status: "fail",
                    message: "Only Admin can create Manager or HR roles"
                });
            }
        }
        if (designation === "Admin") {
            console.log("Admin account creation is restricted");
            return res.status(403).json({
                status: "fail",
                message: "You cannot create Admin accounts through signup"
            });
        }
        console.log("Creator designation:", creator.designation);
        if ( creator.designation != "HR" && designation === "Employee") {
            console.log("Only HR can create Employee accounts");
            return res.status(403).json({
                status: "fail",
                message: "Only HR can create Employee accounts"
            });
        }

        
   
        console.log("Creating new employee...");
        const newEmployee = await Employee.create({
            name, email, password, department, designation,joiningDate
        });

        console.log("New employee created:", newEmployee);
        const token = signin(newEmployee._id);
        newEmployee.password = undefined;

        res.status(201).json({
            status: "success",
            token,
            data: { user: newEmployee }
        });

    } catch (err) {
        console.log("Error during signup", err);
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email," ",password)

        
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password"
            });
        }

       
        const employee = await Employee.findOne({ email }).select('+password');
        // console.log("Employee found:", employee);
        if (!employee || password !== employee.password) { 
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password"
            });
        }

        console.log("user succesfully logged in  and token sent wit status code 200");
        const token = signin(employee._id);
        res.status(200).json({
            status: "success",
            token,
            designation: employee.designation,
            employeeId: employee._id,
        });

    } catch (err) {
        console.log("Error during login", err);
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const { email, password, updatePassword, confirmPassword } = req.body;

    
        if (!email) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email'
            });
        }

       const employee = await Employee.findOne({ email }).select('+password');
        if (!employee || !(await employee.comparePassword(password, employee.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password"
            });
        }

        if (updatePassword !== confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: "Update Password and confirm password do not match"
            });
        }

        employee.password = updatePassword;
        await employee.save();

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully',
            user: employee
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.protect = async (req, res, next) => {
    try {
         let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in! Please log in to get access"
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const freshEmployee = await Employee.findById(decoded.id);
        if (!freshEmployee) {
            return res.status(404).json({
                status: "fail",
                message: "The user belonging to the token no longer exists"
            });
        }

        if (freshEmployee.changePasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: "fail",
                message: "Employee recently changed password! Please log in again"
            });
        }

        req.user = freshEmployee;
        // console.log('protect :',req.user);
        next();

    } catch (err) {
        console.log("Error in protection middleware", err);
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};

exports.staffProtect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in! Please log in to get access"
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const freshEmployee = await Employee.findById(decoded.id);
        if (!freshEmployee) {
            return res.status(404).json({
                status: "fail",
                message: "The user belonging to the token no longer exists"
            });
        }

         if (freshEmployee.changePasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: "fail",
                message: "Employee recently changed password! Please log in again"
            });
        }

       const allowedRoles = [
            'Developer', 'Lead Developer', 'Project Manager', 
            'HR', 'Admin', 'Manager', 'QA', 'Tech Support', 
            'UX/UI Designer', 'System Architect'
        ];
        if (!allowedRoles.includes(freshEmployee.designation)) {
            return res.status(403).json({
                status: "fail",
                message: "You are not authorized to access this route"
            });
        }

        req.user = freshEmployee;
        next();

    } catch (err) {
        console.log("Error in staff protection middleware", err);
        res.status(500).json({
            status: "fail",
            message: 'Staff authentication failed'
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const employee = req.user;

        res.status(200).json({
            status: 'success',
            data: { user: employee }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, department, designation, joiningDate } = req.body;
        const updater = req.user;

        // console.log('hi');
        const employee = await Employee.findById(id);

        if (!employee) {
            console.log("Employee not found");
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found'
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (department) updateData.department = department;
        if (joiningDate) updateData.joiningDate = joiningDate;

        if (designation) {

            if (["Manager", "HR"].includes(designation) && updater.designation !== "Admin") {
                console.log("Only Admin can update Manager or HR roles");
                return res.status(403).json({
                    status: 'fail',
                    message: 'Only Admin can update Manager or HR roles'
                });
            }

            if (designation === "Employee" && updater.designation !== "HR") {
                console.log("Only HR can update Employee accounts");
                return res.status(403).json({
                    status: 'fail',
                    message: 'Only HR can update Employee accounts'
                });
            }

            if (designation === "Admin") {
                console.log("Admin role cannot be updated");
                return res.status(403).json({
                    status: 'fail',
                    message: 'Admin role cannot be updated'
                });
            }

            if (id === updater._id.toString() && designation !== updater.designation) {
                console.log("You cannot change your own role");
                return res.status(403).json({
                    status: 'fail',
                    message: 'You cannot change your own role'
                });
            }

            updateData.designation = designation;
        }

        console.log("Updating employee with data:", updateData);
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        console.log("Updated employee:", updatedEmployee);

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedEmployee
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};