const fs = require("fs");
const readline = require("readline");

// Appstate sirf load ho raha hai, login ka simulation hai
let appstate = require("./appstate.json");

// np aur np2 file check karke content read karta hai
let npContent = fs.existsSync("np.txt") ? fs.readFileSync("np.txt", "utf-8") : "np.txt not found!";
let np2Content = fs.existsSync("np2.txt") ? fs.readFileSync("np2.txt", "utf-8") : "np2.txt not found!";

let prefix = "/";
let bossUID = null;
let groupNameLocked = false;
let lockedGroupName = "";

// Fake group ka structure
let group = {
    id: "1234567890",
    name: "My Group Chat",
    participants: ["100004660908109", "100001122334455"],
    nicknames: {},
};

// Terminal input ke liye readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("🤖 Bot chalu ho gaya hai! Command daalein (e.g. /setboss UID):");

rl.on("line", async (input) => {
    const args = input.trim().split(" ");
    const cmd = args[0];

    // Boss UID set karne ke liye
    if (cmd === `${prefix}setboss`) {
        bossUID = args[1];
        console.log(`👑 Boss ban gaya: ${bossUID}`);
    }

    // Sabka nickname ek sa jaisa set karo
    else if (cmd === `${prefix}setallname`) {
        const name = args.slice(1).join(" ");
        group.participants.forEach(uid => group.nicknames[uid] = name);
        console.log(`✅ Sabka naam set kar diya gaya: ${name}`);
    }

    // Group name lock karna
    else if (cmd === `${prefix}lockgrpname`) {
        groupNameLocked = true;
        lockedGroupName = group.name;
        console.log(`🔒 Group ka naam lock ho gaya: "${lockedGroupName}"`);
    }

    // Bot band karna
    else if (cmd === `${prefix}exit` || cmd === `${prefix}stop`) {
        console.log("🛑 Bot band ho gaya.");
        process.exit();
    }

    // np.txt ka content bhejna
    else if (cmd === `${prefix}start`) {
        console.log(`📩 np.txt ka content:\n---\n${npContent}\n---`);
    }

    // np2.txt ka content bhejna
    else if (cmd === `${prefix}np2`) {
        console.log(`📩 np2.txt ka content:\n---\n${np2Content}\n---`);
    }

    // Tag ke sath np.txt bhejna
    else if (cmd === `${prefix}mkl`) {
        const tag = args.slice(1).join(" ");
        console.log(`📢 ${tag}\n${npContent}`);
    }

    // Group ka naam change hone pe check
    else if (cmd === "changename") {
        const newName = args.slice(1).join(" ");
        if (groupNameLocked) {
            console.log(`⚠️ Naam change detect hua: "${newName}" → waapas: "${lockedGroupName}"`);
        } else {
            group.name = newName;
            console.log(`✅ Group ka naam change hua: "${newName}"`);
        }
    }

    // Agar koi unknown command ho
    else {
        console.log("❓ Pata nahi yeh kya command hai");
    }
});
