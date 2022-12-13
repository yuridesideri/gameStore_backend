import connection, { categoriesTb, gamesTb } from "../database/database.js";
import { InsertQuery } from "../helpers/helpers.js";
import { gameSchema } from "../models/gamesModel.js";

export async function listGames (req, res){
     try{
        const {name: queryCategoryFilter} = req.query;
        const parsedQuery = queryCategoryFilter ? queryCategoryFilter : '';
        
        const {rows: games} = await connection.query(`
        SELECT g.*, c.name AS "categoryName"
        FROM games AS g, categories AS c
        WHERE LOWER(g.name) LIKE LOWER($1)
        `,[`${parsedQuery}%`]);

        res.send(games);
     } catch (err){
        res.send(err);
     }
}


export async function postGames (req, res){
    const gameToPost = req.body;
    try{
        const gameToPostValid = await gameSchema.validateAsync(gameToPost);
        const {categoryId, name} = gameToPostValid;
        const {rows : [{id : existCategoryId}] } = await connection.query(`SELECT id FROM ${categoriesTb} WHERE id=$1`,[categoryId]);
        const {rows: [{name : existName}]} = await connection.query(`SELECT name FROM ${gamesTb} WHERE name=$1`,[name])
        if(!existCategoryId){
            throw new Error('Category not Found');
        }
        if(existName){
            throw new Error('Game name already exists');
        }
        await InsertQuery(gamesTb, gameToPostValid);
        res.sendStatus(201);
    } catch (err){
        const errMsg = err.message;
        if (errMsg === "Game name already exists") res.status(409);
        res.status(400);
        res.send(err);
    }
}