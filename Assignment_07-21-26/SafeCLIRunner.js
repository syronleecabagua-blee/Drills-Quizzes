// runner.js - fill in the TODOs
class ConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigError';
    }
}

function loadThreshold() {
    // TODO 1: read process.env.MAX_ITEMS
    // TODO 2: if it's missing, throw a ConfigError
    // TODO 3: otherwise return it as a Number

    function loadThreshold() {
    const value = process.env.MAX_ITEMS;

    if (!value) {
        throw new ConfigError("MAX_ITEMS is missing");
    }

    return Number(value);
}
}

async function run(items) {
    const limit = loadThreshold();

    if (items.length > limit) {
        throw new Error(`Too many items: ${items.length} > ${limit}`);
    }

    return items.map(i => i.toUpperCase());
}

const verbose = process.argv.includes('--verbose');

// TODO 4: wrap run([...]) in try/catch
// TODO 5: if verbose, console.log the full error stack; otherwise just err.message
// TODO 6: add a top-level process.on('unhandledRejection', ...) as a final safety net

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});

(async () => {
    try {
        const result = await run(["napay", "smagol"]);

        console.log(result);
    } catch (err) {
        if (verbose) {
            console.error(err.stack);
        } else {
            console.error(err.message);
        }
    }
})();