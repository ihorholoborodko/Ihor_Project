const express = require("express");
const controller = require("./controller");
const router = express.Router();

router.get("/users", controller.getUsers);
router.get("/users/:id", controller.getUserById);
router.post("/users", controller.createUser);

router.get("/posts", controller.getPosts);
router.get("/posts/:id", controller.getPostById);
router.post("/posts", controller.createPost);

router.get("/comments", controller.getComments);
router.post("/comments", controller.createComment);

module.exports = router;