import { Response } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 400
    ) {
        super(message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Não autenticado') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Acesso negado') {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 422);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message: string = 'Muitas requisições') {
        super(message, 429);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Erro interno no servidor') {
        super(message, 500);
    }
}

export class DatabaseConnectionError extends AppError {
    constructor(message: string = 'Erro de conexão com o banco de dados. Verifique se o banco está rodando.') {
        super(message, 503);
    }
}

const handledErrors = [AppError, UnauthorizedError, ForbiddenError, NotFoundError, ValidationError, ConflictError, TooManyRequestsError, InternalServerError, DatabaseConnectionError];

export function handleControllerError(res: Response, error: unknown): void {
    console.error('Erro no controller:', error);

    const MAX_ERROR_MSG_LENGTH = 150;
    const defaultMsg = 'Erro interno no servidor';

    let message = defaultMsg;
    let statusCode = 500;

    if (error && typeof error === 'object') {
        if ('code' in error && error.code === 'ECONNREFUSED') {
            message = 'Não foi possível conectar ao banco de dados. Verifique se o banco de dados está rodando.';
            statusCode = 503;
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    message = 'Já existe um registro com esses dados.';
                    statusCode = 409;
                    break;
                case 'P2025':
                    message = 'Registro não encontrado.';
                    statusCode = 404;
                    break;
                case 'P2003':
                    message = 'Operação viola restrições de integridade.';
                    statusCode = 400;
                    break;
                default:
                    message = error.message;
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            message = 'Dados inválidos para a operação.';
            statusCode = 400;
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
            message = 'Erro ao inicializar conexão com o banco de dados.';
            statusCode = 503;
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            message = 'Erro interno no banco de dados.';
            statusCode = 500;
        } else if (error instanceof Error) {
            message = error.message;
        }
    } else if (typeof error === 'string') {
        message = error;
    }

    for (const ErrorClass of handledErrors) {
        if (error instanceof ErrorClass) {
            if ('statusCode' in error && typeof error.statusCode === 'number') {
                statusCode = error.statusCode;
            }
            if (error instanceof Error) {
                message = error.message;
            }
            break;
        }
    }

    if (message.length > MAX_ERROR_MSG_LENGTH && statusCode !== 503) {
        message = defaultMsg;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(statusCode === 503 && {
            error: 'database_connection_error',
            timestamp: new Date().toISOString(),
        }),
    });
}
