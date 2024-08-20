const Joi = require('joi');

const AddURLSchema = Joi.object({
    original: Joi.string()
        .required()
        .min(5) 
        .max(5000)
        .trim(),
    customID: Joi.string()
        .optional()
        .min(2)
        .max(30)
        .trim(),
        short: Joi.string() 
        .optional() // Should be optional because it is generated server-side
        .min(4)
        .max(30)
        .trim(),
    createdAt: Joi.date()
        .default(Date.now),
});

const UpdateURLSchema = Joi.object({
    original: Joi.string()
        .optional() 
        .min(5)
        .max(5000)
        .trim(),
    short: Joi.string() // Allow updating the short URL
        .optional()
        .min(4)
        .max(30)
        .trim(),
    updatedAt: Joi.date()
        .default(Date.now),
});

async function AddURLValidationMW (req, res, next) {
    const URLPayload = req.body;
    
    try {
        await AddURLSchema.validateAsync(URLPayload);
        next();
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        });
    }
}

async function UpdateURLValidationMW (req, res, next) {
    const URLPayload = req.body;
    
    try {
        await UpdateURLSchema.validateAsync(URLPayload);
        next();
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        });
    }
}

module.exports = { AddURLValidationMW, UpdateURLValidationMW };
