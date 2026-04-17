const { usersRepo, postsRepo, commentsRepo } = require("./repository");
const { ApiError, requireString } = require("./utils");

const apiService = {
    async getUsers() { return await usersRepo.getAll(); },
    async getUserById(id) {
        const user = await usersRepo.getById(id);
        if (!user) throw new ApiError(404, "NOT_FOUND", "User not found");
        return user;
    },
    async createUser(dto) {
        const errors = [requireString(dto.name, "name", 2), requireString(dto.email, "email", 5)].filter(Boolean);
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid user data", errors);
        return await usersRepo.add({ name: dto.name, email: dto.email });
    },

    async getPosts(query) {
        return await postsRepo.getPosts(query);
    },
    async getPostById(id) {
        const post = await postsRepo.getById(id);
        if (!post) throw new ApiError(404, "NOT_FOUND", "Post not found");
        return post;
    },
    async createPost(dto) {
        const errors = [requireString(dto.title, "title", 3), requireString(dto.category, "category", 2), requireString(dto.body, "body", 5)].filter(Boolean);
        if (!dto.userId || isNaN(dto.userId)) errors.push({ field: "userId", message: "Valid userId is required" });
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid post data", errors);
        
        await this.getUserById(parseInt(dto.userId)); 
        return await postsRepo.add({ ...dto, userId: parseInt(dto.userId), createdAt: new Date().toISOString() });
    },

    async updatePost(id, dto) {
        const errors = [requireString(dto.title, "title", 3), requireString(dto.category, "category", 2), requireString(dto.body, "body", 5)].filter(Boolean);
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid post data", errors);
        
        const updated = await postsRepo.update(id, dto);
        if (!updated) throw new ApiError(404, "NOT_FOUND", "Post not found");
        return updated;
    },

    async deletePost(id) {
        const deleted = await postsRepo.delete(id);
        if (!deleted) throw new ApiError(404, "NOT_FOUND", "Post not found");
        return { success: true };
    },


    async getComments(postIdFilter) { return await commentsRepo.getComments(postIdFilter); },
    async createComment(dto) {
        const errors = [requireString(dto.text, "text", 2), requireString(dto.author, "author", 2)].filter(Boolean);
        if (!dto.postId || isNaN(dto.postId)) errors.push({ field: "postId", message: "Valid postId is required" });
        if (errors.length > 0) throw new ApiError(400, "VALIDATION_ERROR", "Invalid comment data", errors);
        
        await this.getPostById(parseInt(dto.postId));
        return await commentsRepo.add({ postId: parseInt(dto.postId), text: dto.text, author: dto.author, createdAt: new Date().toISOString() });
    }
};

module.exports = apiService;