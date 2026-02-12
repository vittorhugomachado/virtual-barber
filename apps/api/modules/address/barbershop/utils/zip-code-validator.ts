export const isValidZipCode = (zipCode: string): boolean => {
    const cleaned = zipCode.replace(/\D/g, '');

    if (cleaned.length !== 8) {
        return false;
    }

    if (/^(\d)\1{7}$/.test(cleaned)) {
        return false;
    }

    return true;
};
