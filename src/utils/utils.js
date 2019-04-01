/**
 * Sleep for parameter milliseconds
 * @param {number} millis 
 */
const sleep = (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
    sleep
};