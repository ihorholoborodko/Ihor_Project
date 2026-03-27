const db = {
    users: [],
    posts: [],
    comments: []
};

const ids = {
    users: 1,
    posts: 1,
    comments: 1
};

class Repository {
    constructor(collection) {
        this.collection = collection;
    }
    getAll() { return db[this.collection]; }
    getById(id) { return db[this.collection].find(item => item.id === id); }
    add(item) { 
        item.id = ids[this.collection]++; 
        db[this.collection].push(item); 
        return item; 
    }
    update(id, updatedItem) {
        const index = db[this.collection].findIndex(item => item.id === id);
        if (index === -1) return null;
        db[this.collection][index] = { ...db[this.collection][index], ...updatedItem };
        return db[this.collection][index];
    }
    delete(id) {
        const index = db[this.collection].findIndex(item => item.id === id);
        if (index === -1) return false;
        db[this.collection].splice(index, 1);
        return true;
    }
}

module.exports = {
    usersRepo: new Repository("users"),
    postsRepo: new Repository("posts"),
    commentsRepo: new Repository("comments")
};