import connection, { customersTb } from "../database/database.js";
import { insertCustomerSchema } from "../models/clientsModel.js";







export async function listCustomers(req, res){
    const queryString = req.params;
    try{
        //TODO
        //Filtro por CPF
        const customers = await connection.query(`SELECT * FROM $1`,[customersTb]);
        res.send(customers);
    } catch (err){
        res.send(err);
    }
}


export async function insertCustomers (req, res){
    const customerToInsert = req.body;
    try{
        const customerToInsertValid = insertCustomerSchema.validateAsync(customerToInsert);
        // const {name, phone, cpf, birthday} = customerToInsertValid;
        //TODO 
        //Check if cpf already exists
        await connection.query(`INSERT INTO $1
        VALUES ('$2')`,[customersTb, customerToInsertValid])
        res.sendStatus(201);
    } catch(err){
        res.send(err);
        //TODO
        //If cpf exists -> 409
    }
}


export async function updateCustomer (req, res){
    const customerToUpdate = req.body;
    try{
        const customerToUpdateValid = insertCustomerSchema.validateAsync(customerToUpdate);
        const {name, phone, cpf, birthday} = customerToUpdateValid;
        //TODO
        //Check if CPF Exists
        await connection.query(`UPDATE $1 SET (name, phone, cpf, birthday) = ($2, $3, $4, $5) WHERE cpf=$4`,[customersTb, name, phone,cpf,birthday]);
        res.sendStatus(200);
    } catch (err){
        res.send(err);
        // TODO
        // schema ==> 400
        // cpf exists ==> 409
    }
}