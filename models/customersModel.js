import Joi from "joi";




export const insertCustomerSchema = Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string().min(10).max(11),
    cpf: Joi.string().length(11),
    birthday: Joi.date().raw(),

})