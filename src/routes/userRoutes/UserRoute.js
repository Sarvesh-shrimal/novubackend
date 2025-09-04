const express = require("express");
const { getNotifications } = require("../../controllers/notification.js");
// const { studentinfo } = require("../../controllers/studentInfocontrollers.js");
const { Registeruser, Login, allusers } = require("../../controllers/Usercontrollers.js");
const authentication = require("../../middlewares/auth.js");
const  validate  = require("../../middlewares/validate.js");
const { registerSchema } = require("../../validators/userSchema.js");


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
 *               - student_id
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               student_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request (missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: All Field are required
 */
router.post("/user-register", validate(registerSchema), Registeruser);


/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

router.post("/login", Login);

/**
 * @openapi
 * /api/all-user:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users   # <-- REQUIRED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
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
// router.post("/student-info", authentication, studentinfo);

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


module.exports = router;