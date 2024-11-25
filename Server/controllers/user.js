const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { getToken } = require("../middlewares/token");
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../middlewares/enc");

exports.signup = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        // Role,
        mobile
      } = req.body;
      console.log(req.body);
      if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingUser = await User.findOne({
        email, isDeleted: false
      });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const hashedPassword = await encrypt(password);
      const newUser = new User({
        email,
        password: hashedPassword,
        userName: name,
        Role: "User",
        mobile
      });
      await newUser.save();
      res.status(201).json({
        status: "Success",
        message: "User created successfully",
        data: newUser,
      });
    }
    catch (error) 
    {
    console.error("Registration failed:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          type: "Login",
          message: "email and password are required",
        });
      }
  
      const user = await User.findOne({ email, isDeleted: false });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const decryptedPassword = decrypt(user.password);
      const isPasswordValid = password === decryptedPassword;
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
      console.log("token")
      const token = getToken(user);
      console.log(token)
      return res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        role: user.Role,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.createDefaultUsers = async () => {
    const defaultUsers = [
      {
        Role: "Admin",
        userName: "admin",
        mobile: "8987564784",
        email: "admin@gmail.com",
        password: "admin"
      },
      {
        Role: "Indiamart",
        userName: "Indiamart",
        mobile: "9876543210",
        email: "indiamart@gmail.com",
        password: "indiamart"
      }
    ];

    for (const user of defaultUsers) {
      try {
        const existingUser = await User.findOne({ email: user.email, isDeleted: false });
        if (!existingUser) {
          const hashedPassword = encrypt(user.password);
          const newUser = new User({
            ...user,
            password: hashedPassword
          });
          await newUser.save();
          console.log(`Default ${user.Role} user created successfully`);
        } else {
          console.log(`Default ${user.Role} user already exists`);
        }
      } catch (error) {
        console.error(`Error creating default ${user.Role} user:`, error.message);
      }
    }
  };
  
  exports.getUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let query = { Role: "User" };
        if (currentUser.Role !== "Admin") {
            query.isDeleted = false;
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found with Role 'User'" });
        }

        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

  exports.updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, mobile, password } = req.body;
  
      const user = await User.findOne({_id: userId, isDeleted: false});
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.userName = name;
      if (email) user.email = email;
      if (mobile) user.mobile = mobile;
      // if (Role) user.Role = Role;

      if (req.body.password) {
        user.password = encrypt(password);
      }
  
      await user.save();
  
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: user
      });
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        status: "success",
        message: "User deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.getUsernames = async (req, res) => {
    try {
      const users = await User.find({ Role: "User", isDeleted: false }).select('userName');
      
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found with Role 'User'" });
      }
  
      const usernames = users.map(user => user.userName);
  
      res.status(200).json({
        status: "success",
        message: "Usernames retrieved successfully",
        data: usernames
      });
    } catch (error) {
      console.error("Error fetching usernames:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.getDecryptedPassword = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findOne({_id: userId, isDeleted: false});
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const decryptedPassword = decrypt(user.password);
  
      res.status(200).json({
        status: "success",
        message: "Password decrypted successfully",
        data: {
          userId: user._id,
          email: user.email,
          Password: decryptedPassword
        }
      });
    } catch (error) {
      console.error("Error decrypting password:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.wishlistuser = async (req,res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if(!user){
        return res.status(404).json({ error: 'user not found' });
      }
      const isWishlist = user.wishlist;
      const userUpdated = await User.findByIdAndUpdate(id, { wishlist: !isWishlist }, { new: true});
      const message = !isWishlist ? "User added to wishlist successfully" : "User removed from wishlist successfully";
      res.status(200).json({ message, user:userUpdated });
    } catch (error) {
      res.status(500).json({ error: error.message })    
    }
  };

  exports.undodeleteuser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findByIdAndUpdate(userId, { isDeleted: false }, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        status: "success",
        message: "User retrieve successfully"
      });
    } catch (error) {
      console.error("Error retrieve user:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .select('-password') 
            .lean(); 

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (user.isDeleted) {
            return res.status(403).json({
                status: 'error',
                message: 'User account has been deleted'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User profile fetched successfully',
            data: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                mobile: user.mobile,
                Role: user.Role,
                wishlist: user.wishlist,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Error in getProfile:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
};