import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export const errorMiddleware = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error('─── [INTERNAL ERROR LOG START] ───');
  console.error('Message:', error.message);
  console.error('Stack:', error.stack);
  console.error('Full Object:', error);
  console.error('─── [INTERNAL ERROR LOG END] ───');

  return response.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message // Temporário para debug
  });
};
