import connection, { customersTb } from "../database/database.js";
import { InsertQuery } from "../helpers/helpers.js";
import { insertCustomerSchema } from "../models/customersModel.js";







export async function listCustomers(req, res){
    const queryString = req.params;
    try{
        //TODO
        //Filtro por CPF
        const {rows: customers} = await connection.query(`SELECT * FROM ${customersTb}`);
        res.send(customers);
    } catch (err){
        res.send(err);
    }
}


export async function insertCustomers (req, res){
    const customerToInsert = req.body;
    try{
        const customerToInsertValid = await insertCustomerSchema.validateAsync(customerToInsert);
        // const {name, phone, cpf, birthday} = customerToInsertValid;
        //TODO 
        //Check if cpf already exists
        console.log(customerToInsertValid);
        await InsertQuery(customersTb, customerToInsertValid);
        res.sendStatus(201);
    } catch(err){
        console.log(err);
        res.send(err);
        //TODO
        //If cpf exists -> 409
    }
}


export async function updateCustomer (req, res){
    const {id: customerIdToUpdate} = req.params;
    const customerDataToUpdate = req.body;
    try{
        const customerToUpdateValid = await insertCustomerSchema.validateAsync(customerDataToUpdate);
        const {name, phone, cpf, birthday} = customerToUpdateValid;
        console.log(customerToUpdateValid);
        //TODO
        //Check if CPF Exists
        await connection.query(`UPDATE ${customersTb} SET (name, phone, cpf, birthday) = ($1, $2, $3, $4) WHERE id=$5`,[name, phone,cpf,birthday, customerIdToUpdate]);
        res.sendStatus(200);
    } catch (err){
        res.send(err);
        // TODO
        // schema ==> 400
        // cpf exists ==> 409
    }
}