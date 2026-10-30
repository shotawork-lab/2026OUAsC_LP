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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中:", user.email);
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

await seedSessions();