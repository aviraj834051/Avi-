const fs = require("fs");
const readline = require("readline");

let appstate = require("./appstate.json");

let npContent = fs.existsSync("np.txt") ? fs.readFileSync("np.txt", "utf-8") : "np.txt not found!";
let np2Content = fs.existsSync("np2.txt") ? fs.readFileSync("np2.txt", "utf-8") : "np2.txt not found!";

let prefix = "/";
let bossUID = null;
let groupNameLocked = false;
let lockedGroupName = "";

// 🧠 Multiple fake group chats
let groups = [
    {
        id: "gc1",
        name: "Study Group",
        participants: ["uid1", "uid2"],
        nicknames: {},
    },
    {
        id: "gc2",
        name: "Friends Chat",
        participants: ["uid3", "uid4"],
        nicknames: {},
    },
    {
        id: "gc3",
        name: "Gaming Squad",
        participants: ["uid5", "uid6"],
        nicknames: {},
    },
];

// 🖨️ Sab GC ke UID show karne ke liye
function showAllGroupUIDs() {
    console.log("📌 GC list:");
    groups.forEach(group => {
        console.log(`• ${group.name} (UID: ${group.id})`);
    });
}

// 💬 Har GC pe command propagate karna
function broadcastCommand(command, args) {
    groups.forEach(group => {
        processCommandInGroup(group, command, args);
    });
}

// 🔄 Command processor per group
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
        console.log(`[${group.name}] 📩 np.txt:\n---\n${npContent}\n---`);
    }

    else if (cmd === `${prefix}np2`) {
        console.log(`[${group.name}] 📩 np2.txt:\n---\n${np2Content}\n---`);
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

// 🟢 Terminal setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("🤖 Bot chalu ho gaya hai! Command daalein (e.g. /setboss UID or /start)");

rl.on("line", async (input) => {
    const args = input.trim().split(" ");
    const cmd = args[0];

    if (cmd === `${prefix}setboss`) {
        bossUID = args[1];
        console.log(`👑 Boss set: ${bossUID}`);
    }

    else if (cmd === `${prefix}allgc`) {
        showAllGroupUIDs();
    }

    else if ([`${prefix}setallname`, `${prefix}lockgrpname`, `${prefix}start`, `${prefix}np2`, `${prefix}mkl`, "changename"].includes(cmd)) {
        broadcastCommand(cmd, args);
    }

    else if (cmd === `${prefix}exit` || cmd === `${prefix}stop`) {
        console.log("🛑 Bot band ho gaya.");
        process.exit();
    }

    else {
        console.log("❓ Unknown command");
    }
});
