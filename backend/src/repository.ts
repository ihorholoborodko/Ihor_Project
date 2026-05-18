import { all, get, run } from "./db/dbClient";

export interface User { id: number; name: string; email: string; }
export interface Post { id: number; userId: number; title: string; category: string; body: string; createdAt: string; }
export interface Comment { id: number; postId: number; text: string; author: string; createdAt: string; }

export const usersRepo = {
    async getAll() { return await all<User>("SELECT * FROM Users ORDER BY id DESC;"); },
    async getById(id: number) { return await get<User>(`SELECT * FROM Users WHERE id = ${Number(id)};`); },
    async add(user: Omit<User, "id">) {
        const res = await run(`INSERT INTO Users (name, email) VALUES ('${user.name}', '${user.email}');`);
        return await this.getById(res.lastID);
    }
};

export const postsRepo = {
    // 1. ВИМОГА: JOIN-запит (повертає пости разом з даними автора)
    async getPosts(query: any) {
        let sql = `
            SELECT p.*, u.name as authorName, u.email as authorEmail 
            FROM Posts p 
            JOIN Users u ON p.userId = u.id 
            WHERE 1=1
        `;
        if (query.category) sql += ` AND p.category = '${query.category}'`;
        if (query.userId) sql += ` AND p.userId = ${Number(query.userId)}`;
        
        const safeSort = ["id", "createdAt", "title"].includes(query.sort) ? query.sort : "p.id";
        const safeOrder = ["asc", "desc"].includes(String(query.order).toLowerCase()) ? query.order : "desc";

        sql += ` ORDER BY ${safeSort} ${safeOrder} LIMIT 20;`;
        return await all<any>(sql);
    },
    
    // 2. ВИМОГА: Агрегація (рахуємо скільки постів у кожній категорії)
    async getStats() {
        const sql = `SELECT category, COUNT(*) as postCount FROM Posts GROUP BY category;`;
        return await all<any>(sql);
    },

    // 3. ВИМОГА: Демонстрація SQL-ін'єкції (вразливий запит)
    async searchUnsafe(q: string) {
        const sql = `SELECT * FROM Posts WHERE title LIKE '%${q}%' OR body LIKE '%${q}%';`;
        return await all<Post>(sql);
    },

    async getById(id: number) { return await get<Post>(`SELECT * FROM Posts WHERE id = ${Number(id)};`); },
    async add(post: Omit<Post, "id">) {
        const res = await run(`INSERT INTO Posts (userId, title, category, body, createdAt) VALUES (${Number(post.userId)}, '${post.title}', '${post.category}', '${post.body}', '${post.createdAt}');`);
        return await this.getById(res.lastID);
    },
    async update(id: number, post: Partial<Post>) {
        const res = await run(`UPDATE Posts SET title = '${post.title}', category = '${post.category}', body = '${post.body}' WHERE id = ${Number(id)};`);
        if (res.changes === 0) return null;
        return await this.getById(id);
    },
    async delete(id: number) {
        const res = await run(`DELETE FROM Posts WHERE id = ${Number(id)};`);
        return res.changes > 0;
    }
};

export const commentsRepo = {
    async getComments(postId?: any) {
        let sql = `SELECT * FROM Comments`;
        if (postId) sql += ` WHERE postId = ${Number(postId)}`;
        sql += ` ORDER BY id DESC;`;
        return await all<Comment>(sql);
    },
    async getById(id: number) { return await get<Comment>(`SELECT * FROM Comments WHERE id = ${Number(id)};`); },
    async add(comment: Omit<Comment, "id">) {
        const res = await run(`INSERT INTO Comments (postId, text, author, createdAt) VALUES (${Number(comment.postId)}, '${comment.text}', '${comment.author}', '${comment.createdAt}');`);
        return await this.getById(res.lastID);
    }
};