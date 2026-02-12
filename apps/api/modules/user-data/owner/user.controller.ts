import { Request, Response } from 'express';
import { isValidEmail, isValidPhone, isValidCNPJ, isValidCPF } from './utils/field-error-checker';
import { serviceGetUserData, userDataUpdateService, serviceDeleteUser } from './user.service';
import { handleControllerError, AppError } from '../../../utils/errors';

export const getUserData = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        const user = await serviceGetUserData(userId);

        res.status(200).json(user);
        return;

    } catch (error) {

        handleControllerError(res, error);

    }
};

export const updateUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.user?.userId);
        const updateData = req.body;

        const allowedFields = ['barbershopName', 'phoneNumber', 'email', 'cnpj', 'cpf', 'slug', 'address'];
        
        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Campos inválidos para atualização', 400);
        }

        if (updateData.email && !isValidEmail(updateData.email)) {
            throw new AppError('Email inválido', 400);
        }

        if (updateData.phoneNumber && !isValidPhone(updateData.phoneNumber)) {
            throw new AppError('Telefone inválido', 400);
        }

        if (updateData.cnpj && !isValidCNPJ(updateData.cnpj)) {
            throw new AppError('CNPJ inválido', 400);
        }

        if (updateData.cpf && !isValidCPF(updateData.cpf)) {
            throw new AppError('CPF inválido', 400);
        }

        await userDataUpdateService(userId, updateData);

        res.status(200).json({ 
            success: true,
            message: 'Dados atualizados com sucesso' 
        });

    } catch (error) {
        handleControllerError(res, error);
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        await serviceDeleteUser(userId);

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
        return;

    } catch (error) {

        handleControllerError(res, error);

    }
};