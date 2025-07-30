const express = require('express')
const bcrypt = require('bcrypt');
const userModells = require('../Modells/userModells');
const jwt = require('jsonwebtoken')

const Registeruser = async (req, res) => {
    try {

        let { name, student_id, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModells({
            name,
            student_id,
            email,
            password: hashPassword
        })
        await newUser.save();
        res.status(200).json({ msg: "user Register successfully" });
    } catch (error) {
        res.status(500).json({ msg: "server Error" + error.message });
    }
};

const Login = async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await userModells.findOne({
            $or: [{ email: email }],
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.PASSKEY);
        // console.log(user.email);
        return res.status(200).json({ token, userId: user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
}

const allusers = async (req, res) =>{
    const user = await userModells.find();
    res.status(200).json({data : user})
}

module.exports = {
    Registeruser,
    Login,
    allusers,
}