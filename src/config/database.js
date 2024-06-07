import "dotenv/config";

async function getJSONDatabase() {
    const response = await fetch(`https://api.jsonbin.io/v3/b/64e3621fb89b1e2299d3f1c5`, {
        method: "GET",
        headers: { "X-Master-Key": process.env.JSON_BIN_MASTER_KEY },
    });
    const json = await response.json();

    return json.record;
}

const database = await getJSONDatabase();

export default database;
