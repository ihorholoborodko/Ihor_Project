let posts = [];
let nextId = 1;

const form = document.getElementById("createForm");
const resetBtn = document.getElementById("resetBtn");
const tbody = document.getElementById("itemsTableBody");

form.addEventListener("submit", (event) => {
event.preventDefault();

const dto = readForm();
const isValid = validate(dto);

if (!isValid) return;

addPost(dto);
renderTable(posts);

form.reset();
clearErrors();
});

resetBtn.addEventListener("click", () => {
form.reset();
clearErrors();
});

tbody.addEventListener("click", (event) => {
const target = event.target;

if (target.classList.contains("delete-btn")) {
const id = Number(target.dataset.id);
deletePost(id);
renderTable(posts);
}
});

function readForm() {
return {
title: document.getElementById("titleInput").value.trim(),
category: document.getElementById("categorySelect").value,
body: document.getElementById("bodyInput").value.trim(),
author: document.getElementById("authorInput").value.trim()
};
}

function validate(dto) {
clearErrors();
let isValid = true;

if (dto.title === "") {
showError("titleInput", "titleError", "Поле Title є обов'язковим.");
isValid = false;
}

if (dto.category === "") {
showError("categorySelect", "categoryError", "Оберіть категорію зі списку.");
isValid = false;
}

if (dto.body === "") {
showError("bodyInput", "bodyError", "Текст оголошення не може бути порожнім.");
isValid = false;
}

if (dto.author === "") {
showError("authorInput", "authorError", "Поле Author є обов'язковим.");
isValid = false;
}

return isValid;
}

function showError(inputId, errorId, message) {
document.getElementById(inputId).classList.add("invalid");
document.getElementById(errorId).innerHTML = message;
}

function clearErrors() {
document.getElementById("titleInput").classList.remove("invalid");
document.getElementById("categorySelect").classList.remove("invalid");
document.getElementById("bodyInput").classList.remove("invalid");
document.getElementById("authorInput").classList.remove("invalid");

document.getElementById("titleError").innerHTML = "";
document.getElementById("categoryError").innerHTML = "";
document.getElementById("bodyError").innerHTML = "";
document.getElementById("authorError").innerHTML = "";
}

function addPost(dto) {
const newPost = {
id: nextId++,
title: dto.title,
category: dto.category,
body: dto.body,
author: dto.author,
createdAt: new Date().toLocaleString()
};
posts.push(newPost);
}

function deletePost(id) {
const index = posts.findIndex(post => post.id === id);
if (index !== -1) {
posts.splice(index, 1);
}
}

function renderTable(items) {
const rowsHtml = items.map((item, index) => {
return "<tr>" +
"<td>" + (index + 1) + "</td>" +
"<td>" + item.title + "</td>" +
"<td>" + item.category + "</td>" +
"<td>" + item.author + "</td>" +
"<td>" + item.createdAt + "</td>" +
"<td><button type='button' class='delete-btn' data-id='" + item.id + "'>🗑️ Видалити</button></td>" +
"</tr>";
}).join("");

tbody.innerHTML = rowsHtml;
}