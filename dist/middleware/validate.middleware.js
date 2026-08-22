import { AnyZodObject, ZodError } from 'zod';
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors,
            });
        }
        next(error);
    }
};
//# sourceMappingURL=validate.middleware.js.map