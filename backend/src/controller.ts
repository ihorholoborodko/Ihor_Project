import { Request, Response, NextFunction } from "express";
import { apiService } from "./service";

interface IdParam {
    id: string;
}

export const apiController = {
    // --- USERS ---
    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const users = await apiService.getUsers();
            res.status(200).json({ data: users }); 
        } catch (e) { next(e); }
    },

    getUserById: async (req: Request<IdParam>, res: Response, next: NextFunction) => {
        try { 
            const id = parseInt(req.params.id);
            const user = await apiService.getUserById(id);
            res.status(200).json({ data: user }); 
        } catch (e) { next(e); }
    },

    createUser: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const created = await apiService.createUser(req.body);
            res.status(201).json({ data: created }); 
        } catch (e) { next(e); }
    },

    // --- POSTS ---
    // Отримання постів (з JOIN автором у сервісі/репозиторії)
    getPosts: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const posts = await apiService.getPosts(req.query);
            res.status(200).json({ data: posts }); 
        } catch (e) { next(e); }
    },

    // Агрегація: статистика за категоріями
    getPostStats: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const stats = await apiService.getPostStats();
            res.status(200).json({ data: stats }); 
        } catch (e) { next(e); }
    },

    // Демонстрація SQL-ін'єкції
    searchPostsUnsafe: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const query = req.query.q as string;
            const results = await apiService.searchPostsUnsafe(query);
            res.status(200).json({ data: results }); 
        } catch (e) { next(e); }
    },

    getPostById: async (req: Request<IdParam>, res: Response, next: NextFunction) => {
        try { 
            const post = await apiService.getPostById(parseInt(req.params.id));
            res.status(200).json({ data: post }); 
        } catch (e) { next(e); }
    },

    createPost: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const created = await apiService.createPost(req.body);
            res.status(201).json({ data: created }); 
        } catch (e) { next(e); }
    },

    updatePost: async (req: Request<IdParam>, res: Response, next: NextFunction) => {
        try { 
            const updated = await apiService.updatePost(parseInt(req.params.id), req.body);
            res.status(200).json({ data: updated }); 
        } catch (e) { next(e); }
    },

    deletePost: async (req: Request<IdParam>, res: Response, next: NextFunction) => {
        try { 
            await apiService.deletePost(parseInt(req.params.id));
            res.status(204).send(); // No Content при видаленні
        } catch (e) { next(e); }
    },

    // --- COMMENTS ---
    getComments: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const comments = await apiService.getComments(req.query.postId);
            res.status(200).json({ data: comments }); 
        } catch (e) { next(e); }
    },

    createComment: async (req: Request, res: Response, next: NextFunction) => {
        try { 
            const created = await apiService.createComment(req.body);
            res.status(201).json({ data: created }); 
        } catch (e) { next(e); }
    }
};