import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { LoginController } from "./controllers/LoginController.js";
import { CategoryController } from "./controllers/CategoryController.js";
import { ProductController } from "./controllers/ProductController.js";
import { SearchController } from "./controllers/SearchController.js";
import { LogoutController } from "./controllers/LogoutController.js";
import { DashboardController } from "./controllers/DashboardController.js";
import { authenticated } from "./shared/middlewares/authenticated.js";
import { authorized } from "./shared/middlewares/authorized.js";
import { upload } from "./config/multer.js";

export const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const categoryController = new CategoryController();
const productController = new ProductController();
const searchController = new SearchController();
const logoutController = new LogoutController();
const dashboardController = new DashboardController();

// --- API V1 ---
const v1Prefix = "/api/v1";

// Autenticação
router.post(`${v1Prefix}/auth/login`, loginController.login);
router.post(`${v1Prefix}/auth/logout`, logoutController.logout);

// Busca Global
router.get(`${v1Prefix}/search`, searchController.search);

// Dashboard (Apenas Admin)
router.get(`${v1Prefix}/dashboard`, authenticated, authorized(['admin']), dashboardController.getStats);

// Usuários (Apenas Admin)
router.get(`${v1Prefix}/users`, authenticated, authorized(['admin']), userController.getAllUsers);
router.post(`${v1Prefix}/users`, authenticated, authorized(['admin']), userController.createUser);
router.put(`${v1Prefix}/users/:id`, authenticated, authorized(['admin']), userController.updateUser);
router.delete(`${v1Prefix}/users`, authenticated, authorized(['admin']), userController.deleteUser);

// Categorias (Admin/Editor pode criar/editar, Público pode listar)
router.get(`${v1Prefix}/categories`, categoryController.list); // Público
router.get(`${v1Prefix}/admin/categories`, authenticated, authorized(['admin', 'editor']), categoryController.listAdmin);
router.post(`${v1Prefix}/categories`, authenticated, authorized(['admin', 'editor']), upload.single('imagem'), categoryController.create);
router.put(`${v1Prefix}/categories/:id`, authenticated, authorized(['admin', 'editor']), upload.single('imagem'), categoryController.update);
router.delete(`${v1Prefix}/categories/:id`, authenticated, authorized(['admin']), categoryController.delete);

// Produtos (Admin/Editor pode criar/editar, Público pode listar)
router.get(`${v1Prefix}/products`, productController.list); // Público
router.get(`${v1Prefix}/products/category/:id`, productController.listByCategory); // Público
router.get(`${v1Prefix}/admin/products`, authenticated, authorized(['admin', 'editor']), productController.listAdmin);
router.post(`${v1Prefix}/products`, authenticated, authorized(['admin', 'editor']), upload.single('imagem'), productController.create);
router.put(`${v1Prefix}/products/:id`, authenticated, authorized(['admin', 'editor']), upload.single('imagem'), productController.update);
router.delete(`${v1Prefix}/products/:id`, authenticated, authorized(['admin']), productController.delete);

export default router;