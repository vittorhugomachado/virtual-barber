import { prisma } from '../../../lib/prisma';
import { AddressData, UpdateAddressData } from './types/address.types';
import { NotFoundError, AppError } from '../../../utils/errors';
import { stripNonDigits } from '../../../utils/stripFormating';
import { createFieldErrorChecker } from './utils/create-field-error-checker';
import { updateFieldErrorChecker } from './utils/update-field-error-checker';

export const serviceGetAddress = async (userId: number): Promise<AddressData | null> => {
    const ownerUser = await prisma.ownerUser.findUnique({
        where: { id: userId },
        include: {
            barberShop: {
                include: {
                    address: true
                }
            }
        }
    });

    if (!ownerUser) {
        throw new NotFoundError('Usuário não encontrado');
    }

    if (!ownerUser.barberShop) {
        throw new NotFoundError('Barbearia não encontrada para este usuário');
    }

    return ownerUser.barberShop.address;
};

export const addressUpdateService = async (userId: number, updateData: UpdateAddressData): Promise<void> => {
    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    }
    
    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    }

    if (updateData.zipCode) {
        updateData.zipCode = stripNonDigits(updateData.zipCode);
    }

    const ownerUser = await prisma.ownerUser.findUnique({
        where: { id: userId },
        include: {
            barberShop: {
                include: {
                    address: true
                }
            }
        }
    });

    if (!ownerUser) {
        throw new NotFoundError('Usuário não encontrado');
    }

    if (!ownerUser.barberShop) {
        throw new NotFoundError('Barbearia não encontrada para este usuário');
    }

    const barberShop = ownerUser.barberShop;

     await prisma.$transaction(async (tx) => {
        if (barberShop.address) {
            const addressData = updateFieldErrorChecker(updateData, barberShop.address);
            
            if (Object.keys(addressData).length === 0) {
                return;
            }

            await tx.address.update({
                where: { id: barberShop.address.id },
                data: addressData
            });
        } else {
            const createData = createFieldErrorChecker(updateData, barberShop.id);
            
            await tx.address.create({
                data: createData
            });
        }
    });
};

export const serviceDeleteAddress = async (userId: number): Promise<void> => {
    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    }

    const ownerUser = await prisma.ownerUser.findUnique({
        where: { id: userId },
        include: {
            barberShop: {
                include: {
                    address: true
                }
            }
        }
    });

    if (!ownerUser) {
        throw new NotFoundError('Usuário não encontrado');
    }

    if (!ownerUser.barberShop) {
        throw new NotFoundError('Barbearia não encontrada para este usuário');
    }

    if (!ownerUser.barberShop.address) {
        throw new NotFoundError('Endereço não encontrado');
    }

    await prisma.address.delete({
        where: { id: ownerUser.barberShop.address.id }
    });
};