import { Request, Response } from 'express';
import { handleControllerError } from '../../../utils/errors';
import { generateResetTokenService, resetPasswordService, passwordResetEmailService, validateTokenService } from './password.services';

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        if (!email) {
            res.status(400).json({ message: 'Email é obrigatório' });
            return;
        }

        const ownerUser = await generateResetTokenService(email);

        const { token } = ownerUser;

        await passwordResetEmailService(email, token, ownerUser?.barberShop?.barbershopName ?? undefined);

        res.status(200).json({ message: 'Um link de redefinição de senha foi enviado para seu email' });
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const validateToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
        if (typeof token !== 'string') {
            res.status(400).json({ message: 'Token inválido' });
            return;
        }

        await validateTokenService(token);

        res.status(200).json({ message: 'Token válido' });
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { newPassword } = req.body;
    const { token } = req.params;

    try {
        if (typeof token !== 'string') {
            res.status(400).json({ message: 'Token inválido' });
            return;
        }

        if (!newPassword) {
            res.status(400).json({ message: 'Nova senha é obrigatória' });
            return;
        }

        await resetPasswordService(token, newPassword);

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
};
