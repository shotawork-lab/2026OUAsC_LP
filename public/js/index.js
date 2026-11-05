import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc
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

// 最終更新時刻を取得して表示する
async function displayUpdatedTime() {
    const updateElement = document.getElementById("schedule-updated");

    try {
        // 更新時刻を保存しているドキュメントを指定
        const metadataRef = doc(db, "metadata", "schedule");

        // Firestoreからデータを取得
        const metadataSnap = await getDoc(metadataRef);

        if (metadataSnap.exists()) {
            const data = metadataSnap.data();

            if (data.updatedAt) {
                // 日本時間で日時を表示
                const date = data.updatedAt.toDate();

                const formattedDate = new Intl.DateTimeFormat("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Tokyo"
                }).format(date);

                updateElement.textContent = `情報を更新しました！（${formattedDate}）`;
            } else {
                updateElement.textContent = "更新時刻はまだ登録されていません。";
            }
        } else {
            updateElement.textContent = "更新時刻はまだ登録されていません。";
        }
    } catch (error) {
        console.error("更新時刻の取得に失敗しました。", error);
        updateElement.textContent = "更新時刻を取得できませんでした。";
    }
}

// 関数を実行
displayUpdatedTime();

// 次の受付を表示する
async function displayNextSession() {
    const container = document.getElementById("next-session-container");

    try {
        // Firestoreから全日程を取得
        const sessionsSnapshot = await getDocs(collection(db, "sessions"));

        const sessions = sessionsSnapshot.docs.map(document => ({
            id: document.id,
            ...document.data()
        }));

        // 現在の日時を取得
        const now = new Date();

        // 上映開始前の日程だけを候補にする
        const futureSessions = sessions.filter(session => {
            if (!session.date || !session.startTime) {
                return false;
            }

            const startDateTime = new Date(
                `${session.date}T${session.startTime}:00+09:00`
            );

            return startDateTime > now;
        });

        // 受付中の上映を抽出
        const applyingSessions = futureSessions
            .filter(session => session.status === "applying")
            .sort((a, b) => {
                const timeA = new Date(`${a.date}T${a.startTime}:00+09:00`);
                const timeB = new Date(`${b.date}T${b.startTime}:00+09:00`);
                return timeA - timeB;
            });

        let nextSession;

        if (applyingSessions.length > 0) {
            // 受付中があれば、開始時刻が最も近いもの
            nextSession = applyingSessions[0];
        } else {
            // 受付中がなければ、調整中のうち最も早いもの
            const adjustedSessions = futureSessions
                .filter(session => session.status === "adjusted")
                .sort((a, b) => {
                    const timeA = new Date(`${a.date}T${a.startTime}:00+09:00`);
                    const timeB = new Date(`${b.date}T${b.startTime}:00+09:00`);
                    return timeA - timeB;
                });

            nextSession = adjustedSessions[0];
        }

        // 該当する上映がない場合
        if (!nextSession) {
            container.innerHTML = `
                <tr class="schedule-row">
                    <td class="schedule-data" colspan="3">
                        現在、受付予定の上映はありません。
                    </td>
                </tr>
            `;
            return;
        }

        // 日付を表示用に整形
        const [year, month, day] = nextSession.date.split("-");

        const formattedDate = `${Number(month)}月${Number(day)}日`;

        // 上映情報を表示
        container.innerHTML = `
            <tr class="schedule-row">
                <th class="schedule-head">
                    ${formattedDate}<br>
                    ${nextSession.title}
                </th>
                <td class="schedule-data">
                    上映開始：${nextSession.startTime}
                </td>
                <td class="schedule-data">
                    整理券配布開始：${nextSession.receptionTime}
                </td>
            </tr>
        `;

    } catch (error) {
        console.error("次の受付情報の取得に失敗しました。", error);

        container.innerHTML = `
            <tr class="schedule-row">
                <td class="schedule-data" colspan="3">
                    上映情報を取得できませんでした。
                </td>
            </tr>
        `;
    }
}

// 次の受付情報を表示
displayNextSession();