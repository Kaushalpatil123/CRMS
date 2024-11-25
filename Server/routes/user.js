const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { validateToken, Admin, Indiamart } = require('../middlewares/token.js');

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/getuser", validateToken, userController.getUsers);

router.put("/update/:userId", validateToken, Admin, userController.updateUser);

router.delete("/deleted/:userId", validateToken, Admin, userController.deleteUser);

router.get("/user-name", userController.getUsernames);

router.get("/password/:userId", validateToken, Admin, userController.getDecryptedPassword);

router.put('/user-wishlist/:id', userController.wishlistuser);

router.put("/undo-deleted-user/:userId", userController.undodeleteuser);

router.get("/user/profile", validateToken, userController.getProfile);

module.exports = router;
