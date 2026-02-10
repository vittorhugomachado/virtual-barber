import { LoginData, SignUpData } from '../types/auth-types';
import { stripNonDigits } from '../../../../utils/stripFormating';

export const signUpFieldsErrorChecker = (body: SignUpData): string | null => {
    const { barbershopName, phoneNumber, email, password } = body;

    if (!barbershopName || !phoneNumber || !email || !password) {
        return 'Todos os campos são obrigatórios';
    }

    if (barbershopName.trim().length < 3) {
        return 'Nome da barbearia deve ter no mínimo 3 caracteres';
    }
    if (barbershopName.trim().length > 100) {
        return 'Nome da barbearia muito longo (máximo 100 caracteres)';
    }

    const rawPhoneNumber = stripNonDigits(phoneNumber);
    if (rawPhoneNumber.length < 10 || rawPhoneNumber.length > 11) {
        return 'Telefone inválido. Deve conter 10 ou 11 dígitos';
    }

    if (!email.includes('@')) {
        return 'Email inválido';
    }
    if (!email.includes('.')) {
        return 'Email inválido';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email inválido';
    }

    if (password.length < 8) {
        return 'Senha deve ter no mínimo 8 caracteres';
    }
    if (password.length > 72) {
        return 'Senha muito longa (máximo 72 caracteres)';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Senha deve conter pelo menos uma letra maiúscula';
    }

    if (!/[a-z]/.test(password)) {
        return 'Senha deve conter pelo menos uma letra minúscula';
    }

    if (!/[0-9]/.test(password)) {
        return 'Senha deve conter pelo menos um número';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)';
    }

    return null;
};

export const loginFieldsErrorChecker = (body: LoginData): string | null => {
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
