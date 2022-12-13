import connection from "../database/database.js";

export function parseDelayFee (rentDate, originalPrice, daysRented){
    const timeStamp = dayjs().diff(dayjs(rentDate, 'YYYY-MM-DD'),'day');
    const dayDiff = timeStamp - daysRented;
    if (dayDiff > 0){
        const pricePerDay = originalPrice / daysRented;
        return pricePerDay * dayDiff;
    }
    else return 0;
}


export async function InsertQuery (table, object) {
    const keys = Object.keys(object);
    const values = Object.values(object)


    const query = `
        INSERT INTO ${table} (${keys})
        VALUES (${keys.map((key, keyInd) => "$" + String(keyInd + 1))})
    `
    await connection.query(query, values);
}