import mongoose from "mongoose";

const studentInformationSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "studentuser",
            required: true,
        },
    },
    { timestamps: true }
);

const studentinfoModell = mongoose.model("studentinfo", studentInformationSchema);

export default studentinfoModell;
