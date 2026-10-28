const states = [
    { value: "adjusted", label: "調整中" },
    { value: "applying", label: "受付中" },
    { value: "applied", label: "受付終了" },
    { value: "finished", label: "上映済み" },
    { value: "suspension", label: "中止" }
];

document.querySelectorAll(".state-select").forEach(function(element) {
    for (let i = 0; i < states.length; i++) {
        const option = document.createElement("option");
        option.value = states[i].value;
        option.label = states[i].label;
        element.appendChild(option);
    };
});

document.getElementById("submit-btn").addEventListener("click", function() {
    console.log("日程変更がなされました。");
    const scheduleData = []
    document.querySelectorAll(".session-row").forEach(function(element) {
        const session = {
            id: element.dataset.sessionId,
            startTime: element.querySelector(".start-time").value,
            receptionTime: element.querySelector(".reception-time").value,
            status: element.querySelector(".state-select").value
        };
        scheduleData.push(session);
    })
    console.log(scheduleData)
})