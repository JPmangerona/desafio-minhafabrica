import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { LoginController } from "./controllers/LoginController.js";
import { authenticated } from "./middleware/authenticated.js";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();

router.post('/login', loginController.login);
router.post('/user', userController.createUser);
router.get('/user', authenticated, userController.getAllUsers);
router.delete('/user', userController.deleteUser);

export default router;