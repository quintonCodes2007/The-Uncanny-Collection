import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"]
    },
    username: {
        type: String,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [25, "Username cannot exceed 25 characters"],
        match: [
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers and underscores",
        ],
        },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    cartItems:[
        {
            quantity:{
                type: Number,
                default: 1
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    role:{
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    }
    //createdAt, updatedAt
    }, 
    {
    timestamps: true
    }
);



// presave hook to hash password before saving to database
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error("Error hashing password");
    }
})

    // Unique usernames, ignoring letter case.
    // Existing users without usernames are allowed.
    userSchema.index(
    { username: 1 },
    {
        unique: true,
        partialFilterExpression: {
        username: { $type: "string" },
        },
        collation: {
        locale: "en",
        strength: 2,
        },
    }
    );

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;