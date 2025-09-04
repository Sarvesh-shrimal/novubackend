// index.js
const express = require("express")
const mongoose = require("mongoose")
const swaggerUi = require("swagger-ui-express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require('./src/routes/userRoutes/UserRoute.js')
const swaggerSpec = require("./swagger.js")
const {middleware} = require("express-openapi-validator")

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
  middleware({
    apiSpec: swaggerSpec,          
    // validateRequests: true,        
    validateResponses: true,      
  })
);

app.use("/api", router);

const PORT = process.env.PORT || 5000;
const db = process.env.DB_DEVELOPMENT_URL || process.env.MONGO_URI;


const startserver = async () => {
  try {
    await mongoose.connect(db);
    console.log("✅ Database Connected");

    await app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 Swagger Docs: http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test" && require.main === module) {
  console.log("hello");
  startserver();
}
// startserver();

module.exports = app;
