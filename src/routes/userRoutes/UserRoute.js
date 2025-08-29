import express from "express";
import { getNotifications } from "../../controllers/notification.js";
import { studentinfo } from "../../controllers/studentInfocontrollers.js";
import { Registeruser, Login, allusers } from "../../controllers/Usercontrollers.js";
import { authentication } from "../../middlewares/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/user-register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/user-register", Registeruser);

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", Login);

/**
 * @openapi
 * /api/all-user:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/all-user", authentication, allusers);

/**
 * @openapi
 * /api/student-info:
 *   post:
 *     summary: Submit student info and trigger notification
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - description
 *             properties:
 *               student_id:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Info saved and notification sent
 */
router.post("/student-info", authentication, studentinfo);

/**
 * @openapi
 * /api/notifications/{subscriberId}:
 *   get:
 *     summary: Get notifications for a subscriber
 *     tags:
 *       - Notifications
 *     parameters:
 *       - name: subscriberId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */
router.get("/notifications/:subscriberId", getNotifications);

export default router;
