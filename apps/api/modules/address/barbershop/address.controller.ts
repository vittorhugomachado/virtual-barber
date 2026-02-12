import { Request, Response } from 'express';
import { isValidZipCode } from './utils/zip-code-validator';
import { serviceGetAddress, serviceUpdateOrCreateAddress, serviceDeleteAddress } from './address.services';
import { handleControllerError, AppError } from '../../../utils/errors';
import { BrazilianState } from '../../../generated/prisma/enums';

const isValidBrazilianState = (state: string): state is BrazilianState => {
    return Object.values(BrazilianState).includes(state as BrazilianState);
};

export const getAddress = async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.user?.userId);

    try {
        const address = await serviceGetAddress(userId);
        res.status(200).json(address);
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.user?.userId);
        const updateData = req.body;

        const allowedFields = ['street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode', 'latitude', 'longitude'];

        const isValidUpdate = Object.keys(updateData).every((key) => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Campos inválidos para atualização');
        }

        if (Object.keys(updateData).length === 0) {
            throw new AppError('Nenhuma alteração detectada');
        }
        if (updateData.zipCode && !isValidZipCode(updateData.zipCode)) {
            throw new AppError('CEP inválido');
        }

        if (updateData.state && !isValidBrazilianState(updateData.state)) {
            throw new AppError('Estado inválido');
        }

        if (updateData.latitude !== undefined && updateData.latitude !== null) {
            if (typeof updateData.latitude !== 'number' || updateData.latitude < -90 || updateData.latitude > 90) {
                throw new AppError('Latitude inválida');
            }
        }

        if (updateData.longitude !== undefined && updateData.longitude !== null) {
            if (typeof updateData.longitude !== 'number' || updateData.longitude < -180 || updateData.longitude > 180) {
                throw new AppError('Longitude inválida');
            }
        }

        const textFields = ['street', 'number', 'neighborhood', 'city', 'zipCode'];
        for (const field of textFields) {
            if (updateData[field] !== undefined && updateData[field] !== null) {
                if (typeof updateData[field] === 'string' && updateData[field].trim() === '') {
                    const fieldNames: Record<string, string> = {
                        street: 'Rua',
                        number: 'Número',
                        neighborhood: 'Bairro',
                        city: 'Cidade',
                        zipCode: 'CEP',
                    };
                    throw new AppError(`${fieldNames[field]} não pode ser vazio`);
                }
            }
        }

        if (updateData.complement !== undefined && updateData.complement !== null) {
            if (typeof updateData.complement === 'string' && updateData.complement.trim() === '') {
                throw new AppError('Complemento não pode ser string vazia');
            }
        }

        const hasLatitude = updateData.latitude !== undefined && updateData.latitude !== null;
        const hasLongitude = updateData.longitude !== undefined && updateData.longitude !== null;

        if (hasLatitude || hasLongitude) {
            if (!hasLatitude || !hasLongitude) {
                throw new AppError('Latitude e longitude devem ser informadas juntas');
            }
        }

        await serviceUpdateOrCreateAddress(userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Endereço atualizado com sucesso',
        });
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.user?.userId);

    try {
        await serviceDeleteAddress(userId);
        res.status(200).json({ message: 'Endereço deletado com sucesso' });
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
};
