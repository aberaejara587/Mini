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

// AdsGram Setup (Debug mode on for testing)
const adController = window.Adsgram.init({ 
    blockId: "23303",
    debug: true // Change to false when your bot is Active on Adsgram
});

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userId = tg.initDataUnsafe?.user?.id?.toString() || "test_user";
const balanceDisplay = document.getElementById('balanceDisplay');
const rewardBtn = document.getElementById('rewardBtn');
const userRef = doc(db, "users", userId);

// 1. Fetch Balance Live
onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
        balanceDisplay.innerText = snapshot.data().balance || 0;
        balanceDisplay.classList.remove('loading-pulse');
    } else {
        setDoc(userRef, { balance: 0, createdAt: new Date() }, { merge: true });
        balanceDisplay.innerText = "0";
        balanceDisplay.classList.remove('loading-pulse');
    }
}, (error) => {
    console.error("Firebase Error:", error);
    balanceDisplay.innerText = "Error";
});

// 2. Watch Ad Logic
rewardBtn.addEventListener('click', async () => {
    try {
        rewardBtn.disabled = true;
        rewardBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading Ad...';
        
        const result = await adController.show();
        
        if (result.done) {
            await setDoc(userRef, { balance: increment(50) }, { merge: true });
            tg.showScanQrPopup({ text: "Milkaa'eera! +50 Coins ✅" }); // Fancy notification
            setTimeout(() => tg.closeScanQrPopup(), 2000);
        } else {
            tg.showAlert("Qabxii argachuuf beeksisa xumuri.");
        }
    } catch (e) {
        tg.showAlert("Beeksisni ammaaf hin jiru. Maaloo muraasa eegi.");
    } finally {
        rewardBtn.disabled = false;
        rewardBtn.innerHTML = '<i class="fa-solid fa-play-circle"></i> Watch Ad (+50 Coins)';
    }
});
