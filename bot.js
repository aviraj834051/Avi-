const login = require("@xaviabot/fca-unofficial"); // ✅ Updated library
const fs = require("fs");

const appState = require("./appstate.json");
const allowedSender = "100004660908109"; // ✅ सिर्फ़ इस UID से कमांड मानेगा

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

  // ✅ ग्रुप्स में "Avii Raj active hogya" भेजना
  api.getThreadList(20, null, ["INBOX"], (err, threads) => {
    if (err || !threads) {
      console.error("❌ Thread fetch error:", err || "No threads");
      return;
    }

    threads.forEach(thread => {
      if (thread.isGroup) {
        api.sendMessage("🚩 Avii Raj active hogya", thread.threadID);
      }
    });
  });

  // ✅ मैसेज सुनो और कमांड संभालो
  api.listenMqtt((err, message) => {
    if (err || !message || !message.body) return;
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
        // कोई unknown कमांड ignore कर दो
        break;
    }
  });
});
