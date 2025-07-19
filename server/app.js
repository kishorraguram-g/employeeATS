require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const EmployeeRouter = require('./routes/EmployeeRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const attendenceRouter = require('./routes/AttendenceRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const UserController = require('./controllers/UserController');
const checkRole = require('./middlewares/checkRole');

app.use(express.json());

app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true
}));

app.use("/employees", EmployeeRouter);

app.use("/attendance", authMiddleware.employeeProtect, attendenceRouter);

app.get('/employees', authMiddleware.employeeProtect, checkRole(['HR', 'Admin']), UserController.getAllUsers);

app.use("/department", authMiddleware.staffProtect, departmentRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Employee Attendance System!');
});

module.exports = app;
