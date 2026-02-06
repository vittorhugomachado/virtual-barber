import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { WeekDay } from '../../../generated/pris/enums';
import { stripNonDigits } from '../../../utils/stripFormating';
import { generateTokens } from './auth-generate-token';
import { ConflictError, UnauthorizedError, ValidationError } from '../../../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_default';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'jwt_refresh_secret_default';

interface AccountData {
    restaurantName: string;
    cnpj?: string;
    ownersName: string;
    cpf: string;
    phoneNumber: string;
    email: string;
    password: string;
};

export const signUpService = async (data: AccountData) => {

    const { restaurantName, cnpj, ownersName, cpf, phoneNumber, email, password } = data;

    const rawCpf = stripNonDigits(cpf);
    const rawCnpj = cnpj ? stripNonDigits(cnpj) : null;
    const rawPhoneNumber = stripNonDigits(phoneNumber);

    if (!email.includes('@')) throw new ValidationError('Email inválido');
    if (rawCpf.length !== 11) throw new ValidationError('CPF inválido');
    if (cnpj && rawCnpj && rawCnpj.length !== 14) throw new ValidationError('CNPJ inválido');
    if (password.length < 8) throw new ValidationError('Senha fraca');
    if (password.length > 72) throw new ValidationError('Senha muito longa');
    if (!/[A-Z]/.test(password)) throw new ValidationError('Senha sem letra maiúscula');
    if (!/[0-9]/.test(password)) throw new ValidationError('Senha sem número');

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) throw new ConflictError('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (prisma: any) => {

        const user = await prisma.user.create({
            data: {
                restaurantName,
                cnpj: rawCnpj,
                ownersName,
                cpf: rawCpf,
                phoneNumber: rawPhoneNumber,
                email,
                password: hashedPassword,
            },
        });

        const store = await prisma.store.create({
            data: {
                userId: user.id,
                restaurantName,
                phoneNumber,
                style: {
                    create: {}
                }
            },
        });

        await prisma.menuCategory.createMany({
            data: [
                { name: 'Pratos', storeId: store.id },
                { name: 'Bebidas', storeId: store.id }
            ]
        });

        const daysOfWeek: WeekDay[] = [
            'segunda',
            'terca',
            'quarta',
            'quinta',
            'sexta',
            'sabado',
            'domingo'
        ];

        await prisma.openingHour.createMany({
            data: daysOfWeek.map(day => ({
                storeId: store.id,
                day,
                isOpen: false,
                timeRanges: []
            }))
        });

        return user;
    });
};

export const loginService = async (data: AccountData) => {

    const { email, password } = data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new UnauthorizedError('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw new UnauthorizedError('Email ou senha inválidos');
    }

    const payload = {
        userId: user.id,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    return { accessToken, refreshToken };

};

export const refreshTokenService = async (refreshToken: string) => {

    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedError('Registro não encontrado através do token fornecido');
    };

    const newAccessToken = jwt.sign(
        {
            userId: user.id,
        },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    return newAccessToken;
};

export const logoutService = async (userId: number) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};