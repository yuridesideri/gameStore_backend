import Joi from "joi";



const numberGT0 = Joi.number().min(0).required();

export const gameSchema = Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().uri(),
    stockTotal: numberGT0,
    categoryId: Joi.number().required(),
    pricePerDay: numberGT0,
  })

