import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    }, 
    gender: {
        type: String,
        require: true,
        enum: ["male", "female"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                return /^\+?[1-9]\d{1,14}$/.test(v); 
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    profilePic: {
        type: String,
        default: "",
    }
}, { timestamps: true }
);

const User = mongoose.model("User", userSchema); 

export default User;