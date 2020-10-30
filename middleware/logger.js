
module.exports = () => {
    return (req, res, next) => {
        console.log(
            `[${new Date().toISOString()}]
                ${req.method}
                sent to ${req.url} 
                from ${req.ip}`)
        next();
    };
};