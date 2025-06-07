const login = require("fca-unofficial");
const fs = require("fs");

const bossUID = "100005122337500";
const prefix = "/";
const np1 = fs.existsSync("np.txt") ? fs.readFileSync("np.txt", "utf-8") : "np.txt not found!";
const np2 = fs.existsSync("np2.txt") ? fs.readFileSync("np2.txt", "utf-8") : "np2.txt not found!";

login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
    if (err) {
        console.error("❌ Login Error:", err);
        return;
    }

    api.setOptions({
        listenEvents: true,
        forceLogin: true,
        updatePresence: true
    });

    console.log("🤖 Bot chalu ho gaya hai...");

    const activeMsg = "🚩 Avii Raj active hogya";

    api.getThreadList(100, null, ["INBOX"], (err, list) => {
        if (err) return console.error("❌ Thread List Error:", err);

        list.filter(thread => thread.isGroup).forEach(group => {
            api.sendMessage(activeMsg, group.threadID);
        });
    });

    api.listenMqtt((err, event) => {
        if (err) return console.error("❌ Listen Error:", err);
        if (event.type !== "message" || !event.body) return;

        const args = event.body.trim().split(" ");
        const command = args[0].toLowerCase();
        const sender = event.senderID;

        if (!command.startsWith(prefix)) return;

        if (sender !== bossUID) {
            api.sendMessage("🚫 Sirf boss hi command de sakta hai.", event.threadID);
            return;
        }

        switch (command) {
            case "/start":
                api.sendMessage(args[1] === "np2" ? np2 : np1, event.threadID);
                break;

            case "/np2":
                api.sendMessage(np2, event.threadID);
                break;

            case "/mkl":
                const msg = args.slice(1).join(" ");
                api.sendMessage(`${msg}\n\n${np1}`, event.threadID);
                break;

            case "/setallname":
                api.sendMessage("⚙️ Naam set karne ka feature abhi simulate hai.", event.threadID);
                break;

            case "/lockgrpname":
                api.sendMessage("🔒 Group naam lock simulate ho gaya.", event.threadID);
                break;

            case "/exit":
                api.sendMessage("🛑 Bot band ho raha hai...", event.threadID, () => process.exit());
                break;

            default:
                api.sendMessage("❓ Unknown command", event.threadID);
        }
    });
});
