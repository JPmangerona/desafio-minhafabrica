declare namespace Express {
    export interface Request {
        user?: {
            id: string;
            name: string;
            email: string;
            role: string;
            tenant_id?: string;
            permissions?: string[];
        };
        tenantId?: string;
    }
}
