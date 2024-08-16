const Joi = require('joi');

const URLSchema = Joi.object({
    original: Joi.string()
        .required()
        .min(10)
        .max(5000)
        .trim(),
    
    date: Joi.date()
        .default(Date.now),

    createdAt: Joi.date()
        .default(Date.now),
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
