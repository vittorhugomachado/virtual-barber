import { Prisma } from '../../../../generated/prisma/client';
import { UpdateAddressData } from '../types/address.types';
import { Address } from '../../../../generated/prisma/client';

type AddressUpdateInput = Partial<Prisma.AddressUpdateInput>;

export const buildAddressUpdateData = (updateData: UpdateAddressData, currentAddress: Address): AddressUpdateInput => {
    const addressData: AddressUpdateInput = {};

    if (updateData.street !== undefined && updateData.street !== currentAddress.street) {
        addressData.street = updateData.street;
    }

    if (updateData.number !== undefined && updateData.number !== currentAddress.number) {
        addressData.number = updateData.number;
    }

    if (updateData.neighborhood !== undefined && updateData.neighborhood !== currentAddress.neighborhood) {
        addressData.neighborhood = updateData.neighborhood;
    }

    if (updateData.city !== undefined && updateData.city !== currentAddress.city) {
        addressData.city = updateData.city;
    }

    if (updateData.state !== undefined && updateData.state !== currentAddress.state) {
        addressData.state = updateData.state;
    }

    if (updateData.zipCode !== undefined && updateData.zipCode !== currentAddress.zipCode) {
        addressData.zipCode = updateData.zipCode;
    }

    if (updateData.complement !== undefined && updateData.complement !== currentAddress.complement) {
        addressData.complement = updateData.complement;
    }

    if (updateData.latitude !== undefined && updateData.latitude !== currentAddress.latitude) {
        addressData.latitude = updateData.latitude;
    }

    if (updateData.longitude !== undefined && updateData.longitude !== currentAddress.longitude) {
        addressData.longitude = updateData.longitude;
    }

    return addressData;
};
