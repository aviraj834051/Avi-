const login = require("fca-unofficial");
const fs = require("fs");

const appState = require("./appstate.json");
const allowedSender = "100004660908109"; // सिर्फ़ इस UID से कमांड मानेगा

login({ appState }, (err, api) => {
  if (err) return console.error("❌ लॉगिन फेल:", err);

  api.setOptions({
    listenEvents: true,
    selfListen: false,
    logLevel: "silent"
  });

  console.log("✅ बोट चालू हो गया!");

  // सभी ग्रुप्स में बोट ऑन मैसेज भेजे
  api.getThreadList(10, null, ["INBOX"], (err, threads) => {
    if (err) return console.error("Thread fetch error:", err);
    threads.forEach(thread => {
      if (thread.isGroup) {
        api.sendMessage("🚩 Avii Raj active hogya", thread.threadID);
      }
    });
  });

  // मैसेज सुनना
  api.listenMqtt((err, message) => {
    if (err || !message.body || message.senderID !== allowedSender) return;

    const command = message.body.toLowerCase();

    if (command === "/start") {
      api.sendMessage("✅ बोट चालू है", message.threadID);
    } else if (command === "/np2") {
      api.sendMessage("🎵 NP2 प्ले हो रहा है", message.threadID);
    } else if (command === "/mkl") {
      api.sendMessage("🛠 MKL कमांड चल गई", message.threadID);
    }
  });
});
