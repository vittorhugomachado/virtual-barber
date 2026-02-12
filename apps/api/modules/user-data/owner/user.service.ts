import { Prisma } from '../../../generated/prisma/browser';
import { prisma } from '../../../lib/prisma';
import { UserProfileData, UpdateUserData } from './types/user-types';
import { NotFoundError, AppError, ConflictError } from '../../../utils/errors';
import { stripNonDigits } from '../../../utils/stripFormating';

export const serviceGetUserData = async (userId: number): Promise<UserProfileData> => {
    const user = await prisma.ownerUser.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            cnpj: true,
            cpf: true,
            barberShop: {
                select: {
                    barbershopName: true,
                    phoneNumber: true,
                    address: true,
                    logoUrl: true,
                    bannerUrl: true,
                    slug: true,
                    isActive: true,
                },
            },
        },
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }

    return {
        ...user,
        barberShop: user.barberShop
            ? {
                  ...user.barberShop,
                  phoneNumber: user.barberShop.phoneNumber?.toString() || null,
              }
            : null,
    };
};

export const userDataUpdateService = async (userId: number, updateData: UpdateUserData): Promise<void> => {
    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    }

    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    }

    if (updateData.email) {
        const emailInUse = await prisma.ownerUser.findUnique({
            where: { email: updateData.email },
        });
        if (emailInUse && emailInUse.id !== userId) {
            throw new ConflictError('Email já cadastrado');
        }
    }

    if (updateData.phoneNumber) {
        const rawPhoneNumber = stripNonDigits(updateData.phoneNumber);
        const phoneNumberInUse = await prisma.barberShop.findUnique({
            where: { phoneNumber: rawPhoneNumber },
        });
        if (phoneNumberInUse && phoneNumberInUse.userId !== userId) {
            throw new ConflictError('Celular já cadastrado em outra barbearia');
        }
    }

    if (updateData.slug) {
        const slugInUse = await prisma.barberShop.findUnique({
            where: { slug: updateData.slug },
        });
        if (slugInUse && slugInUse.userId !== userId) {
            throw new ConflictError('Slug já cadastrado');
        }
    }
    const ownerData: Partial<Prisma.OwnerUserUpdateInput> = {};
    const barberShopData: Partial<Prisma.BarberShopUpdateInput> = {};

    if (updateData.email !== undefined && updateData.email !== null) {
        ownerData.email = updateData.email;
    }

    if (updateData.cnpj !== undefined && updateData.cnpj !== null) {
        ownerData.cnpj = updateData.cnpj;
    }

    if (updateData.cpf !== undefined && updateData.cpf !== null) {
        ownerData.cpf = updateData.cpf;
    }

    if (updateData.barbershopName !== undefined && updateData.barbershopName !== null) {
        barberShopData.barbershopName = updateData.barbershopName;
    }

    if (updateData.phoneNumber !== undefined && updateData.phoneNumber !== null) {
        barberShopData.phoneNumber = updateData.phoneNumber;
    }

    if (updateData.address !== undefined && updateData.address !== null) {
        barberShopData.address = updateData.address;
    }

    await prisma.$transaction(async (tx) => {
        if (Object.keys(ownerData).length > 0) {
            await tx.ownerUser.update({
                where: { id: userId },
                data: ownerData,
            });
        }

        if (Object.keys(barberShopData).length > 0) {
            const ownerUser = await tx.ownerUser.findUnique({
                where: { id: userId },
                include: { barberShop: true },
            });

            if (!ownerUser) {
                throw new NotFoundError('Usuário não encontrado');
            }

            if (!ownerUser.barberShop) {
                throw new NotFoundError('Barbearia não encontrada para este usuário');
            }

            await tx.barberShop.update({
                where: { id: ownerUser.barberShop.id },
                data: barberShopData,
            });
        }
    });
};

export const serviceDeleteUser = async (userId: number): Promise<void> => {
    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    }

    const user = await prisma.ownerUser.delete({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }
};
