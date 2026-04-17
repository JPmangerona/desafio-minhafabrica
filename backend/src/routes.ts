import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { LoginController } from "./controllers/LoginController.js";
import { CategoryController } from "./controllers/CategoryController.js";
import { ProductController } from "./controllers/ProductController.js";
import { authenticated } from "./middleware/authenticated.js";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const categoryController = new CategoryController();
const productController = new ProductController();

// Login
router.post('/login', loginController.login);

// Usuários
router.post('/user', userController.createUser);
router.get('/user', authenticated, userController.getAllUsers);
router.delete('/user', userController.deleteUser);

// Categorias
router.post('/category', categoryController.create);
router.get('/category', categoryController.list);
router.delete('/category/:id', categoryController.delete);

// Produtos
router.post('/product', productController.create);
router.get('/product', productController.list);
router.get('/product/category/:id', productController.listByCategory);
router.delete('/product/:id', productController.delete);

export default router;