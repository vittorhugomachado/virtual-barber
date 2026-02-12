import { BrazilianState } from '../../../../generated/prisma/enums';

export interface AddressData {
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
    barberShopId: number | null;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface UpdateAddressData {
    street?: string;
    number?: string;
    complement?: string | null;
    neighborhood?: string;
    city?: string;
    state?: BrazilianState;
    zipCode?: string;
    latitude?: number | null;
    longitude?: number | null;
}
