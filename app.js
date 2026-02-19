import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 1. Firebase Configuration (Kee)
const firebaseConfig = {
  apiKey: "AIzaSyANHzKz68wukTU_AsVaQrxKFxwknDM8SZs",
  authDomain: "telegram-mini-app-d338f.firebaseapp.com",
  projectId: "telegram-mini-app-d338f",
  storageBucket: "telegram-mini-app-d338f.firebasestorage.app",
  messagingSenderId: "98666593238",
  appId: "1:98666593238:web:38174f742f8a74913bc277",
  measurementId: "G-EYVNLHZHLV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. AdsGram Setup (Block ID kee isa haaraa)
const ADSGRAM_BLOCK_ID = "23303"; 
const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });

// 3. Telegram User Info
const tg = window.Telegram.WebApp;
tg.ready();
const userId = tg.initDataUnsafe?.user?.id?.toString() || "test_user_001";

const rewardBtn = document.getElementById('rewardBtn');
const balanceDisplay = document.getElementById('balanceDisplay');

// 4. Live Update: Database irraa qabxii hordofuu
const userRef = doc(db, "users", userId);
onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
        balanceDisplay.innerText = `Coins: ${snapshot.data().balance || 0}`;
    } else {
        balanceDisplay.innerText = `Coins: 0`;
    }
});

// 5. Beeksisa Agarsiisuu
async function handleAdClick() {
    try {
        rewardBtn.disabled = true;
        rewardBtn.innerText = "Beeksisi banamaa jira...";

        const result = await adController.show();

        if (result.done) {
            // Beeksisa xumureera -> Firebase Update
            await setDoc(userRef, {
                userId: userId,
                balance: increment(50),
                totalAds: increment(1),
                lastUpdate: new Date()
            }, { merge: true });

            tg.showAlert("Baga gammadde! 50 Coins argatteetta. ✅");
        } else {
            tg.showAlert("Badhaasa argachuuf beeksisa xumuruu qabdu.");
        }
    } catch (error) {
        console.error("AdsGram Error:", error);
        tg.showAlert("Ammaaf beeksisni hin jiru ykn Ad-blocker jira.");
    } finally {
        rewardBtn.disabled = false;
        rewardBtn.innerText = "Viidiyoo Ilaali (+50 Coins)";
    }
}

rewardBtn.addEventListener('click', handleAdClick);
