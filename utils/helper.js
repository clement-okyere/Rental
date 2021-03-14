
const computeRentalFee = (daysOut, dailyRentalFee) => {
    return (daysOut * dailyRentalFee);
}


module.exports = {
    computeRentalFee
}