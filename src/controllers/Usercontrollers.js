const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModells = require("../Modells/userModells.js");

 const Registeruser = async (req, res) => {
    try {
        let { name, student_id, email, password } = req.body;

        if(!name || !student_id || !email || !password) {
            return res.status(400).json({msg: "All Field are required"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new userModells({
            name,
            student_id,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error: " + error.message });
    }
};

 const Login = async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await userModells.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.PASSKEY, {
            expiresIn: "1d",
        });

        return res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

 const allusers = async (req, res) => {
    try {
        const users = await userModells.find();
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ msg: "Server error: " + error.message });
    }
};

module.exports = {
    allusers, Login, Registeruser
}
