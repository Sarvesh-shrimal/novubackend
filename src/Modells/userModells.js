// src/Modells/userModells.js
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        student_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("studentuser", userSchema);

module.exports = UserModel