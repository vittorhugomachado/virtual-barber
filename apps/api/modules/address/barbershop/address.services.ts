import { prisma } from '../../../lib/prisma';
import { AddressData, UpdateAddressData } from './types/address.types';
import { NotFoundError, AppError } from '../../../utils/errors';
import { stripNonDigits } from '../../../utils/stripFormating';
import { buildAddressUpdateData } from './utils/build-address-update-data';
import { buildAddressCreateData } from './utils/build-address-create-data';

const findOwnerWithBarberShopAndAddress = async (userId: number) => {
    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    }

    const ownerUser = await prisma.ownerUser.findUnique({
        where: { id: userId },
        include: {
            barberShop: {
                include: {
                    address: true,
                },
            },
        },
    });

    if (!ownerUser) {
        throw new NotFoundError('Usuário não encontrado');
    }

    if (!ownerUser.barberShop) {
        throw new NotFoundError('Barbearia não encontrada para este usuário');
    }

    return {
        ownerUser,
        barberShop: ownerUser.barberShop,
    };
};

export const serviceGetAddress = async (userId: number): Promise<AddressData | null> => {
    const { barberShop } = await findOwnerWithBarberShopAndAddress(userId);
    return barberShop.address;
};

export const serviceUpdateOrCreateAddress = async (userId: number, updateData: UpdateAddressData): Promise<void> => {
    if (updateData.zipCode) {
        updateData.zipCode = stripNonDigits(updateData.zipCode);
    }

    const { barberShop } = await findOwnerWithBarberShopAndAddress(userId);

    await prisma.$transaction(async (tx) => {
        if (barberShop.address) {
            const addressUpdateData = buildAddressUpdateData(updateData, barberShop.address);

            if (Object.keys(addressUpdateData).length === 0) {
                throw new AppError('Nenhuma alteração detectada');
            }

            await tx.address.update({
                where: { id: barberShop.address.id },
                data: addressUpdateData,
            });
        } else {
            const addressCreateData = buildAddressCreateData(updateData, barberShop.id);

            await tx.address.create({
                data: addressCreateData,
            });
        }
    });
};

export const serviceDeleteAddress = async (userId: number): Promise<void> => {
    const { barberShop } = await findOwnerWithBarberShopAndAddress(userId);

    if (!barberShop.address) {
        throw new NotFoundError('Endereço não encontrado');
    }

    await prisma.address.delete({
        where: { id: barberShop.address.id },
    });
};
