const onRenderHandlers = [];
const validateHandlers = [];

function enqueueOnRender(handler) {
    onRenderHandlers.push(handler);
}

function enqueueValidate(handler) {
    validateHandlers.push(handler);
}

const CheckUserStatus = {
    check: function (poolId) {
        const body = {
            job_id: poolId,
            platform: 'toloka',
            worker_id: this._getWorkerId()
        };

        const showMsg = this._showBlockedMessage;
        $.ajax({
            type: 'POST',
            url: "https://crowdai-servant-api-dev.herokuapp.com/worker-of-workflows",
            data: JSON.stringify(body),
            success: function (data) {
                console.log(data);
                if (data.response !== 'OK')
                    showMsg(data.message);
            },
            contentType: "application/json",
            dataType: 'json'
        });
    },
    LS_KEY: 'crowd_ai_uuid',
    _getWorkerId: function () {
        var workerId = window.localStorage.getItem(this.LS_KEY);
        if (!workerId) {
            workerId = this._guid();
            var in_10_years = new Date();
            in_10_years.setMonth(in_10_years.getYear() + 10);
            in_10_years.toUTCString();
            window.localStorage.setItem(this.LS_KEY, workerId, in_10_years);
        }
        return workerId;
    },
    _showBlockedMessage: function (msg) {
        console.log($('.task-page-content-wrapper'));

        $(document.body).html(msg);
    },
    _guid: function () {
        function s4() {
            return Math.random().toString().substr(2, 4);
        }
        return s4() + s4() + s4() + s4() + s4();
    }
};


window.addEventListener('message', function (event) {
    //initial event
    if (event.data.eventType == "assignment:resume") {
        const poolId = parseInt(event.data.data.poolId);
        CheckUserStatus.check(poolId);
    }
});

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

// utility function given by F8
function extend(ParentClass, constructorFunction, prototypeHash) {
    constructorFunction = constructorFunction || function () {
    };
    prototypeHash = prototypeHash || {};
    if (ParentClass) {
        constructorFunction.prototype = Object.create(ParentClass.prototype);
    }
    for (var i in prototypeHash) {
        constructorFunction.prototype[i] = prototypeHash[i];
    }
    return constructorFunction;
}
