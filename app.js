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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. AdsGram Setup
const ADSGRAM_BLOCK_ID = "23303"; 
const adController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });

// 3. Telegram User Information
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const userId = tg.initDataUnsafe?.user?.id?.toString() || "test_user_local";
const userName = tg.initDataUnsafe?.user?.first_name || "Guest";

const balanceDisplay = document.getElementById('balanceDisplay');
const rewardBtn = document.getElementById('rewardBtn');

// 4. Live Update: Database Listener
const userRef = doc(db, "users", userId);

onSnapshot(userRef, async (snapshot) => {
    if (snapshot.exists()) {
        balanceDisplay.innerText = `${snapshot.data().balance || 0}`;
    } else {
        // Fayyadamaa haaraa galmeessuuf
        await setDoc(userRef, {
            userId: userId,
            name: userName,
            balance: 0,
            createdAt: new Date()
        });
        balanceDisplay.innerText = "0";
    }
});

// 5. Reward Ad (Beeksisa)
async function handleAdClick() {
    try {
        rewardBtn.disabled = true;
        const result = await adController.show();

        if (result.done) {
            await setDoc(userRef, {
                balance: increment(50),
                lastAdDate: new Date()
            }, { merge: true });
            tg.showAlert("Milkaa'eera! 50 Coins dabalameera. ✅");
        }
    } catch (error) {
        tg.showAlert("Beeksisni ammaaf hin jiru.");
    } finally {
        rewardBtn.disabled = false;
    }
}

rewardBtn.addEventListener('click', handleAdClick);

// 6. Invite Friend (Medals1_bot galfameera)
const inviteBtn = document.getElementById('inviteBtn');
if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
        const inviteLink = `https://t.me/Medals1_bot?start=${userId}`;
        const shareText = "Kottaa walitti qabxii walitti qabnu! Appii kanaan beeksisa ilaaluun coins hojjedhu.";
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
        tg.openTelegramLink(fullUrl);
    });
}
