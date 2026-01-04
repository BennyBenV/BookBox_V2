const Joi = require('joi');

const validateRegister = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(8)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long.'
            })
    });
    return schema.validate(data);
};

const validateLogin = (data) => {
    // Login accepts either 'email' or 'username' in the "email" field for backward compatibility
    // OR we can change the frontend to send "identifier".
    // For now, let's assume the frontend sends 'email' field but it can contain a username.

    const schema = Joi.object({
        email: Joi.string().required().label("Email or Username"), // We keep the key 'email' for now to avoid breaking too much, but logically it's identifier
        password: Joi.string().required()
    });
    return schema.validate(data);
};

module.exports = {
    validateRegister,
    validateLogin
};
