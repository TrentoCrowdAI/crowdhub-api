enqueueOnLibrariesLoaded(function ($) {
    const DecisionTimer = {
        _pageLoadTime: new Date(),
        _latestChangeTime: null,

        _times: {},

        mountTimerForTask: function (taskContainer) {
            const $taskContainer = $(taskContainer);
            const taskId = $taskContainer.attr('id');

            const times = {
                start: null,
                end: null
            };
            this._times[taskId] = times;
            const that = this;
            $taskContainer.find('input, textarea').on('change', function () {
                if (times.start === null) {
                    times.start = that._getStartTime();
                }
                times.end = new Date();
                that._onInputChanged();
                console.log("[footer_script] times of task '" + taskId + "' updated:", times);
                that._computeTimeForTask($taskContainer);
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

        _computeTimeForTask: function ($taskContainer) {
            const taskId = $taskContainer.attr('id');
            const times = this._times[taskId];
            if (!times.start || !times.end) {
                console.error("[footer_script] computeTimeForTask() couldn't compute the decision time for task '" + taskId + "'. Times:", this._times);
                return;
            }
            const decisionTime = times.end - times.start;
            $taskContainer.find('input.decisiontime').val(decisionTime);
        }
    };

    $(function () {
        $('div.cml').each(function (index, taskContainer) {
            DecisionTimer.mountTimerForTask(taskContainer);
        });
    });
});
