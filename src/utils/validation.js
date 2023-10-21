const Joi = require("joi");

const authSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().lowercase().required(),
	password: Joi.string().required().min(8),
});

module.exports = authSchema;
