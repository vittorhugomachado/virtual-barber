// import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SignUpData } from './types/auth-types';
import { prisma } from '../../../lib/prisma';
import { WeekDay } from '@prisma/client';
import { stripNonDigits } from '../../../utils/stripFormating';
// import { generateTokens } from './utils/auth-generate-token';
import { ConflictError } from '../../../utils/errors';

// const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_default';
// const REFRESH_SECRET = process.env.REFRESH_SECRET || 'jwt_refresh_secret_default';

export const signUpService = async (data: SignUpData) => {
    const { barbershopName, phoneNumber, email, password } = data;
    const rawPhoneNumber = stripNonDigits(phoneNumber);
    const slugBase = barbershopName.toLowerCase().replace(/\s+/g, '-');

    const emailInUse = await prisma.ownerUser.findUnique({ where: { email } });
    if (emailInUse) throw new ConflictError('Email já cadastrado');

    const phoneNumberInUse = await prisma.barberShop.findUnique({ where: { phoneNumber: BigInt(rawPhoneNumber) } });
    if (phoneNumberInUse) throw new ConflictError('Celular já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
        const ownerUser = await tx.ownerUser.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const barberShop = await tx.barberShop.create({
            data: {
                barbershopName: barbershopName,
                slug: slugBase + "-" + ownerUser.id + 'vb2304' + ownerUser.id,
                phoneNumber: BigInt(rawPhoneNumber),
                user: {
                    connect: { id: ownerUser.id },
                },
            },
        });

        const daysOfWeek: WeekDay[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

        await tx.openingHour.createMany({
            data: daysOfWeek.map((day) => ({
                barbershopId: barberShop.id,
                day,
                isOpen: false,
                timeRanges: [],
            })),
        });

        return { ownerUser, barberShop };
    });

    return result;
};

// export const loginService = async (data: AccountData) => {
//   const { email, password } = data;

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     throw new UnauthorizedError("Email ou senha inválidos");
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) {
//     throw new UnauthorizedError("Email ou senha inválidos");
//   }

//   const payload = {
//     userId: user.id,
//   };

//   const { accessToken, refreshToken } = generateTokens(payload);

//   await prisma.user.update({
//     where: { id: user.id },
//     data: { refreshToken },
//   });

//   return { accessToken, refreshToken };
// };

// export const refreshTokenService = async (refreshToken: string) => {
//   const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;

//   const user = await prisma.user.findUnique({
//     where: { id: payload.userId },
//   });

//   if (!user || user.refreshToken !== refreshToken) {
//     throw new UnauthorizedError(
//       "Registro não encontrado através do token fornecido",
//     );
//   }

//   const newAccessToken = jwt.sign(
//     {
//       userId: user.id,
//     },
//     JWT_SECRET,
//     { expiresIn: "1d" },
//   );

//   return newAccessToken;
// };

// export const logoutService = async (userId: number) => {
//   await prisma.user.update({
//     where: { id: userId },
//     data: { refreshToken: null },
//   });
// };
