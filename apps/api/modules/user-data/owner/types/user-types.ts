import { BrazilianState } from '../../../../generated/prisma/client';

export interface UserProfileData {
    id: number;
    email: string;
    cnpj: string | null;
    cpf: string | null;
    barberShop: {
        barbershopName: string | null;
        phoneNumber: string | null;
        address: {
            id: number;
            street: string;
            number: string;
            complement: string | null;
            neighborhood: string;
            city: string;
            state: BrazilianState;
            zipCode: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date | null;
        } | null;
        logoUrl: string | null;
        bannerUrl: string | null;
        slug: string;
        isActive: boolean;
    } | null;
}

export interface UpdateUserData {
    barbershopName?: string;
    phoneNumber?: string;
    email?: string;
    cnpj?: string;
    cpf?: string;
    slug?: string;
    address?: string;
}
