const apiService = require("./service");

const apiController = {
    getUsers: async (req, res, next) => {
        try { res.status(200).json({ items: await apiService.getUsers() }); } catch (e) { next(e); }
    },
    getUserById: async (req, res, next) => {
        try { res.status(200).json(await apiService.getUserById(parseInt(req.params.id))); } catch (e) { next(e); }
    },
    createUser: async (req, res, next) => {
        try { res.status(201).json(await apiService.createUser(req.body)); } catch (e) { next(e); }
    },

    getPosts: async (req, res, next) => {
        try { res.status(200).json({ items: await apiService.getPosts(req.query) }); } catch (e) { next(e); }
    },
    
    updatePost: async (req, res, next) => {
        try { res.status(200).json(await apiService.updatePost(parseInt(req.params.id), req.body)); } catch (e) { next(e); }
    }, 

    deletePost: async (req, res, next) => {
        try { 
            await apiService.deletePost(parseInt(req.params.id));
            res.status(204).send(); 
        } catch (e) { next(e); }
    },
    
    getPostById: async (req, res, next) => {
        try { res.status(200).json(await apiService.getPostById(parseInt(req.params.id))); } catch (e) { next(e); }
    },
    createPost: async (req, res, next) => {
        try { res.status(201).json(await apiService.createPost(req.body)); } catch (e) { next(e); }
    },

    getComments: async (req, res, next) => {
        try { res.status(200).json({ items: await apiService.getComments(req.query.postId) }); } catch (e) { next(e); }
    },
    createComment: async (req, res, next) => {
        try { res.status(201).json(await apiService.createComment(req.body)); } catch (e) { next(e); }
    }
};

module.exports = apiController;