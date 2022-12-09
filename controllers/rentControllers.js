import dayjs from "dayjs";
import connection, { customersTb, gamesTb, rentalsTb } from "../database/database.js";
import { rentSchema } from "../models/rentModel.js";
import { parseDelayFee } from "../helpers/helpers.js";


export async function listRentals (req, res){
    const {customerId, gameId} = req.params;
    try{
        console.log('s')
        const rentals = await connection.query(`
        SELECT re.*, cu AS "customer", ga as "game"
        FROM ${rentalsTb} AS re, ${customersTb} as cu, ${gamesTb} as ga
        WHERE re."customerId" = cu.id AND re."gameId" = ga.id;
        `)

        //TODO 
        //APENAS GAME ID
        //APENAS CUSTOMER ID 
        res.send(rentals);
    } catch (err) {
        res.send(err);
    }
}

export async function postRentals (req, res){
    const rentalToInsert = req.body;
    try{
        const rentalToInsertValid = await rentSchema.validateAsync(rentalToInsert);
        const {gamePrice} = await connection.query(`
            SELECT "pricePerDay" AS "gamePrice"
            FROM ${gamesTb} AS g
            WHERE g.id = $1
        `, [rentalToInsertValid.gameId])[0]

        const rentalToInsertPopulated = {
            ...rentalToInsertValid,
            rentDate : dayjs().format('YYYY-MM-DD'),
            returnDate : null,
            delayFee : null,
            originalPrice : gamePrice * rentalToInsertValid?.daysRented
        }

        //TODO
        //CHECK FOR GAMEID
        //CHECK FOR GAME STOCK
        //CHECK FOR CUSTOMER ID

        await connection.query(`
            INSERT INTO ${rentalsTb}
            VALUES($1)
        `,[rentalToInsertPopulated])

        res.sendStatus(201);

    } catch (err) {
        res.status(400).send(err);
    }
}


export async function finishRental (req, res){
    const {id : rentalId} = req.params;
    try {
        const dbRent = await connection.query(`
            SELECT * 
            FROM ${rentalsTb}
            WHERE id=$1
        `,[rentalId])
        const {rentDate, daysRented, originalPrice, id} = dbRent;

        if (!dbRent) throw new Error('Rent Not Found');
        //TODO
        //CHECK IF RENT IS ALREADY COMPLETED -> 400
        //RETURN 400 IF RENT ERROR

        const returnDate = dayjs().format('YYYY-MM-DD');
        const delayFee = parseDelayFee(rentDate, originalPrice, daysRented);

        await connection.query(`
            UPDATE ${rentalsTb} 
            SET (returnDate, delayFee) = ($1,$2)
            WHERE id=$3
        `,[returnDate, delayFee, id]);

        res.sendStatus(200);

    } catch (err) {
        res.send(err);
    }
}