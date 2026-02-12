import { Prisma } from '../../../../generated/prisma/client';
import { UpdateAddressData } from '../types/address.types';
import { AppError } from '../../../../utils/errors';

type AddressCreateInput = Prisma.AddressCreateInput;

export const buildAddressCreateData = (createData: UpdateAddressData, barberShopId: number): AddressCreateInput => {
    if (!createData.street) {
        throw new AppError('Rua é obrigatório para criar endereço');
    }
    if (!createData.number) {
        throw new AppError('Número é obrigatório para criar endereço');
    }
    if (!createData.neighborhood) {
        throw new AppError('Bairro é obrigatório para criar endereço');
    }
    if (!createData.city) {
        throw new AppError('Cidade é obrigatório para criar endereço');
    }
    if (!createData.state) {
        throw new AppError('Estado é obrigatório para criar endereço');
    }
    if (!createData.zipCode) {
        throw new AppError('CEP é obrigatório para criar endereço');
    }

    return {
        street: createData.street,
        number: createData.number,
        complement: createData.complement ?? null,
        neighborhood: createData.neighborhood,
        city: createData.city,
        state: createData.state,
        zipCode: createData.zipCode,
        latitude: createData.latitude ?? null,
        longitude: createData.longitude ?? null,
        barberShop: {
            connect: { id: barberShopId },
        },
    };
};
