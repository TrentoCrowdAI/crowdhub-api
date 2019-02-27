const Item = require("../model/item");
const Predicate = require("../model/predicate");
const Task = require("../model/task");

describe('Model constraints check', () => {
    test('Predicate invalid constructor type', () => {
        expect(() => { let p = new Predicate(1); }).toThrow();
        expect(() => { let p = new Predicate(true); }).toThrow();
        expect(() => { let p = new Predicate({}); }).toThrow();
        expect(() => { let p = new Predicate([]); }).toThrow();
    });

    test('Item invalid constructor type', () => {
        expect(() => { let i = new Item(1); }).toThrow();
        expect(() => { let i = new Item(true); }).toThrow();
        expect(() => { let i = new Item({}); }).toThrow();
        expect(() => { let i = new Item([]); }).toThrow();
    });

    test('Task invalid constructor type', () => {
        expect(() => { let t = new Task(1, 1); }).toThrow();
        expect(() => { let t = new Task('a', 'a'); }).toThrow();
        expect(() => { let t = new Task(true, true); }).toThrow();
        expect(() => { let t = new Task({}, {}); }).toThrow();
        expect(() => { let t = new Task([], []); }).toThrow();
    });

    test('Item, Task, Predicate valid constructor type', () => {
        let i = new Item('some text');
        let p = new Predicate('a predicate');

        expect(() => { let t = new Task(i, p); }).not.toThrow();
    });
});