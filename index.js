const express = require('express')
const mongoose = require('mongoose')
const app = express();
const { config } = require("dotenv")
const cors = require('cors')
const cookieParser = require('cookie-parser');
const router = require('./src/routes/userRoutes/UserRoute');
config({
    path: "./.env",
});

const allowedOrigins = [
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by Cors"));
        }
    },
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const db = process.env.DB_DEVELOPMENT_URL;

const startserver = async () => {
    try {

        await mongoose.connect(db, {});
        console.log("Database Connected")

        app.use('/api', router)
        // app.use('api', router)

        app.listen(PORT, () => {
            console.log(`app is runing on port ${PORT}`)
        });


    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startserver();