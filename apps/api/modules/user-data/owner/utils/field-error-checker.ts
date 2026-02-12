import { stripNonDigits } from "../../../../utils/stripFormating";

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    return cleanPhone.length === 10 || cleanPhone.length === 11;
};

export const isValidCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = stripNonDigits(cnpj);
    return cleanCNPJ.length === 14;
};

export const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = stripNonDigits(cpf);
    return cleanCPF.length === 11;
};

export const isValidBarbershopName = (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 100;
};

export const isValidSlug = (slug: string): boolean => {
    return slug.trim().length >= 3 && slug.trim().length <= 100;
}


export const isValidAddress = (address: string): boolean => {
    return address.trim().length >= 10 && address.trim().length <= 200;
};