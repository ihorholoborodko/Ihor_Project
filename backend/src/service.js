const { usersRepo, postsRepo, commentsRepo } = require("./repository");
const { ApiError, requireString } = require("./utils");

const apiService = {
    // USERS 
    getUsers() { return usersRepo.getAll(); },
    getUserById(id) {
        const user = usersRepo.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
        return user;
    },
    createUser(dto) {
        const errors = [requireString(dto.name, "name", 2), requireString(dto.email, "email", 5)].filter(Boolean);
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid user data", errors);
        return usersRepo.add({ name: dto.name, email: dto.email }); // DTO -> Model
    },

    // POSTS 
    getPosts(categoryFilter) {
        let posts = postsRepo.getAll();
        // на оцінку "добре" - фільтрація
        if (categoryFilter) {
            posts = posts.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
        }
        return posts;
    },
    getPostById(id) {
        const post = postsRepo.getById(id);
        if (!post) throw new ApiError(404, "NOT_FOUND", "Post not found");
        return post;
    },
    createPost(dto) {
        const errors = [
            requireString(dto.title, "title", 3), requireString(dto.category, "category", 2),
            requireString(dto.body, "body", 5), requireString(dto.author, "author", 2)
        ].filter(Boolean);
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid post data", errors);
        return postsRepo.add({ ...dto, createdAt: new Date().toISOString() });
    },

    // COMMENTS
    getComments(postIdFilter) {
        let comments = commentsRepo.getAll();
        // на оцінку "добре" - фільтрація коментарів за постом
        if (postIdFilter) {
            comments = comments.filter(c => c.postId === parseInt(postIdFilter));
        }
        return comments;
    },
    createComment(dto) {
        const errors = [requireString(dto.text, "text", 2), requireString(dto.author, "author", 2)].filter(Boolean);
        if (!dto.postId || isNaN(dto.postId)) errors.push({ field: "postId", message: "Valid postId is required" });
        
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid comment data", errors);
        
        // Перевіряємо чи існує такий пост
        if (!postsRepo.getById(parseInt(dto.postId))) throw new ApiError(404, "NOT_FOUND", "Related post not found");

        return commentsRepo.add({ postId: parseInt(dto.postId), text: dto.text, author: dto.author, createdAt: new Date().toISOString() });
    }
};

module.exports = apiService;