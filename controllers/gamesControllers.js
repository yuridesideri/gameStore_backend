import connection, { categoriesTb, gamesTb } from "../database/database.js";
import { gameSchema } from "../models/gamesModel.js";

export async function listGames (req, res){
     try{
        const reqParams = req.params;
        //TODO
        //Adicionar filtro de queryString
        const games = await connection.query(`SELECT * FROM $1`, [gamesTb]);
        //TODO
        //Adicionar parte que pega o categoryId e concatena no objeto a categoryName
        res.send(games);
     } catch (err){
        res.send('generic error');
     }
}


export async function postGames (req, res){
    const gameToPost = req.body;
    try{
        const gameToPostValid = await gameSchema.validateAsync(gameToPost);
        const {categoryId, name} = gameToPostValid;
        const existCategoryId = await connection.query(`SELECT id FROM $1 WHERE id='$2'`,[categoriesTb, categoryId]);
        const existName = await connection.query(`SELECT name FROM $1 WHERE name = '$2'`,[gamesTb, name])
        if(!existCategoryId){
            throw new Error('Category not Found');
        }
        if(!existName){
            throw new Error('Game name already exists');
        }
    } catch (err){
        res.send('generic error');
        //TODO
        //Retorna err 400 (category not found)
        //Retornar err 409 (game exists)
    }
}