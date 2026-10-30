// Firebaseの機能を読み込む
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

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

console.log("Firebase initialized", app);
console.log("Firestore ready", db);

const auth = getAuth(app);

onAuthStateChanged(auth, async user => {
    if (user) {
        console.log("ログイン中:", user.email);

        try {
            await loadSessionsIntoForm();
        } catch (error) {
            console.error("日程データの読み込みに失敗しました。", error);
        }
    } else {
        console.log("ログアウト中");
    }
});

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginMessage.textContent = "ログイン成功！";
    } catch (error) {
        loginMessage.textContent = "ログイン失敗。入力内容を確認してください。";
        console.error(error);
    }
});




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

document.getElementById("submit-btn").addEventListener("click", async function() {
    console.log("日程変更の保存を開始します。");

    const user = auth.currentUser;

    if (!user) {
        alert("保存するにはログインが必要です。");
        return;
    }

    const rows = document.querySelectorAll(".session-row");

    try {
        for (const row of rows) {
            const sessionId = row.dataset.sessionId;
            const date = row.dataset.date;
            const title = row.querySelector("th").textContent.trim();

            const startTime = row.querySelector(".start-time").value;
            const receptionTime = row.querySelector(".reception-time").value;
            const status = row.querySelector(".state-select").value;

            const sessionRef = doc(db, "sessions", sessionId);
            const existing = await getDoc(sessionRef);

            // 新規登録・更新するデータを作成
            const sessionData = {
                date: date,
                title: title,
                startTime: startTime,
                receptionTime: receptionTime,
                status: status
            };

            // 既存データがある場合は、他の項目も維持する
            if (existing.exists()) {
                await setDoc(sessionRef, {
                    ...existing.data(),
                    ...sessionData
                });
            } else {
                // 未登録の上映回は新規登録する
                await setDoc(sessionRef, sessionData);
            }

            console.log("保存成功:", sessionId);
        }

        alert("全日程の保存が完了しました。");

    } catch (error) {
        console.error("日程情報の保存に失敗しました。", error);
        alert("保存に失敗しました。管理者権限や通信状態を確認してください。");
    }
});


const snapshot = await getDocs(collection(db, "sessions"));

console.log("Sessions:", snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
})));


// データセットの作成
const sessions = [
  { id: "day1-session1", date: "2026-11-01", title: "第１回", startTime: "10:00", receptionTime: "09:45", status: "applying" },
  { id: "day1-session2", date: "2026-11-01", title: "第２回", startTime: "11:30", receptionTime: "11:15", status: "applying" },
  { id: "day1-session3", date: "2026-11-01", title: "第３回", startTime: "13:00", receptionTime: "12:45", status: "applying" },
  { id: "day1-session4", date: "2026-11-01", title: "第４回", startTime: "14:30", receptionTime: "14:15", status: "applying" },
  { id: "day1-session5", date: "2026-11-01", title: "第５回", startTime: "14:30", receptionTime: "14:15", status: "applying" },
  
  { id: "day2-session1", date: "2026-11-02", title: "第１回", startTime: "10:00", receptionTime: "09:45", status: "applying" },
  { id: "day2-session2", date: "2026-11-02", title: "第２回", startTime: "11:30", receptionTime: "11:15", status: "applying" },
  { id: "day2-session3", date: "2026-11-02", title: "第３回", startTime: "13:00", receptionTime: "12:45", status: "applying" },
  { id: "day2-session4", date: "2026-11-02", title: "第４回", startTime: "14:30", receptionTime: "14:15", status: "applying" },
  { id: "day2-session5", date: "2026-11-02", title: "第５回", startTime: "11:30", receptionTime: "11:15", status: "applying" },
  { id: "day2-session6", date: "2026-11-02", title: "第６回", startTime: "13:00", receptionTime: "12:45", status: "applying" },
  { id: "day2-session7", date: "2026-11-02", title: "第７回", startTime: "14:30", receptionTime: "14:15", status: "applying" },
  
  { id: "day3-session1", date: "2026-11-03", title: "第１回", startTime: "10:00", receptionTime: "09:45", status: "applying" },
  { id: "day3-session2", date: "2026-11-03", title: "第２回", startTime: "11:30", receptionTime: "11:15", status: "applying" },
  { id: "day3-session3", date: "2026-11-03", title: "第３回", startTime: "13:00", receptionTime: "12:45", status: "applying" },
  { id: "day3-session4", date: "2026-11-03", title: "第４回", startTime: "14:30", receptionTime: "14:15", status: "applying" },
  { id: "day3-session5", date: "2026-11-03", title: "第５回", startTime: "11:30", receptionTime: "11:15", status: "applying" },
  { id: "day3-session6", date: "2026-11-03", title: "第６回", startTime: "13:00", receptionTime: "12:45", status: "applying" },
  { id: "day3-session7", date: "2026-11-03", title: "第７回", startTime: "14:30", receptionTime: "14:15", status: "applying" }
];

async function seedSessions() {
  for (const session of sessions) {
    const sessionRef = doc(db, "sessions", session.id);
    const existing = await getDoc(sessionRef);

    if (existing.exists()) {
      console.log("登録済みのためスキップ:", session.id);
      continue;
    }

    const { id, ...data } = session;
    await setDoc(sessionRef, data);

    console.log("登録成功:", id);
  }
}

// await seedSessions();



async function loadSessionsIntoForm() {
    console.log("① 日程データの読み込みを開始");

    // Firestoreから上映データを取得
    const snapshot = await getDocs(collection(db, "sessions"));

    console.log("② Firestoreから取得した件数:", snapshot.size);

    // ドキュメントIDをキーにして、データを検索しやすくする
    const sessionsMap = new Map(
        snapshot.docs.map(document => [
            document.id,
            document.data()
        ])
    );

    // 管理画面にある各上映回の行を取得
    const rows = document.querySelectorAll(".session-row");
    console.log("③ 管理画面で見つかった行数:", rows.length);

    rows.forEach(row => {
        // この行に対応するFirestoreのドキュメントID
        const sessionId = row.dataset.sessionId;

        // 対応する上映データを取得
        const session = sessionsMap.get(sessionId);

        // Firestoreにデータがなければ、この行は変更しない
        if (!session) return;

        // 上映開始時刻を入力欄に設定
        const startInput = row.querySelector(".start-time");

        if (startInput && session.startTime) {
            startInput.value = session.startTime;
        }

        // 受付開始時刻を入力欄に設定
        const receptionInput = row.querySelector(".reception-time");

        if (receptionInput && session.receptionTime) {
            receptionInput.value = session.receptionTime;
        }

        // ステータスを選択欄に設定
        const stateSelect = row.querySelector(".state-select");

        if (stateSelect && session.status) {
            stateSelect.value = session.status;
        }
    });

    console.log("管理画面への日程データ反映が完了しました。");
}