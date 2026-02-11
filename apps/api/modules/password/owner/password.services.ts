import bcrypt from 'bcryptjs';
import { prisma } from '../../../lib/prisma';
import { randomUUID } from 'crypto';
import { transporter } from '../../../utils/email-sender';
import { NotFoundError, ValidationError } from '../../../utils/errors';
import { UserType } from '../../../generated/prisma/enums';

export const generateResetTokenService = async (email: string) => {

    const ownerUser = await prisma.ownerUser.findUnique({ 
        where: { email },
        include: { barberShop: true }
    });
    
    if (!ownerUser) throw new NotFoundError('Usuário não encontrado');

    await prisma.passwordResetToken.deleteMany({ 
        where: { 
            ownerId: ownerUser.id,
            userType: UserType.owner
        } 
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // 1h

    await prisma.passwordResetToken.create({
        data: {
            token,
            ownerId: ownerUser.id,
            userType: UserType.owner,
            expiresAt,
            createdAt: new Date(Date.now())
        }
    });

    return { token, ownerId: ownerUser.id, barberShop: ownerUser.barberShop };
};

export const passwordResetEmailService = async (email: string, token: string, barbershopName?: string) => {

    const resetLink = `http://localhost:5173/create-new-password/${token}`;

    await transporter.sendMail({
        from: '"BarberShop System" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Recuperação de senha',
        html: `
            <p>Olá <strong>${barbershopName || 'Usuário'}</strong>,</p>
            <p>Recebemos uma solicitação de redefinição de senha, clique no link abaixo para criar uma nova senha</p>
            <a href="${resetLink}">Redefinir senha</a>
            <br>
            <p>Se você não solicitou uma nova senha desconsidere o email.</p>
            <p>Caso precise de ajuda é só entrar em contato conosco respondendo esse email</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe BarberShop System</strong></p>
            `
    });
};

export const validateTokenService = async (token: string) => {

    const tokenData = await prisma.passwordResetToken.findFirst({ 
        where: { token } 
    });
    
    if (!tokenData || tokenData.expiresAt < new Date()) {
        throw new NotFoundError('Token inválido ou expirado');
    }
};

export const resetPasswordService = async (token: string, newPassword: string) => {
    
    const tokenRecord = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { owner: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new NotFoundError('Token inválido ou expirado');
    }

    if (newPassword.length < 8) throw new ValidationError('Senha fraca');
    if (newPassword.length > 72) throw new ValidationError('Senha muito longa');
    if (!/[A-Z]/.test(newPassword)) throw new ValidationError('Senha sem letra maiúscula');
    if (!/[0-9]/.test(newPassword)) throw new ValidationError('Senha sem número');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.ownerUser.update({
        where: { id: tokenRecord.ownerId! },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({ where: { token } });
};