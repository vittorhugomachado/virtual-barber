import { Request, Response } from 'express';
import { signUpFieldsErrorChecker } from './utils/field-error-checker';
import { handleControllerError } from '../../../utils/errors';
import { signUpService } from './auth.services';

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const validationError = signUpFieldsErrorChecker(req.body);
        if (validationError) {
            res.status(422).json({ error: validationError });
            return;
        }

        const result = await signUpService(req.body);

        res.status(201).json({
            message: 'Barbearia criada com sucesso',
            data: {
                slug: result.barberShop.slug,
                barbershopName: result.barberShop.barbershopName,
            },
        });
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
};

// export const login = async (req: Request, res: Response): Promise<void> => {

//     try {

//         const validationError = loginFieldsErrorChecker(req.body);
//         if (validationError) {
//             res.status(400).json({ message: validationError });
//             return
//         }

//         const { accessToken, refreshToken } = await loginService(req.body);

//         res.cookie('token', accessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'none',
//             path: '/',
//             maxAge: 24 * 60 * 60 * 1000, //1 DIA
//         });

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'none',
//             path: '/',
//             maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
//         });

//         res.status(200).json({ message: 'Login realizado com sucesso' });
//         return

//     } catch (error: any) {

//         handleControllerError(res, error);

//     }
// };

// export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {

//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//         res.status(401).json({ message: 'Refresh token não fornecido' });
//         return
//     }

//     try {
//         const newAccessToken = await refreshTokenService(refreshToken);

//         res.cookie('token', newAccessToken, {
//             httpOnly: true,
//             secure: false,
//             sameSite: 'lax',
//             maxAge: 15 * 60 * 1000,
//         });

//         res.status(200).json({ message: 'Token renovado com sucesso' });
//         return

//     } catch (error: any) {

//         handleControllerError(res, error);

//     }
// };

// export const logout = async (req: Request & { user?: any }, res: Response): Promise<void> => {

//     try {

//         const userId = req.user?.userId;
//         if (!userId) {
//             res.status(401).json({ message: 'Usuário não autenticado' });
//             return
//         }

//         await logoutService(userId);

//         res.clearCookie('token');
//         res.clearCookie('refreshToken');
//         res.status(200).json({ message: 'Logout efetuado com sucesso' });
//         return

//     } catch (error) {

//         handleControllerError(res, error);

//     }
// };
