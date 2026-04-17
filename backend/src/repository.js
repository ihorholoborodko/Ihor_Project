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

    async getPosts({ category, userId, sort = "id", order = "desc" }) {
        let sql = `SELECT * FROM Posts WHERE 1=1`;
        if (category) sql += ` AND category = '${category}'`;
        if (userId) sql += ` AND userId = ${Number(userId)}`;
        
        const validSortParams = ["id", "createdAt", "title"];
        const validOrderParams = ["asc", "desc"];
        const safeSort = validSortParams.includes(sort) ? sort : "id";
        const safeOrder = validOrderParams.includes(order.toLowerCase()) ? order : "desc";

        sql += ` ORDER BY ${safeSort} ${safeOrder} LIMIT 20;`;
        return await all(sql);
    },
    async getById(id) { return await get(`SELECT * FROM Posts WHERE id = ${Number(id)};`); },
    async add(post) {
        const res = await run(`INSERT INTO Posts (userId, title, category, body, createdAt) VALUES (${Number(post.userId)}, '${post.title}', '${post.category}', '${post.body}', '${post.createdAt}');`);
        return await this.getById(res.lastID);
    },

    async update(id, post) {
        const res = await run(`UPDATE Posts SET title = '${post.title}', category = '${post.category}', body = '${post.body}' WHERE id = ${Number(id)};`);
        if (res.changes === 0) return null;
        return await this.getById(id);
    },

    async delete(id) {
        const res = await run(`DELETE FROM Posts WHERE id = ${Number(id)};`);
        return res.changes > 0;
    }
};

const commentsRepo = {
    async getComments(postId) {
        let sql = `SELECT * FROM Comments`;
        if (postId) sql += ` WHERE postId = ${Number(postId)}`;
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