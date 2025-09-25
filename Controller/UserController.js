const User = require('../Model/User')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")




const register = async (req, res) => {
  try {
    const { name, email, password ,username} = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    })
    await newUser.save()
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User registered failed", error: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password,username } = req.body
    const user = await User.findOne({ email, });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }).json({ success: true, message: "Login Successfully",token, user: { id: user._id, name: user.name, email: user.email, username:user.username } })
  } catch (error) {
    res.status(500).json({ message: "User Login failed", error: error.message });
  }
}



const updateProfile = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const updateData = { name, username, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};




const logout= async(req,res)=>{
  try {
    res.clearCookie("token",{
      httpOnly:true,
    })
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
     console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Server error while logging out" });
  }
}



///this route is fetching user
const fetchProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Cannot fetch profile",
      error: error.message,
    });
  }
};








module.exports = { register, login, fetchProfile, logout, updateProfile }