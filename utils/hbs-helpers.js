module.exports = {
    if_equals(a, b, options) {
        // console.log(a, b);
        if (a.toString() === b.toString()) {
            return options.fn(this)
        }
        return options.inverse(this)
    }
};