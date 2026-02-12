// src/modules/address/utils/build-create-address-data.ts

import { Prisma } from '../../../../generated/prisma/client';
import { UpdateAddressData } from '../types/address.types';
import { AppError } from '../../../../utils/errors';

type AddressCreateInput = Prisma.AddressCreateInput;

const validateRequired = (value: string | null | undefined, fieldName: string): void => {
    if (value === undefined || value === null) {
        throw new AppError(`${fieldName} é obrigatório`);
    }
    if (typeof value === 'string' && value.trim() === '') {
        throw new AppError(`${fieldName} não pode ser vazio`);
    }
};

export const createFieldErrorChecker = (
    createData: UpdateAddressData,
    barberShopId: number
): AddressCreateInput => {
    validateRequired(createData.street, 'Rua');
    validateRequired(createData.number, 'Número');
    validateRequired(createData.neighborhood, 'Bairro');
    validateRequired(createData.city, 'Cidade');
    validateRequired(createData.state, 'Estado');
    validateRequired(createData.zipCode, 'CEP');

    if (createData.complement !== undefined && 
        createData.complement !== null && 
        createData.complement.trim() === '') {
        throw new AppError('Complemento não pode ser string vazia');
    }

    if (createData.latitude !== undefined && 
        createData.latitude !== null && 
        isNaN(createData.latitude)) {
        throw new AppError('Latitude deve ser um número válido');
    }

    if (createData.longitude !== undefined && 
        createData.longitude !== null && 
        isNaN(createData.longitude)) {
        throw new AppError('Longitude deve ser um número válido');
    }

    if ((createData.latitude !== undefined && createData.longitude === undefined) ||
        (createData.latitude === undefined && createData.longitude !== undefined)) {
        throw new AppError('Latitude e longitude devem ser informadas juntas');
    }

    return {
        street: createData.street!,
        number: createData.number!,
        complement: createData.complement ?? null,
        neighborhood: createData.neighborhood!,
        city: createData.city!,
        state: createData.state!,
        zipCode: createData.zipCode!,
        latitude: createData.latitude ?? null,
        longitude: createData.longitude ?? null,
        barberShop: {
            connect: { id: barberShopId }
        }
    };
};