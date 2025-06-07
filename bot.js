const login = require("fca-unofficial");
const fs = require("fs");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("✅ Bot is running..."));
app.listen(process.env.PORT || 3000);

// 👑 Only boss can control the bot
const bossUID = "100005122337500";
const prefix = "/";

const np1 = fs.existsSync("np.txt") ? fs.readFileSync("np.txt", "utf-8") : "np.txt not found!";
const appStatePath = "appstate.json";

let intervalID = null;

login({ appState: JSON.parse(fs.readFileSync(appStatePath, "utf8")) }, (err, api) => {
    if (err) return console.error("❌ Login Error:", err);

    api.setOptions({
        listenEvents: true,
        forceLogin: true,
        updatePresence: true
    });

    console.log("🤖 Bot chalu ho gaya hai...");

    // 📢 Startup message to all groups
    api.getThreadList(20, null, ["INBOX"], (err, list) => {
        if (err) return console.error(err);
        list.forEach(thread => {
            if (thread.isGroup) {
                api.sendMessage("🚩 Avii Raj active hogya", thread.threadID);
            }
        });
    });

    // 📩 Command listener
    api.listenMqtt((err, message) => {
        if (err || !message.body || !message.senderID) return;

        const senderID = message.senderID;
        const threadID = message.threadID;
        const msg = message.body.toLowerCase().trim();

        if (senderID !== bossUID) return;

        if (msg === "/np") {
            if (intervalID) {
                api.sendMessage("⏳ Already sending NP every 45 seconds!", threadID);
                return;
            }
            api.sendMessage("✅ NP sending started every 45 seconds.", threadID);
            intervalID = setInterval(() => {
                api.sendMessage(np1, threadID);
            }, 45000);
        }

        if (msg === "/stop") {
            if (intervalID) {
                clearInterval(intervalID);
                intervalID = null;
                api.sendMessage("🛑 NP sending stopped.", threadID);
            } else {
                api.sendMessage("⚠️ NP was not running.", threadID);
            }
        }
    });
});
