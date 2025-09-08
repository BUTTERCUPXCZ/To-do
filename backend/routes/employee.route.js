import express from "express";
import { register, login, addEmployee, getAllEmployees, DeleteEmployee, editEmployee } from "../controllers/employee.controller.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/addEmployee', addEmployee);

router.get('/getAllEmployees', getAllEmployees)
router.delete('/deleteEmployee/:id', DeleteEmployee);
router.put('/updateEmployee/:id', editEmployee);

export default router;