const Item = require("./item");
const Predicate = require("./predicate");

class Task {
    constructor(item, predicate) {
        if (!(item instanceof Item))
            throw new Error("Invalid item parameter type!");
        if (!(predicate instanceof Predicate))
            throw new Error("Invalid predicate parameter type!");

        let _item = item;
        let _predicate = predicate;

        this.setItem = function (item) {
            if (item instanceof Item) {
                _item = item;
                return true;
            }

            return false;
        };
        this.getItem = function () {
            return _item;
        }

        this.setPredicate = function (predicate) {
            if (predicate instanceof Predicate) {
                _predicate = predicate;
                return true;
            }

            return false;
        };
        this.getPredicate = function () {
            return _predicate;
        }
    }
}

module.exports = Task;