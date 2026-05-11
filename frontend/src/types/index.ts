export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'superadmin' | 'admin' | 'cliente' | 'visualizador' | 'editor'; // [MULTI-TENANT] Adicionado 'superadmin'
    permissions?: string[];
    tenant_id?: string; // [MULTI-TENANT] ID da loja à qual o usuário pertence
    cpf?: string;
    endereco?: {
        rua: string;
        numero: string;
        cidade: string;
        cep: string;
    };
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    nome: string;
    descricao?: string;
    imagem_url?: string;
    ativo: boolean;
    ordem: number;
    tenant_id: string; // [MULTI-TENANT] ID da loja dona desta categoria
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    nome: string;
    descricao?: string;
    preco: number;
    custo?: number;
    estoque: number;
    sku?: string;
    imagem_url?: string;
    categoria?: Category | string;
    ativo: boolean;
    destaque: boolean;
    tenant_id: string; // [MULTI-TENANT] ID da loja dona deste produto
    createdAt: string;
    updatedAt: string;
}

// [MULTI-TENANT] Novo tipo para representar uma Loja (Tenant) no frontend
export interface Tenant {
    _id: string;
    name: string;
    slug: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}
