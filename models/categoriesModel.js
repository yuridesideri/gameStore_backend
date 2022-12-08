import Joi from "joi";



export const categoryPostSchema = Joi.object().keys({
    name: Joi.string().required(),
  })