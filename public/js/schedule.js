import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// Firebaseプロジェクトの設定
const firebaseConfig = {
    apiKey: "AIzaSyDcV7AFWxqbHwGh8kPyQCuWM5TMb9tAx8Q",
    authDomain: "planetarium-2026-2cd33.firebaseapp.com",
    projectId: "planetarium-2026-2cd33",
    storageBucket: "planetarium-2026-2cd33.firebasestorage.app",
    messagingSenderId: "249055874935",
    appId: "1:249055874935:web:28c1d3d2c1600314f09b72"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// Firestoreの利用準備
const db = getFirestore(app);

async function getScheduleData() {
    const snapshot = await getDocs(
        collection(db, "sessions")
    );

    const sessions = snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));

    console.log(sessions);

    return sessions;
}

getScheduleData()
    .then(sessions => {
        console.log("日程データの取得に成功しました！");
        renderSchedule(sessions);
    })
    .catch(error => {
        console.error("日程データの取得に失敗しました。", error);

        const container = document.getElementById("schedule-container");
        container.textContent = "日程情報を取得できませんでした。時間をおいて再度お試しください。";
    });

function renderSchedule(sessions) {
    const container = document.getElementById("schedule-container");

    // 表示する前に、既存の内容を空にする
    container.replaceChildren();

    // 日付ごとに上映回をまとめる
    const groupedSessions = {};

    sessions.forEach(session => {
        if (!groupedSessions[session.date]) {
            groupedSessions[session.date] = [];
        }

        groupedSessions[session.date].push(session);
    });

    // 日付ごとに表を生成する
    Object.keys(groupedSessions)
        .sort()
        .forEach(date => {
            const dailySessions = groupedSessions[date];

            // 日付の見出しを作る
            const heading = document.createElement("h3");
            heading.textContent = formatDate(date);

            // 表を作る
            const content = document.createElement("div");
            content.classList.add("schedule-content");

            const table = document.createElement("table");
            table.classList.add("schedule-table");

            // 表のヘッダーを作る
            const headerRow = document.createElement("tr");
            headerRow.classList.add("schedule-row");

            const headers = ["項目", "上映開始", "整理券配布開始", ""];

            headers.forEach((text, index) => {
                const cell = document.createElement(
                    index === 0 ? "th" : "th"
                );

                cell.textContent = text;
                cell.classList.add(
                    index === 0 ? "schedule-head" :
                    index === 3 ? "schedule-state" :
                    "schedule-data"
                );

                headerRow.appendChild(cell);
            });

            table.appendChild(headerRow);

            // 上映回を開始時刻順に並べる
            dailySessions.sort((a, b) =>
                a.startTime.localeCompare(b.startTime)
            );

            // 上映回ごとの行を作る
            dailySessions.forEach(session => {
                const row = document.createElement("tr");
                row.classList.add("schedule-row");

                const title = document.createElement("th");
                title.classList.add("schedule-head");
                title.textContent = session.title;

                const startTime = document.createElement("td");
                startTime.classList.add("schedule-data");
                startTime.textContent = session.startTime;

                const receptionTime = document.createElement("td");
                receptionTime.classList.add("schedule-data");
                receptionTime.textContent = session.receptionTime;

                const status = document.createElement("td");
                status.classList.add("schedule-state");

                const allowedStatuses = [
                    "adjusted",
                    "applying",
                    "applied",
                    "finished",
                    "suspension"
                ];

                if (allowedStatuses.includes(session.status)) {
                    status.classList.add(session.status);
                }

                row.append(title, startTime, receptionTime, status);
                table.appendChild(row);
            });

            content.appendChild(table);

            container.append(heading, content);
        });
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);

    const startDate = new Date(2026, 10, 1);
    const currentDate = new Date(year, month - 1, day);

    const dayNumber = Math.round(
        (currentDate - startDate) / (1000 * 60 * 60 * 24)
    ) + 1;

    return `${dayNumber}日目 (${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")})`;
}