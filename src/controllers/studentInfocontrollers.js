const studentinfoModell = require("../Modells/studentinfoModell");
const jwt = require('jsonwebtoken')
const { Novu } = require('@novu/node')
// const { config } = require("dotenv")

// config({
//     path: "./.env"
// })

const novu = new Novu("4427e7f40fcc94310c78abb45bc3591c");

const studentinfo = async (req, res) => {
    let { student_id, description } = req.body;


    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, "39rijw4tj94wyj94yjgmn9erhy5y");

    const subscriberId = decoded._id; // extract from token securely

    const newUser = new studentinfoModell({
        student_id,
        description
    })
    await newUser.save()
    await novu.trigger('student-notification', {
        to: {
            subscriberId
        },
        payload: {
            senderName: decoded.name,     // ✅ from decoded token
            senderId: decoded._id,
            description
        }
    });
    res.status(200).json({ msg: "Info save successfully" });
}

module.exports = {
    studentinfo,
}