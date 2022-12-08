import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: "4586",
    database: 'boardcamp'
  })

  export const categoriesTb = 'categories';
  export const customersTb = 'customers';
  export const gamesTb = 'games';
  export const rentalsTb = 'rentals';


// async function test (){
//     const testing = await connection.query("SELECT * FROM " + categoriesTb);
//     return testing.rows;
// }

// console.log(await test());

export default connection;