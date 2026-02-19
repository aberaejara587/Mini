import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, increment, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 1. Firebase Configuration (Ati kan naaf ergite)
const firebaseConfig = {
  apiKey: "AIzaSyANHzKz68wukTU_AsVaQrxKFxwknDM8SZs",
  authDomain: "telegram-mini-app-d338f.firebaseapp.com",
  projectId: "telegram-mini-app-d338f",
  storageBucket: "telegram-mini-app-d338f.firebasestorage.app",
  messagingSenderId: "98666593238",
  appId: "1:98666593238:web:38174f742f8a74913bc277",
  measurementId: "G-EYVNLHZHLV"
};

// Firebase & Firestore dhalshisuu
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. AdsGram Setup
const ADSGRAM_BLOCK_ID = "YOUR_BLOCK_ID_HERE"; // Dashbord AdsGram irraa kan fudhatte as galchi
const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });

// 3. Telegram User Info
const tg = window.Telegram.WebApp;
tg.ready();
const userId = tg.initDataUnsafe?.user?.id?.toString() || "test_user_001";

const rewardBtn = document.getElementById('rewardBtn');
const balanceDisplay = document.getElementById('balanceDisplay');

// 4. Data Fayyadamaa Database Irraa Hordofuu (Live Update)
const userRef = doc(db, "users", userId);
onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
        balanceDisplay.innerText = `Coins: ${snapshot.data().balance || 0}`;
    } else {
        balanceDisplay.innerText = `Coins: 0`;
    }
});

// 5. Funshinii Beeksisa Agarsiisu
async function handleAdClick() {
    try {
        rewardBtn.disabled = true;
        rewardBtn.innerText = "Beeksisi banamaa jira...";

        const result = await adController.show();

        if (result.done) {
            // Beeksisa xumureera -> Database Update
            await setDoc(userRef, {
                userId: userId,
                balance: increment(50),
                totalAdsWatched: increment(1),
                lastUpdate: new Date()
            }, { merge: true });

            tg.showAlert("Baay'ee gaariidha! 50 Coins argatteetta. ✅");
        } else {
            tg.showConfirm("Badhaasa argachuuf beeksisa xumuruu qabdu.");
        }
    } catch (error) {
        console.error("Error:", error);
        tg.showAlert("Beeksisa agarsiisuun hin danda'amne. Maaloo Ad-blocker cufi.");
    } finally {
        rewardBtn.disabled = false;
        rewardBtn.innerText = "Viidiyoo Ilaali (+50 Coins)";
    }
}

rewardBtn.addEventListener('click', handleAdClick);