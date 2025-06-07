const login = require("fca-unofficial");
const fs = require("fs");

const bossUID = "100005122337500";
const prefix = "/";
const np1 = fs.existsSync("np.txt") ? fs.readFileSync("np.txt", "utf-8") : "np.txt not found!";
const np2 = fs.existsSync("np2.txt") ? fs.readFileSync("np2.txt", "utf-8") : "np2.txt not found!";

// Login from appstate.json
login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
    if (err) return console.error("Login Error:", err);

    api.setOptions({ listenEvents: true, forceLogin: true });

    console.log("🤖 Bot chalu ho gaya hai...");

    const activeMsg = "🚩 Avii Raj active hogya";

    api.getThreadList(20, null, ["INBOX"], (err, list) => {
        if (err) return console.error(err);
        list.filter(thread => thread.isGroup).forEach(group => {
            api.sendMessage(activeMsg, group.threadID);
        });
    });

    api.listenMqtt((err, event) => {
        if (err) return console.error(err);
        if (event.type !== "message" || !event.body) return;

        const args = event.body.trim().split(" ");
        const command = args[0];
        const sender = event.senderID;

        if (!command.startsWith(prefix)) return;

        // ✅ Boss Check
        if (sender !== bossUID) {
            api.sendMessage("🚫 Sirf boss hi command de sakta hai.", event.threadID);
            return;
        }

        // 🟢 Command Handling
        if (command === "/start") {
            const param = args[1];
            if (param === "np2") {
                api.sendMessage(np2, event.threadID);
            } else {
                api.sendMessage(np1, event.threadID);
            }
        }

        else if (command === "/np2") {
            api.sendMessage(np2, event.threadID);
        }

        else if (command === "/mkl") {
            const msg = args.slice(1).join(" ");
            api.sendMessage(`${msg}\n\n${np1}`, event.threadID);
        }

        else if (command === "/setallname") {
            api.sendMessage("⚙️ Naam set karne ka feature abhi simulate hai.", event.threadID);
        }

        else if (command === "/lockgrpname") {
            api.sendMessage("🔒 Group naam lock simulate ho gaya.", event.threadID);
        }

        else if (command === "/exit") {
            api.sendMessage("🛑 Bot band ho raha hai...", event.threadID, () => process.exit());
        }

        else {
            api.sendMessage("❓ Unknown command", event.threadID);
        }
    });
});
