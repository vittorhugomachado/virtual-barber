import { OwnerUserData } from "../../../types/user-types";

export const signUpFieldsErrorChecker = (body: OwnerUserData): string | null => {
    
    const requiredFields = ['barbershopName', 'ownerUser', 'cpf', 'phoneNumber', 'email', 'password'];

    for (const field of requiredFields) {
        if (!body[field as keyof OwnerUserData]) {
            return 'Campos obrigatórios';
        }
    }

    return null;
};

export const loginFieldsErrorChecker = (body: AccountDataBody): string | null => {

    const { email, password } = body;

    if (!email || !password) {
        return 'Campos obrigatórios';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return 'Email inválido';
    }

    if (password.length < 6) {
        return 'Senha muito curta';
    }

    return null;
};