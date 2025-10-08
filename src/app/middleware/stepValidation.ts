import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import {
  step1ValidationSchema,
  step2ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
  updateStepValidationSchema
} from '../modules/event/event.multiStepValidation';

interface StepValidationRequest extends Request {
  body: {
    step?: number;
    [key: string]: any;
  };
}

const stepValidationMiddleware = async (
  req: StepValidationRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step } = req.body;
    let schema: AnyZodObject;

    // Determine which validation schema to use based on step
    switch (step) {
      case 1:
        schema = step1ValidationSchema;
        break;
      case 2:
        schema = step2ValidationSchema;
        break;
      case 3:
        schema = step3ValidationSchema;
        break;
      case 4:
        schema = step4ValidationSchema;
        break;
      default:
        // For updates without specific step or invalid step, use update schema
        schema = updateStepValidationSchema;
        break;
    }

    // Validate the request
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    // Update request with parsed data
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
    req.cookies = parsed.cookies;

    return next();
  } catch (error) {
    next(error);
  }
};

export default stepValidationMiddleware;