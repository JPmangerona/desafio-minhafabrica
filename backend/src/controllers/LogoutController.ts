import type { Request, Response } from "express";

export class LogoutController {
    logout = (_req: Request, res: Response) => {
        res.clearCookie('auth_token', {
            httpOnly: true,
            sameSite: 'strict',
        });
        return res.status(200).json({ 
            success: true,
            data: { message: 'Logout realizado com sucesso.' } 
        });
    }
}
