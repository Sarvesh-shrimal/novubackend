const mongoose = require ('mongoose')

const studentinformation = new mongoose.Schema({
    description : {
        type: String,
        require : true,
    }, 
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentuser"
    },
    
}, 
    {timestamps: true}
);

module.exports = mongoose.model("studentinfor", studentinformation);