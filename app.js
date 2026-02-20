import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, increment, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyANHzKz68wukTU_AsVaQrxKFxwknDM8SZs",
  authDomain: "telegram-mini-app-d338f.firebaseapp.com",
  projectId: "telegram-mini-app-d338f",
  storageBucket: "telegram-mini-app-d338f.firebasestorage.app",
  messagingSenderId: "98666593238",
  appId: "1:98666593238:web:38174f742f8a74913bc277"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// AdsGram Config
const ADSGRAM_BLOCK_ID = "23303"; 
const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userId = tg.initDataUnsafe?.user?.id?.toString() || "test_user_local";
const balanceDisplay = document.getElementById('balanceDisplay');
const rewardBtn = document.getElementById('rewardBtn');

const userRef = doc(db, "users", userId);

// Live Update
onSnapshot(userRef, async (snapshot) => {
    if (snapshot.exists()) {
        balanceDisplay.innerText = `${snapshot.data().balance || 0}`;
    } else {
        await setDoc(userRef, { userId: userId, balance: 0, createdAt: new Date() });
        balanceDisplay.innerText = "0";
    }
}, (err) => {
    console.error("Firebase Error:", err);
    balanceDisplay.innerText = "Check Rules!";
});

// Play Ad Logic
rewardBtn.addEventListener('click', async () => {
    try {
        rewardBtn.disabled = true;
        rewardBtn.innerText = "Loading Ad...";
        
        const result = await adController.show();
        
        if (result.done) {
            await setDoc(userRef, { balance: increment(50) }, { merge: true });
            tg.showAlert("Milkaa'eera! +50 Coins ✅");
        } else {
            tg.showAlert("Badhaasa argachuuf beeksisa xumuri.");
        }
    } catch (e) {
        tg.showAlert("Beeksisni ammaaf hin jiru.");
    } finally {
        rewardBtn.disabled = false;
        rewardBtn.innerText = "Watch Ad (+50)";
    }
});
