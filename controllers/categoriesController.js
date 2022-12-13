import connection, { categoriesTb } from "../database/database.js";
import { InsertQuery } from "../helpers/helpers.js";
import { categoryPostSchema } from "../models/categoriesModel.js";

export async function listCategories (req,res){
    try{
        const categoriesQuery = await (await connection.query(`SELECT * FROM ${categoriesTb}`)).rows;
        res.send(categoriesQuery);
    } catch (err) {
        res.sendStatus(404);
    }
}


export async function postCategories (req, res){
    const categoryToPost = req.body;
    try{
        const categoryToPostValid = await categoryPostSchema.validateAsync(categoryToPost);
        const { name } = categoryToPostValid;

        const checkNameAlreadyExists = await connection.query(`
            SELECT name
            FROM ${categoriesTb}
            WHERE name = $1
        `,[name]);
        
        if (checkNameAlreadyExists.length !== 0) throw new Error ("Category existent");

        await InsertQuery(categoriesTb, categoryToPostValid);

        res.sendStatus(201);
    }
    catch (err){
        if (err.name === "ValidationError") res.status(400);
        if (err.message === "Category existent") res.status(409);
        res.send(err);
    }
}