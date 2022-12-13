import dayjs from "dayjs";
import connection, { categoriesTb, customersTb, gamesTb, rentalsTb } from "../database/database.js";
import { rentSchema } from "../models/rentModel.js";
import { InsertQuery, parseDelayFee } from "../helpers/helpers.js";


export async function listRental (req, res){
    const {customerId = 0, gameId = 0} = req.query;

    try{
        
        const {rows: rentals} = await connection.query(`
        SELECT 
        re.*, 
        json_build_object(
            'id', cu.id,
            'name', cu.name
        ) as "customer", 
        json_build_object(
            'id', ga.id,
            'name', ga.name,
            'categoryId', ga."categoryId",
            'categoryName', ca.name
            ) as "game"
        FROM ${rentalsTb} AS re
        JOIN ${customersTb} AS cu ON re."customerId" = cu.id
        JOIN ${gamesTb} AS ga ON re."gameId" = ga.id
        JOIN ${categoriesTb} AS ca ON ga."categoryId"=ca.id

        WHERE 
        CASE 
            WHEN $1!=0 OR $2!=0
                THEN ga.id=$1 OR cu.id=$2
            ELSE true
        END
        `,[gameId, customerId]);


        res.send(rentals);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

export async function postRental (req, res){
    const rentalToInsert = req.body;
    try{
        const rentalToInsertValid = await rentSchema.validateAsync(rentalToInsert);
        const {rows: [{gamePrice, stockTotal}]} = await connection.query(`
            SELECT "pricePerDay" as "gamePrice", "stockTotal"
            FROM ${gamesTb} AS g
            WHERE g.id = $1
        `, [rentalToInsertValid.gameId])

        if (stockTotal === 0) throw new Error("Exceeded Stock");
        
        const {rows: [{customerId}]} = await connection.query(`
            SELECT id as "customerId"
            FROM ${customersTb} AS c
            WHERE c.id = $1
        `, [rentalToInsertValid.customerId])

        if(!customerId) throw newError("No user associated with id");

        const rentalToInsertPopulated = {
            ...rentalToInsertValid,
            rentDate : dayjs().format('YYYY-MM-DD'),
            returnDate : null,
            delayFee : null,
            originalPrice : gamePrice * (rentalToInsertValid.daysRented)
        }


        await InsertQuery(rentalsTb ,rentalToInsertPopulated);

        res.sendStatus(201);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}


export async function finishRental (req, res){
    const {id : rentalId} = req.params;
    try {
        const {rows: dbRent} = await connection.query(`
            SELECT * 
            FROM ${rentalsTb}
            WHERE id=$1
        `,[rentalId])

        const {rentDate, daysRented, originalPrice, id, returnDate: isReturned} = dbRent[0];

        if (dbRent.length === 0) throw new Error('Rent Not Found');
        if (isReturned) throw new Error ('Already Returned Rent');


        const returnDate = dayjs().format('YYYY-MM-DD');
        const delayFee = parseDelayFee(rentDate, originalPrice, daysRented);

        await connection.query(`
            UPDATE ${rentalsTb} 
            SET ("returnDate", "delayFee") = ($1,$2)
            WHERE id=$3
        `,[returnDate, delayFee, id]);


        res.sendStatus(200);

    } catch (err) {
        if (err.message === "Rent Not Found") res.status(404);
        else res.status(400);
        console.log(err);
        res.send(err);
    }
}


export async function deleteRental (req, res){
    const {id : rentalId} = req.params;
    try{
        const {rows: [rental]} = await connection.query(`
            SELECT * 
            FROM ${rentalsTb}
            WHERE id = $1
        `, [rentalId]);

        if (!rental?.id) throw new Error("Rental doesn't exist");
        if (!rental?.returnDate) throw new Error("Open rental");

        await connection.query(`
            DELETE 
            FROM ${rentalsTb}
            WHERE id = $1
        `,[rentalId])

        res.sendStatus(200);
    }   catch (err) {

        const errMsg = err.message;
        if (errMsg === "Rental doesn't exist") res.status(404);
        if (errMsg === "Open rental") res.status(400);
        res.send(errMsg);
        
      }
}