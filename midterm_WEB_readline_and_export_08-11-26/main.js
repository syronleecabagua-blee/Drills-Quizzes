// REAL LIFE EXAMPLE: KUNG MA ULAN
// Kung ma ulan, ma dala ko payong 
// Kung hindi, hindi ko mag dala payong bug at 
// Pay kung mag dulom, ma dala ko japon payong
// Pro kun sanag man, di ko mag dala payong


const magUlan = require("./maUlan");
const magDulom = require("./magDulom");

const { getInput, closeInput } = require("./input");

async function main() {

    const ulanAnswer = await getInput("Ga ulan da? ");

    const ulan = ulanAnswer.toLowerCase() === "huo";

    if (ulan) {

        magUlan(true);

    } else {

        const dulomAnswer = await getInput("Ga dulom da? ");

        const dulom = dulomAnswer.toLowerCase() === "huo";

        magDulom(dulom);
    }

    closeInput();
}

main();