const onRenderHandlers = [];
const validateHandlers = [];

function enqueueOnRender(handler) {
    onRenderHandlers.push(handler);
}

function enqueueValidate(handler) {
    validateHandlers.push(handler);
}

exports.Task = extend(TolokaHandlebarsTask, function (options) {
    TolokaHandlebarsTask.call(this, options);
}, {

    /**
     * Function called by Toloka N times, where N is the number of tasks in a single page.
     * You can get the task id and the DOM element (of the task for which the function is called) with this.getTask().id
     * and this.getDOMElement()
     */
    onRender: function () {
        console.log('[header_script] onRender');
        const tolokaTask = this;
        onRenderHandlers.forEach(function (handler) {
            handler(tolokaTask);
        });
    },

    validate: function (solution) {
        console.log('[header_script] validate');
        const that = this;
        validateHandlers.forEach(function (handler) {
            handler(that, solution);
        });

        // then delegate the validation logic to Toloka
        return TolokaHandlebarsTask.prototype.validate.apply(this, arguments);
    },

});
