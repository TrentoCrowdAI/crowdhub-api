class Predicate {
    constructor(text) {
        super();

        let _text = text;

        this.setText = function (text) {
            if(typeof text === 'string') {
                _text = text;
                return true;
            }

            return false;
        };

        this.getText = function() {
            return _text;
        }
    }
}

module.exports = Predicate;