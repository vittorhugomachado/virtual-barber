import { Prisma } from '../../../../generated/prisma/client';
import { UpdateAddressData } from '../types/address.types';
import { Address } from '../../../../generated/prisma/client';
import { AppError } from '../../../../utils/errors';

type AddressUpdateInput = Partial<Prisma.AddressUpdateInput>;

const validateNotEmpty = (value: string | null | undefined, fieldName: string): void => {
    if (typeof value === 'string' && value.trim() === '') {
        throw new AppError(`${fieldName} não pode ser vazio`);
    }
};

export const updateFieldErrorChecker = (
    updateData: UpdateAddressData,
    currentAddress: Address
): AddressUpdateInput => {
    const addressData: AddressUpdateInput = {};

    if (updateData.street !== undefined && updateData.street !== null) {
        validateNotEmpty(updateData.street, 'Rua');
        if (updateData.street !== currentAddress.street) {
            addressData.street = updateData.street;
        }
    }

    if (updateData.number !== undefined && updateData.number !== null) {
        validateNotEmpty(updateData.number, 'Número');
        if (updateData.number !== currentAddress.number) {
            addressData.number = updateData.number;
        }
    }

    if (updateData.neighborhood !== undefined && updateData.neighborhood !== null) {
        validateNotEmpty(updateData.neighborhood, 'Bairro');
        if (updateData.neighborhood !== currentAddress.neighborhood) {
            addressData.neighborhood = updateData.neighborhood;
        }
    }

    if (updateData.city !== undefined && updateData.city !== null) {
        validateNotEmpty(updateData.city, 'Cidade');
        if (updateData.city !== currentAddress.city) {
            addressData.city = updateData.city;
        }
    }

    if (updateData.state !== undefined && updateData.state !== null) {
        validateNotEmpty(updateData.state.toString(), 'Estado');
        if (updateData.state !== currentAddress.state) {
            addressData.state = updateData.state;
        }
    }

    if (updateData.zipCode !== undefined && updateData.zipCode !== null) {
        validateNotEmpty(updateData.zipCode, 'CEP');
        if (updateData.zipCode !== currentAddress.zipCode) {
            addressData.zipCode = updateData.zipCode;
        }
    }

    if (updateData.complement !== undefined) {
        if (updateData.complement !== null && updateData.complement.trim() === '') {
            throw new AppError('Complemento não pode ser string vazia');
        }
        if (updateData.complement !== currentAddress.complement) {
            addressData.complement = updateData.complement;
        }
    }

    if (updateData.latitude !== undefined) {
        if (updateData.latitude !== null && isNaN(updateData.latitude)) {
            throw new AppError('Latitude deve ser um número válido');
        }
        if (updateData.latitude !== currentAddress.latitude) {
            addressData.latitude = updateData.latitude;
        }
    }

    if (updateData.longitude !== undefined) {
        if (updateData.longitude !== null && isNaN(updateData.longitude)) {
            throw new AppError('Longitude deve ser um número válido');
        }
        if (updateData.longitude !== currentAddress.longitude) {
            addressData.longitude = updateData.longitude;
        }
    }

    return addressData;
};