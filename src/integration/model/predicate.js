class Predicate {
    constructor(text) {
        if (typeof text !== 'string')
            throw new Error("Invalid text parameter type!");

        let _text = text;

        this.setText = function (text) {
            if (typeof text === 'string') {
                _text = text;
                return true;
            }

            return false;
        };

        this.getText = function () {
            return _text;
        }
    }
}

module.exports = Predicate;