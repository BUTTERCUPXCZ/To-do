import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signToken } from "../middleware/authenticate.js";
const prisma = new PrismaClient();


export const register = async (req, res) => {
    try {
        const { Fullname, email, password } = req.body;

        if (!Fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const employee = await prisma.user.create({
            data: {
                Fullname,
                email,
                password: hashpassword
            }
        });


        return res.status(201).json({ success: true, employee });
    } catch (error) {
        console.error("Error registering employee:", error);
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _, ...userSafe } = user;
        const token = signToken(user);

        return res.status(200).json({ success: true, user: userSafe, token });

    } catch (error) {
        console.log("Error logging in:", error);
    }
}

export const addEmployee = async (req, res) => {
    try {
        const { Fullname, email, Position, Department } = req.body;

        if (!Fullname || !email || !Position || !Department) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newEmployee = await prisma.employee.create({
            data: {
                Fullname,
                email,
                Position,
                Department
            }
        });
        return res.status(201).json({ success: true, employee: newEmployee });
    } catch (error) {
        console.error("Error adding employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const employees = await prisma.employee.findMany({

            skip: Number(skip),
            take: Number(limit),
            select: {
                id: true,
                Fullname: true,
                email: true,
                Position: true,
                Department: true,
            },

        });
        return res.status(200).json({ success: true, employees, count: employees.length });
    } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const DeleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employeeId = Number(id);
        if (!Number.isFinite(employeeId) || employeeId <= 0) {
            return res.status(400).json({ message: "Invalid id parameter" });
        }

        const result = await prisma.employee.delete({
            where: { id: employeeId }
        });

        res.status(200).json({ success: true, message: "Employee deleted successfully" });

    } catch (error) {
        console.error("Error deleting employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const editEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { Fullname, email, Position, Department } = req.body;

        if (!Fullname || !email || !Position || !Department) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: Number(id) },
            data: { Fullname, email, Position, Department }
        });

        return res.status(200).json({ success: true, employee: updatedEmployee });

    } catch (error) {
        console.error("Error editing employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}