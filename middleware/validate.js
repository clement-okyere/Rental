module.exports = function (schema, validator) {
    return (req, res, next) => {
        const { error } = validator(schema, req.body);
        if (error) return res.status(400).send(error.details[0].message);
        next();
    }
} 