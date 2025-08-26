// index.js
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./src/routes/userRoutes/UserRoute.js";  
import YAML from "yamljs";
const openapiDoc = YAML.load("./swagger.yaml")

const app = express();

// Load env variables
dotenv.config({ path: "./.env" });

const allowedOrigins = ["http://localhost:5173"];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by Cors"));
            }
        },
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.get("/docs.json", (req, res)  => res.json())

const PORT = process.env.PORT || 5000;
const db = process.env.DB_DEVELOPMENT_URL;

const startserver = async () => {
    try {
        await mongoose.connect(db, {});
        console.log("✅ Database Connected");

        // API routes
        app.use("/api", router);

        // Swagger Docs
        app.get("/docs.json", (req, res) => res.json(swaggerSpec));
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Swagger Docs: http://localhost:${PORT}/docs`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startserver();
