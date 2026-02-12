import { Request, Response } from 'express';
import { isValidZipCode } from './utils/zip-code-validator';
import { serviceGetAddress, addressUpdateService, serviceDeleteAddress } from './address.services';
import { handleControllerError, AppError } from '../../../utils/errors';

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

        const allowedFields = [
            'street',
            'number',
            'complement',
            'neighborhood',
            'city',
            'state',
            'zipCode',
            'latitude',
            'longitude'
        ];
        
        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Campos inválidos para atualização');
        }

        if (updateData.zipCode && !isValidZipCode(updateData.zipCode)) {
            throw new AppError('CEP inválido');
        }

        if (updateData.latitude !== undefined && (typeof updateData.latitude !== 'number' || updateData.latitude < -90 || updateData.latitude > 90)) {
            throw new AppError('Latitude inválida');
        }

        if (updateData.longitude !== undefined && (typeof updateData.longitude !== 'number' || updateData.longitude < -180 || updateData.longitude > 180)) {
            throw new AppError('Longitude inválida');
        }

        await addressUpdateService(userId, updateData);

        res.status(200).json({ 
            success: true,
            message: 'Endereço atualizado com sucesso' 
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