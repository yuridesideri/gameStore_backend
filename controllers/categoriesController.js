import connection, { categoriesTb } from "../database/database.js";
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
        await connection.query(`INSERT INTO ${categoriesTb} (name) VALUES ('${name}') IF NOT EXISTS (SELECT name FROM ${categoriesTb} WHERE name='${name}'); `);
        res.sendStatus(201);
    }
    catch (err){
        console.log(err);
        res.send(err);
    }
}