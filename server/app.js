const express = require('express');
const cors = require('cors');
const app = express();


const EmployeeRouter = require('./routes/EmployeeRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const attendenceRouter = require('./routes/AttendenceRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const UserController = require('./controllers/UserController');
const checkRole=require('./middlewares/checkRole')

app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/employees", EmployeeRouter);

app.use("/attendance", authMiddleware.employeeProtect, attendenceRouter);


app.get('/employees',authMiddleware.employeeProtect, checkRole(['HR','Admin']), UserController.getAllUsers);

app.get('/', (req, res) => {
    res.send('Welcome to the Employee Attendance System!');
});



app.use("/department", authMiddleware.staffProtect, departmentRouter);


module.exports = app;