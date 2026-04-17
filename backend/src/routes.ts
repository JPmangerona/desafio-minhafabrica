import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { LoginController } from "./controllers/LoginController.js";
import { CategoryController } from "./controllers/CategoryController.js";
import { ProductController } from "./controllers/ProductController.js";
import { LogoutController } from "./controllers/LogoutController.js";
import { authenticated } from "./middleware/authenticated.js";
import { upload } from "./config/multer.js";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const categoryController = new CategoryController();
const productController = new ProductController();
const logoutController = new LogoutController();

// Login
router.post('/login', loginController.login);

// Usuários
router.post('/user', userController.createUser);
router.get('/user', authenticated, userController.getAllUsers);
router.delete('/user', userController.deleteUser);

// Categorias
router.post('/category', upload.single('imagem'), categoryController.create);
router.get('/category', categoryController.list);
router.put('/category/:id', upload.single('imagem'), categoryController.update);
router.delete('/category/:id', categoryController.delete);

// Produtos
router.post('/product', upload.single('imagem'), productController.create);
router.get('/product', productController.list);
router.get('/product/category/:id', productController.listByCategory);
router.put('/product/:id', upload.single('imagem'), productController.update);
router.delete('/product/:id', productController.delete);

// Logout
router.post('/logout', logoutController.logout);

export default router;