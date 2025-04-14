
const UserSchema = require('../modals/UserSchema');
const bcryptJs = require('bcryptjs');
const generateAndSetToken = require('../generateToken/generateTokenAndSetToken');

/*------------------------------------------
            Register Controller
------------------------------------------*/
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // console.log("Registering user with data:", req.body);
        

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingUser = await UserSchema.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcryptJs.hash(password, 10);


        const newUser = new UserSchema({
            name,
            email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/6.x/avataaars/png?seed=${name}`,
            isVerified:true,
        });

        await newUser.save();
        const token = generateAndSetToken(newUser._id, res);

       

        res.status(201).json({ 
            success: true, 
            token, 
            user: newUser, 
            message: "User successfully registered." 
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Something went wrong in registration!" 
        });
    }
};







/*------------------------------------------
            Login  Controller
------------------------------------------*/
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "fields are required.",
            })
        }
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or password.",
            })
        }
        const isValidPassword = await bcryptJs.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({
                success: false,
                message: "Invalid email or password.",
            })
        }
        user.lastLogin = new Date();
        await user.save();

        const token = generateAndSetToken(user._id, res);

        res.status(200).json({
            success: true,
            token,
            message: "Logged in successfully",
            data: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Something went wrong in loginUser function: ", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong in loginUser!" });
    }
}






/*------------------------------------------
            Logout  Controller
------------------------------------------*/
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({
                success: false,
                message: "You are not logged in.",
            })
        }
        res.clearCookie("token");
        res.json({
            success: true,
            message: "User Successfully logged out."
        })
    } catch (error) {
        console.log("Something went wrong in logoutUser function: ", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong in logoutUser!" });
    }
}
















/*--------------------------------------------------
            authorizedUser  Controller
----------------------------------------------------*/
const authorizedUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Fetch the latest user data from the database
        const user = await UserSchema.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error in authorizedUser:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


/*--------------------------------------------------
            fetchingToken  Controller
----------------------------------------------------*/

const fetchingToken = async (req, res) => {
    const token = req.cookies?.token;
    res.json({ hasToken: !!token });
}




module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authorizedUser,
    fetchingToken,
}