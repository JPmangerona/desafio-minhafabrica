export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'client' | 'viewer' | 'editor';
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
    ativo: boolean;
    ordem: number;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    nome: string;
    descricao?: string;
    preco: number;
    estoque: number;
    sku?: string;
    imagem_url?: string;
    categoria?: Category | string;
    ativo: boolean;
    destaque: boolean;
    createdAt: string;
    updatedAt: string;
}
