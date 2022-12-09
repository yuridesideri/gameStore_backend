import Joi from "joi";


export const rentSchema = Joi.object().keys({
    customerId: Joi.number().min(0).required(),
    gameId: Joi.number().min(0).required(),
    daysRented: Joi.number().min(1).required()
})