import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { LoginController } from "./controllers/LoginController.js";
import { CategoryController } from "./controllers/CategoryController.js";
import { ProductController } from "./controllers/ProductController.js";
import { SearchController } from "./controllers/SearchController.js";
import { LogoutController } from "./controllers/LogoutController.js";
import { authenticated } from "./middleware/authenticated.js";
import { authorized } from "./middleware/authorized.js";
import { upload } from "./config/multer.js";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const categoryController = new CategoryController();
const productController = new ProductController();
const searchController = new SearchController();
const logoutController = new LogoutController();

// Login
router.post('/login', loginController.login);

// Busca Global
router.get('/search', searchController.search);

// Usuários (Apenas Admin)
router.post('/user', authenticated, authorized(['admin']), userController.createUser);
router.get('/user', authenticated, authorized(['admin']), userController.getAllUsers);
router.put('/user/:id', authenticated, authorized(['admin']), userController.updateUser);
router.delete('/user', authenticated, authorized(['admin']), userController.deleteUser);

// Categorias
router.post('/category', authenticated, authorized(['admin', 'editor']), upload.single('imagem'), categoryController.create);
router.get('/admin/category', authenticated, authorized(['admin', 'editor']), categoryController.listAdmin);
router.get('/category', categoryController.list); // Público para a vitrine
router.put('/category/:id', authenticated, authorized(['admin', 'editor']), upload.single('imagem'), categoryController.update);
router.delete('/category/:id', authenticated, authorized(['admin']), categoryController.delete);

// Produtos
router.post('/product', authenticated, authorized(['admin', 'editor']), upload.single('imagem'), productController.create);
router.get('/admin/product', authenticated, authorized(['admin', 'editor']), productController.listAdmin);
router.get('/product', productController.list); // Público para a vitrine
router.get('/product/category/:id', productController.listByCategory); // Público
router.put('/product/:id', authenticated, authorized(['admin', 'editor']), upload.single('imagem'), productController.update);
router.delete('/product/:id', authenticated, authorized(['admin']), productController.delete);

// Logout
router.post('/logout', logoutController.logout);

export default router;