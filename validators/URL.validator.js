const Joi = require('joi');

const URLSchema = Joi.object({
    original: Joi.string()
        .required()
        .min(10)
        .max(5000)
        .trim(),
    
    short: Joi.string()
        .min(3)
        .max(25)
        .optional()
        .trim(),

    clicks: Joi.number()
        .min(0)
        .default(0),

    date: Joi.date()
        .default(Date.now),

    customID: Joi.string()
        .alphanum()
        .min(3)
        .max(15)
        .optional()
        .trim(),

    createdAt: Joi.date()
        .default(Date.now),

    updatedAt: Joi.date()
        .default(Date.now)
});

async function URLValidationMW (req, res, next) {
    const URLPayload = req.body
    
    try {
        await URLSchema.validateAsync(URLPayload)
        next()

    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

module.exports = URLValidationMW;
