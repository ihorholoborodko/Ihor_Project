const apiService = require("./service");

const apiController = {
    // Users
    getUsers: (req, res) => res.status(200).json({ items: apiService.getUsers() }),
    getUserById: (req, res) => res.status(200).json(apiService.getUserById(parseInt(req.params.id))),
    createUser: (req, res) => res.status(201).json(apiService.createUser(req.body)),

    // Posts
    getPosts: (req, res) => {
        // Читаємо query param ?category=...
        const category = req.query.category;
        res.status(200).json({ items: apiService.getPosts(category) });
    },
    getPostById: (req, res) => res.status(200).json(apiService.getPostById(parseInt(req.params.id))),
    createPost: (req, res) => res.status(201).json(apiService.createPost(req.body)),

    // Comments
    getComments: (req, res) => {
        // Читаємо query param ?postId=...
        const postId = req.query.postId;
        res.status(200).json({ items: apiService.getComments(postId) });
    },
    createComment: (req, res) => res.status(201).json(apiService.createComment(req.body))
};

module.exports = apiController;