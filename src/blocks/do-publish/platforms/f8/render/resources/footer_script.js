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

    const CheckUserStatus = {
        check: function () {
            const body = {
                job_id: this._getJobId(),
                platform: 'f8',
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
        _getJobId: function () {
            return parseInt($('#assignment-job-id').text());
        },
        _getWorkerId: function () {
            return $('#assignment-worker-id').text();
        },
        _showBlockedMessage: function (msg) {
            $('#remix_cml_container').html(msg);
        }
    };

    $(function () {
        CheckUserStatus.check();

        $('div.cml').each(function (index, taskContainer) {
            DecisionTimer.mountTimerForTask(taskContainer);
        });
    });
});
