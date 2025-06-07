const fs = require("fs");
const readline = require("readline");

let appstate = require("./appstate.json");

let npContent = fs.existsSync("np.txt") ? fs.readFileSync("np.txt", "utf-8") : "np.txt not found!";
let np2Content = fs.existsSync("np2.txt") ? fs.readFileSync("np2.txt", "utf-8") : "np2.txt not found!";

let prefix = "/";
let bossUID = "100005122337500"; // 👑 Boss by default
let groupNameLocked = false;
let lockedGroupName = "";

let groups = [
    { id: "gc1", name: "Study Group", participants: ["uid1", "uid2"], nicknames: {} },
    { id: "gc2", name: "Friends Chat", participants: ["uid3", "uid4"], nicknames: {} },
    { id: "gc3", name: "Gaming Squad", participants: ["uid5", "uid6"], nicknames: {} },
];

function showAllGroupUIDs() {
    console.log("📌 GC list:");
    groups.forEach(group => {
        console.log(`• ${group.name} (UID: ${group.id})`);
    });
}

function sendStartupMessage() {
    groups.forEach(group => {
        console.log(`[${group.name}] 🚩 Avii Raj active hogya`);
    });
}

function broadcastCommand(command, args, senderUID) {
    if (senderUID !== bossUID) {
        console.log(`🚫 Access denied. Sirf boss UID command de sakta hai.`);
        return;
    }
    groups.forEach(group => {
        processCommandInGroup(group, command, args);
    });
}

function processCommandInGroup(group, cmd, args) {
    if (cmd === `${prefix}setallname`) {
        const name = args.slice(1).join(" ");
        group.participants.forEach(uid => group.nicknames[uid] = name);
        console.log(`[${group.name}] ✅ Sabka naam set: ${name}`);
    }

    else if (cmd === `${prefix}lockgrpname`) {
        groupNameLocked = true;
        lockedGroupName = group.name;
        console.log(`[${group.name}] 🔒 Naam lock ho gaya: "${lockedGroupName}"`);
    }

    else if (cmd === `${prefix}start`) {
        const param = args[1];
        if (param === "np2") {
            console.log(`[${group.name}] 📩 np2.txt:\n---\n${np2Content}\n---`);
        } else {
            console.log(`[${group.name}] 📩 np.txt:\n---\n${npContent}\n---`);
        }
    }

    else if (cmd === `${prefix}mkl`) {
        const tag = args.slice(1).join(" ");
        console.log(`[${group.name}] 📢 ${tag}\n${npContent}`);
    }

    else if (cmd === "changename") {
        const newName = args.slice(1).join(" ");
        if (groupNameLocked) {
            console.log(`[${group.name}] ⚠️ Naam change detect: "${newName}" → "${lockedGroupName}"`);
        } else {
            group.name = newName;
            console.log(`[${group.name}] ✅ Naam change hua: "${newName}"`);
        }
    }

    else {
        console.log(`[${group.name}] ❓ Unknown command`);
    }
}

// 🟢 Terminal input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

sendStartupMessage();
console.log("🤖 Bot chalu ho gaya hai! Command likho (e.g. UID /start np):");

rl.on("line", async (input) => {
    const parts = input.trim().split(" ");
    const senderUID = parts[0];   // ⬅️ First word = UID
    const cmd = parts[1];         // ⬅️ Second word = Command
    const args = parts.slice(1);  // ⬅️ Full args (from command onward)

    if (!cmd.startsWith(prefix)) {
        console.log("⚠️ Command prefix sahi nahi hai. Use like: 10000 /start np");
        return;
    }

    if (cmd === `${prefix}setboss`) {
        if (senderUID === bossUID) {
            const newUID = parts[2];
            bossUID = newUID;
            console.log(`👑 Boss update: ${bossUID}`);
        } else {
            console.log("🚫 Sirf current boss hi boss change kar sakta hai.");
        }
    }

    else if (cmd === `${prefix}allgc`) {
        if (senderUID === bossUID) showAllGroupUIDs();
        else console.log("🚫 Authorized boss UID hi yeh command chala sakta hai.");
    }

    else if ([`${prefix}setallname`, `${prefix}lockgrpname`, `${prefix}start`, `${prefix}np2`, `${prefix}mkl`, "changename"].includes(cmd)) {
        broadcastCommand(cmd, args, senderUID);
    }

    else if (cmd === `${prefix}exit` || cmd === `${prefix}stop`) {
        if (senderUID === bossUID) {
            console.log("🛑 Bot band ho gaya.");
            process.exit();
        } else {
            console.log("🚫 Sirf boss bot band kar sakta hai.");
        }
    }

    else {
        console.log("❓ Unknown command");
    }
});
