import { registerAs } from "@nestjs/config";
import * as Joi from 'joi';

export default registerAs('validation', () => ({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number()
      .port()
      .default(3000),
    MONGO_URI: Joi.string()
      .pattern(/^mongodb(\+srv)?:\/\/.+/)
      .message('MONGO_URI must be a valid MongoDB connection string')
      .required(),
  }),
}));
