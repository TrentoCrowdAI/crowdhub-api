const DecisionTimer = {
    _pageLoadTime: new Date(),
    _latestChangeTime: null,

    _times: {},

    mountTimerForTask: function (tolokaTask) {
        const container = tolokaTask.getDOMElement();
        const taskId = tolokaTask.getTask().id;

        const times = {
            start: null,
            end: null
        };
        this._times[taskId] = times;
        const that = this;
        $(container).find('input, textarea').on('change', function () {
            if (times.start === null) {
                times.start = that._getStartTime();
            }
            times.end = new Date();
            that._onInputChanged();
            console.log("[footer_script] times of task '" + taskId + "' updated:", times);
        });
    },

    _getStartTime: function () {
        if (this._latestChangeTime === null) {
            return this._pageLoadTime;
        }

        return this._latestChangeTime;
    },

    _onInputChanged: function () {
        this._latestChangeTime = new Date();
    },

    computeTimeForTask: function (tolokaTask, solution) {
        const taskId = tolokaTask.getTask().id;
        const times = this._times[taskId];
        if (!times.start || !times.end) {
            console.error("[footer_script] computeTimeForTask() couldn't compute the decision time for task '" + taskId + "'. Times:", this._times);
            return -1;
        }
        solution.output_values.decision_time = times.end - times.start;
    }
};


enqueueOnRender(function (tolokaTask) {
    setTimeout(function () {
        DecisionTimer.mountTimerForTask(tolokaTask);
    });
});

enqueueValidate(function (tolokaTask, solution) {
    DecisionTimer.computeTimeForTask(tolokaTask, solution);
});
