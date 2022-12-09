export  function parseDelayFee (rentDate, originalPrice, daysRented){
    const timeStamp = dayjs().diff(dayjs(rentDate, 'YYYY-MM-DD'),'day');
    const dayDiff = timeStamp - daysRented;
    if (dayDiff > 0){
        const pricePerDay = originalPrice / daysRented;
        return pricePerDay * dayDiff;
    }
    else return 0;
}