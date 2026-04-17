const { initDb } = require("./initDb");
const { run } = require("./dbClient");

async function seed() {
    await initDb();
    const now = new Date().toISOString();

    console.log("Seeding database...");

    try {

        await run(`INSERT OR IGNORE INTO Users (id, name, email) VALUES (1, 'Alice', 'alice@example.com');`);
        await run(`INSERT OR IGNORE INTO Users (id, name, email) VALUES (2, 'Bob', 'bob@example.com');`);

        await run(`INSERT INTO Posts (userId, title, category, body, createdAt) VALUES (1, 'First post', 'General', 'Hello world!', '${now}');`);
        await run(`INSERT INTO Posts (userId, title, category, body, createdAt) VALUES (2, 'Math notes', 'Education', 'I need calculus notes.', '${now}');`);
        await run(`INSERT INTO Posts (userId, title, category, body, createdAt) VALUES (1, 'Campus event', 'News', 'Party on Friday!', '${now}');`);

        await run(`INSERT INTO Comments (postId, text, author, createdAt) VALUES (2, 'I have them!', 'Alice', '${now}');`);
        await run(`INSERT INTO Comments (postId, text, author, createdAt) VALUES (1, 'Welcome!', 'Bob', '${now}');`);

        console.log("Seed completed successfully!");
    } catch (err) {
        console.error("Seed error:", err);
    }
    process.exit(0);
}

seed();