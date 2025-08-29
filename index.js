// index.js
import express from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./src/routes/userRoutes/UserRoute.js";
import { swaggerSpec } from "./swagger.js";
import { middleware as openApiValidator } from "express-openapi-validator"; // ✅ correct import

dotenv.config({ path: "./.env" });

const app = express();

const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by Cors"));
    },
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

app.use(
  openApiValidator({
    apiSpec: swaggerSpec,          
    validateRequests: true,        
    validateResponses: true,      
  })
);

app.use("/api", router);

const PORT = process.env.PORT || 5000;
const db = process.env.DB_DEVELOPMENT_URL;

const startserver = async () => {
  try {
    await mongoose.connect(db);
    console.log("✅ Database Connected");

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
