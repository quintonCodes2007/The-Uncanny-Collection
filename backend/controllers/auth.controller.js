import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js"; 

const generateTokens = (userId) => {
  // created two different tokens, one for access and one for refresh
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // expires in 7 days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, { 
    httpOnly: true,//prenvent XSS attacks(cross site scripting attacks)
    secure: process.env.NODE_ENV === "production", 
    sameSite:"strict", //prevent CSRF attacks (cross site request forgery attacks)
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, { 
    httpOnly: true,//prenvent XSS attacks(cross site scripting attacks)
    secure: process.env.NODE_ENV === "production", 
    sameSite:"strict", //prevent CSRF attacks (cross site request forgery attacks)
    maxAge: 7 * 24 * 60 * 1000 // 7 days
  });
};

export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {

      const cleanUsername =
    typeof username === "string" ? username.trim() : "";

  if (
    cleanUsername.length < 3 ||
    cleanUsername.length > 25 ||
    !/^[a-zA-Z0-9_]+$/.test(cleanUsername)
  ) {
    return res.status(400).json({
      message:
        "Username must be 3–25 characters and contain only letters, numbers or underscores",
    });
  }

  const existingUsername = await User.findOne({
    username: cleanUsername,
  }).collation({
    locale: "en",
    strength: 2,
  });

  if (existingUsername) {
    return res.status(409).json({
      message: "This cursed identity has already been claimed",
    });
  }

    const existingEmail = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "This email address is already registered. Please log in instead.",
      });
    }

    const user = await User.create({
      name,
      username: cleanUsername,
      email,
      password,
    });

    //authentication token generation logic
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({user:{
      _id: user._id, 
      name: user.name,
      username: user.username, 
      email: user.email, 
      role: user.role},
      message: "User created successfully",});
  } catch (error) {
      if (error.code === 11000) {
    return res.status(409).json({
      message: error.keyPattern?.username
        ? "This cursed identity has already been claimed"
        : "An account with this email already exists",
    });
  }
    console.error("Error in signup controller:", error.message);
    res.status(500).json({message: error.message});
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        username: user.username ?? null,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("error in login controller:", error.message);
    res.status(500).json({ message: error.message })
  }
};

export const logout = async (req, res) => {

  try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refreshToken:${decoded.userId}`);
    }
    
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({message: "Logged out successfully"});
  } catch (error) {
    console.error("error in logout controller:", error.message);
    res.status(500).json({message: "Server error", error:error.message});
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedRefreshToken = await redis.get(`refreshToken:${decoded.userId}`);

    if (storedRefreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ message: "Access token refreshed successfully" });
  } catch (error) {
    console.error("Error in refresh token controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });  
  }
};

//TODO: implement get profile later
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
}
	














