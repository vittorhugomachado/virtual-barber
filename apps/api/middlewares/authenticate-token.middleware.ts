import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('JWT_SECRET não definido');

interface UserPayload {
    userId: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: 'Token não fornecido' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

        if (typeof decoded.userId !== 'number') {
            throw new jwt.JsonWebTokenError('Payload inválido: userId deve ser um número');
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro no middleware JWT:', error);

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expirado' });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: 'Token inválido' });
            return;
        }
        res.status(500).json({ message: 'Erro interno durante a autenticação' });
        return;
    }
}
