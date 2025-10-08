import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodEffects } from 'zod'

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {


    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      })
      
      req.body = parsed.body
      req.query = parsed.query
      req.params = parsed.params
      req.cookies = parsed.cookies
      return next()
    } catch (error) {
      next(error)
    }
  }

export default validateRequest
