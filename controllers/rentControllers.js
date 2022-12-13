import dayjs from "dayjs";
import connection, { customersTb, gamesTb, rentalsTb } from "../database/database.js";
import { rentSchema } from "../models/rentModel.js";
import { InsertQuery, parseDelayFee } from "../helpers/helpers.js";


export async function listRental (req, res){
    const {customerId, gameId} = req.params;
    try{

        const {rows: rentals} = await connection.query(`
        SELECT re.*, cu AS "customer", ga as "game"
        FROM ${rentalsTb} AS re, ${customersTb} as cu, ${gamesTb} as ga
        WHERE re."customerId" = cu.id AND re."gameId" = ga.id;
        `)

        //TODO 
        //APENAS GAME ID
        //APENAS CUSTOMER ID 
        //FIX OBJECT NOTATION FOR GAMES & CUSTOMER

        res.send(rentals);
    } catch (err) {
        res.send(err);
    }
}

export async function postRental (req, res){
    const rentalToInsert = req.body;
    try{
        const rentalToInsertValid = await rentSchema.validateAsync(rentalToInsert);
        const {rows: [{gamePrice}]} = await connection.query(`
            SELECT "pricePerDay" AS "gamePrice"
            FROM ${gamesTb} AS g
            WHERE g.id = $1
        `, [rentalToInsertValid.gameId])



        const rentalToInsertPopulated = {
            ...rentalToInsertValid,
            rentDate : dayjs().format('YYYY-MM-DD'),
            returnDate : null,
            delayFee : null,
            originalPrice : gamePrice * (rentalToInsertValid.daysRented)
        }

        //TODO
        //CHECK FOR GAMEID
        //CHECK FOR GAME STOCK
        //CHECK FOR CUSTOMER ID

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
        const {rows: [dbRent]} = await connection.query(`
            SELECT * 
            FROM ${rentalsTb}
            WHERE id=$1
        `,[rentalId])

        const {rentDate, daysRented, originalPrice, id} = dbRent;

        if (null) throw new Error('Rent Not Found'); //TODO Check for inexistent

        //TODO
        //CHECK IF RENT IS ALREADY COMPLETED -> 400
        //RETURN 400 IF RENT ERROR
        const returnDate = dayjs().format('YYYY-MM-DD');
        const delayFee = parseDelayFee(rentDate, originalPrice, daysRented);

        await connection.query(`
            UPDATE ${rentalsTb} 
            SET ("returnDate", "delayFee") = ($1,$2)
            WHERE id=$3
        `,[returnDate, delayFee, id]);


        res.sendStatus(200);

    } catch (err) {
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