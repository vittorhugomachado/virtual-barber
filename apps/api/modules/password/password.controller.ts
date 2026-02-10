import { Request, Response } from 'express';
import { handleControllerError } from '../../utils/errors';
import { prisma } from '../../lib/prisma';
import {
    generateResetTokenService,
    resetPasswordService,
    passwordResetEmailService,
    validateTokenService,
} from '../password/password.services';

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {

    const { email } = req.body;

    try {

        const barbershop = generateResetTokenService(email);

        const { token } = await generateResetTokenService(email);
        
        await passwordResetEmailService(email, token, restaurant?.barberShop.barbershopName);

        res.status(200).json({ message: 'Um link de redefinição de senha foi enviado para seu email' });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const validateToken = async (req: Request, res: Response): Promise<void> => {

    const { token } = req.params;

    try {

        await validateTokenService(token);

        res.status(200).json({ message: 'Token válido' });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {

    const { newPassword } = req.body;
    const { token } = req.params;

    try {

        await resetPasswordService(token, newPassword);

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

