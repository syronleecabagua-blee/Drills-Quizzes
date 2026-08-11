const { mainModule } = require("process");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

function closeInput() {
    rl.close();
}

module.exports = {
    getInput,
    closeInput
};