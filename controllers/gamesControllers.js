import connection, { gamesTb } from "../database/database.js";

export async function listGames (req, res){
     try{
        const reqParams = req.params;
        await connection.query(`SELECT * FROM ${gamesTb}`);
     } catch (err){
        res.send('generic error');
     }
}