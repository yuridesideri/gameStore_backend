import connection, { customersTb } from "../database/database.js";
import { InsertQuery } from "../helpers/helpers.js";
import { insertCustomerSchema } from "../models/customersModel.js";



export async function listCustomers(req, res){
    let {cpf = ""} = req.query;
    const {id = null} = req.params;
    if (!id) cpf = `${cpf}%`;

    try{
        const {rows: customers} = await connection.query(`
        SELECT * 
        FROM ${customersTb}
        WHERE (cpf LIKE $1) OR (id = $2)
        
        `,[cpf, id])

        if (customers.length === 0 && id) throw new Error("This id is inexistent")

        res.send(customers);
    } catch (err){
        if (err.message === "This id is inexistent") res.status(404);
        else res.status(400)
        res.send(err);
    }
}


export async function insertCustomers (req, res){
    const customerToInsert = req.body;
    try{
        const customerToInsertValid = await insertCustomerSchema.validateAsync(customerToInsert);
        const {rows: [{cpf: cpfAlreadyExists}]} = await connection.query(`
            SELECT cpf
            FROM ${customersTb} 
            WHERE cpf = $1
        `, customerToInsertValid.cpf)

        if (cpfAlreadyExists) throw new Error("This CPF is already in use");


        await InsertQuery(customersTb, customerToInsertValid);
        res.sendStatus(201);
    } catch(err){
        if (err.message === "This CPF is already in use") res.status(409)
        else res.status(400);
        res.send(err);
    }
}


export async function updateCustomer (req, res){
    const {id: customerIdToUpdate} = req.params;
    const customerDataToUpdate = req.body;
    try{
        const customerToUpdateValid = await insertCustomerSchema.validateAsync(customerDataToUpdate);
        const {name, phone, cpf, birthday} = customerToUpdateValid;

        const {rows:[{cpf:cpfAlreadyExists}]} = await connection.query(`
            SELECT * 
            FROM ${customersTb}
            WHERE cpf = $1
        `,[cpf]);
        if (cpfAlreadyExists) throw new Error("This CPF is already in use");
        await connection.query(`UPDATE ${customersTb} SET (name, phone, cpf, birthday) = ($1, $2, $3, $4) WHERE id=$5`,[name, phone,cpf,birthday, customerIdToUpdate]);
        
        res.sendStatus(200);
    } catch (err){
        res.send(err);

        if (err.message === "This CPF is already in use") res.status(409);
        else res.status(400);
        res.send(err);
    }
}