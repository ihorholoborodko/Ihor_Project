const { run } = require("./dbClient");

async function initDb() {
   
    await run("PRAGMA foreign_keys = ON;");

    await run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Posts (
            id INTEGER PRIMARY KEY,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            body TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS Comments (
            id INTEGER PRIMARY KEY,
            postId INTEGER NOT NULL,
            text TEXT NOT NULL,
            author TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE
        );
    `);

    console.log("DB schema initialized");
}

module.exports = { initDb };