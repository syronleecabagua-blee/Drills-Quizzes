// REAL LIFE EXAMPLE: KUNG MA ULAN
// Kung ma ulan, ma dala ko payong 
// Kung hindi, hindi ko mag dala payong bug at 
// Pay kung mag dulom, ma dala ko japon payong
// Pro kun sanag man, di ko mag dala payong


let maUlan = true;
let magDulom = true;

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Ga ulan da? ", (answer) => {
    maUlan = answer === "huo";

if (maUlan) {
    console.log("Ma dala ko payong");
}
else {
    rl.question("Ga dulom ba? ", (answer) => {
         magDulom = answer === "huo";
    if (magDulom) {
        console.log("Ma dala gid ko japon payong");
    } else {
        console.log("Di ko mag dala payong bug at");
}})}})