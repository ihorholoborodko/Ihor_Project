import { Router } from "express";
import { apiController } from "./controller";

const router = Router();

router.get("/users", apiController.getUsers);
router.get("/users/:id", apiController.getUserById);
router.post("/users", apiController.createUser);

router.get("/posts/stats", apiController.getPostStats);
router.get("/posts/search", apiController.searchPostsUnsafe);

router.get("/posts", apiController.getPosts);
router.get("/posts/:id", apiController.getPostById);
router.post("/posts", apiController.createPost);
router.put("/posts/:id", apiController.updatePost);
router.delete("/posts/:id", apiController.deletePost);

router.get("/comments", apiController.getComments);
router.post("/comments", apiController.createComment);

export default router;