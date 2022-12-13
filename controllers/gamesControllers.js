import connection, { categoriesTb, gamesTb } from "../database/database.js";
import { InsertQuery } from "../helpers/helpers.js";
import { gameSchema } from "../models/gamesModel.js";

export async function listGames (req, res){
     try{
        const reqParams = req.params;
        //TODO
        //Adicionar filtro de queryString
        const {rows: games} = await connection.query("SELECT * FROM games;");
        //TODO
        //Adicionar parte que pega o categoryId e concatena no objeto a categoryName
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
        res.send(err);
        console.log(err);
        //TODO
        //Retorna err 400 (category not found)
        //Retornar err 409 (game exists)
    }
}