const login = require("fca-unofficial");
const fs = require("fs");

const appState = require("./appstate.json");
const allowedSender = "100004660908109"; // सिर्फ़ इस UID से कमांड मानेगा

login({ appState }, (err, api) => {
  if (err) {
    console.error("❌ लॉगिन फेल:", err);
    return;
  }

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    logLevel: "silent"
  });

  console.log("✅ बोट चालू हो गया!");

  // सभी ग्रुप्स में बोट ऑन मैसेज भेजे
  try {
    api.getThreadList(20, null, ["INBOX"], (err, threads) => {
      if (err || !threads) {
        console.error("❌ Thread fetch error:", err || "No threads returned");
        return;
      }

      threads.forEach(thread => {
        if (thread.isGroup) {
          api.sendMessage("🚩 Avii Raj active hogya", thread.threadID);
        }
      });
    });
  } catch (e) {
    console.error("🔥 Exception in getThreadList:", e);
  }

  // मैसेज सुनना
  api.listenMqtt((err, message) => {
    if (err || !message || !message.body) return;

    // सिर्फ allowedSender UID से रिस्पॉन्ड करेगा
    if (message.senderID !== allowedSender) return;

    const command = message.body.toLowerCase();

    switch (command) {
      case "/start":
        api.sendMessage("✅ बोट चालू है", message.threadID);
        break;
      case "/np2":
        api.sendMessage("🎵 NP2 प्ले हो रहा है", message.threadID);
        break;
      case "/mkl":
        api.sendMessage("🛠 MKL कमांड चल गई", message.threadID);
        break;
      default:
        break;
    }
  });
});
