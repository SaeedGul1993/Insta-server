const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/azaan/image/upload/v1589570435/images_mag7o7.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    password: {
        type: String,
        required: true
    }
})

mongoose.model("User", userSchema);