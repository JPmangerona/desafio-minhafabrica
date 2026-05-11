import { Router } from "express";
import { UserController } from "./controllers/UserController.js";
import { LoginController } from "./controllers/LoginController.js";
import { CategoryController } from "./controllers/CategoryController.js";
import { ProductController } from "./controllers/ProductController.js";
import { SearchController } from "./controllers/SearchController.js";
import { LogoutController } from "./controllers/LogoutController.js";
import { DashboardController } from "./controllers/DashboardController.js";
import { authenticated } from "./shared/middlewares/authenticated.js";
import { hasPermission } from "./shared/middlewares/hasPermission.js";
import { tenantContext } from "./shared/middlewares/tenantContext.js"; // [MULTI-TENANT] Novo middleware
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

// Autenticação (Rotas públicas, SEM tenant necessário)
router.post(`${v1Prefix}/auth/login`, loginController.login);
router.post(`${v1Prefix}/auth/logout`, logoutController.logout);

// Busca Global (Rota pública — o tenantId vem via query param ?tenant=xxx)
router.get(`${v1Prefix}/search`, searchController.search);

// Dashboard (Apenas Admin de loja — superadmin NÃO acessa dashboard)
// [MULTI-TENANT] tenantContext garante que req.tenantId esteja preenchido
router.get(`${v1Prefix}/dashboard`, authenticated, hasPermission('dashboard.read'), tenantContext, dashboardController.getStats);

// Usuários (Admin de loja vê só os seus, Superadmin vê todos)
// [MULTI-TENANT] superadmin pode listar todos os usuários, mas admin de loja só vê os seus
router.get(`${v1Prefix}/users`, authenticated, hasPermission('users.read'), tenantContext, userController.getAllUsers);
router.post(`${v1Prefix}/users`, authenticated, hasPermission('users.write'), tenantContext, userController.createUser);
router.put(`${v1Prefix}/users/:id`, authenticated, hasPermission('users.write'), tenantContext, userController.updateUser);
router.delete(`${v1Prefix}/users/:id`, authenticated, hasPermission('users.write'), tenantContext, userController.deleteUser);

// Categorias (Admin/Editor pode criar/editar, Público pode listar)
// [MULTI-TENANT] Rotas públicas (list) recebem tenantId via query param ?tenant=xxx
// [MULTI-TENANT] Rotas admin usam tenantContext para extrair o tenantId do JWT
router.get(`${v1Prefix}/categories`, categoryController.list); // Público (precisa de ?tenant=xxx)
router.get(`${v1Prefix}/admin/categories`, authenticated, hasPermission('categories.read'), tenantContext, categoryController.listAdmin);
router.post(`${v1Prefix}/categories`, authenticated, hasPermission('categories.write'), tenantContext, upload.single('imagem'), categoryController.create);
router.put(`${v1Prefix}/categories/:id`, authenticated, hasPermission('categories.write'), tenantContext, upload.single('imagem'), categoryController.update);
router.delete(`${v1Prefix}/categories/:id`, authenticated, hasPermission('categories.write'), tenantContext, categoryController.delete);

// Produtos (Admin/Editor pode criar/editar, Público pode listar)
// [MULTI-TENANT] Mesma lógica das categorias
router.get(`${v1Prefix}/products`, productController.list); // Público (precisa de ?tenant=xxx)
router.get(`${v1Prefix}/products/category/:id`, productController.listByCategory); // Público (precisa de ?tenant=xxx)
router.get(`${v1Prefix}/admin/products`, authenticated, hasPermission('products.read'), tenantContext, productController.listAdmin);
router.post(`${v1Prefix}/products`, authenticated, hasPermission('products.write'), tenantContext, upload.single('imagem'), productController.create);
router.put(`${v1Prefix}/products/:id`, authenticated, hasPermission('products.write'), tenantContext, upload.single('imagem'), productController.update);
router.delete(`${v1Prefix}/products/:id`, authenticated, hasPermission('products.write'), tenantContext, productController.delete);

export default router;
