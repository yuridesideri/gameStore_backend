import connection, { customersTb } from "../database/database";
import { insertCustomerSchema } from "../models/clientsModel";







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


export async function insertClient (req, res){
    const clientToInsert = req.body;
    try{
        const clientToInsertValid = insertCustomerSchema.validateAsync(clientToInsert);
        const {name, phone, cpf, birthday} = clientToInsertValid;
        //TODO 
        //Check if cpf already exists
        await connection.query(`INSERT INTO $1 (name, phone, cpf, birthday) = ($2, $3, $4, $5)`,[customersTb, name, phone,cpf,birthday])
        res.sendStatus(201);
    } catch(err){
        res.send(err);
        //TODO
        //If cpf exists -> 409
    }
}


export async function updateClient (req, res){
    const clientToUpdate = req.body;
    try{
        const clientToUpdateValid = insertCustomerSchema.validateAsync(clientToUpdate);
        const {name, phone, cpf, birthday} = clientToUpdateValid;
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