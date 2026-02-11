import { Response } from 'express';

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

const handledErrors = [AppError, UnauthorizedError, ForbiddenError, NotFoundError, ValidationError, ConflictError, TooManyRequestsError, InternalServerError];

export function handleControllerError(res: Response, error: unknown): void {
    console.error('Erro no controller:', error);

    const MAX_ERROR_MSG_LENGTH = 150;
    const defaultMsg = 'Erro interno no servidor';

    let message = defaultMsg;

    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
        message = String((error as { message: unknown }).message);
    }

    if (message.length > MAX_ERROR_MSG_LENGTH) {
        message = defaultMsg;
    }

    let statusCode = 500;

    for (const ErrorClass of handledErrors) {
        if (error instanceof ErrorClass) {
            if ('statusCode' in error && typeof error.statusCode === 'number') {
                statusCode = error.statusCode;
            }
            break;
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
}
