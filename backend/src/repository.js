const { all, get, run } = require("./db/dbClient");

const usersRepo = {
    async getAll() { return await all("SELECT * FROM Users ORDER BY id DESC;"); },
    async getById(id) { return await get(`SELECT * FROM Users WHERE id = ${Number(id)};`); },
    async add(user) {
        const res = await run(`INSERT INTO Users (name, email) VALUES ('${user.name}', '${user.email}');`);
        return await this.getById(res.lastID);
    }
};

const postsRepo = {

    async getPosts(category) {
        let sql = `SELECT * FROM Posts`;
        if (category) {
            sql += ` WHERE category = '${category}'`;
        }
        sql += ` ORDER BY id DESC LIMIT 10;`;
        return await all(sql);
    },
    async getById(id) { return await get(`SELECT * FROM Posts WHERE id = ${Number(id)};`); },
    async add(post) {
        const res = await run(`INSERT INTO Posts (userId, title, category, body, createdAt) VALUES (${Number(post.userId)}, '${post.title}', '${post.category}', '${post.body}', '${post.createdAt}');`);
        return await this.getById(res.lastID);
    }
};

const commentsRepo = {
    async getComments(postId) {
        let sql = `SELECT * FROM Comments`;
        if (postId) {
            sql += ` WHERE postId = ${Number(postId)}`;
        }
        sql += ` ORDER BY id DESC;`;
        return await all(sql);
    },
    async getById(id) { return await get(`SELECT * FROM Comments WHERE id = ${Number(id)};`); },
    async add(comment) {
        const res = await run(`INSERT INTO Comments (postId, text, author, createdAt) VALUES (${Number(comment.postId)}, '${comment.text}', '${comment.author}', '${comment.createdAt}');`);
        return await this.getById(res.lastID);
    }
};

module.exports = { usersRepo, postsRepo, commentsRepo };