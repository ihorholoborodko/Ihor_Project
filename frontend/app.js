const posts = [];

const form = document.getElementById("createForm");
const resetBtn = document.getElementById("resetBtn");

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
    id: posts.length + 1,
    title: dto.title,
    category: dto.category,
    body: dto.body,
    author: dto.author,
    createdAt: new Date().toLocaleString()
  };
  posts.push(newPost);
}

function renderTable(items) {
  const tbody = document.getElementById("itemsTableBody");
  
  const rowsHtml = items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.title}</td>
      <td>${item.category}</td>
      <td>${item.author}</td>
      <td>${item.createdAt}</td>
    </tr>
  `).join("");
  
  tbody.innerHTML = rowsHtml;
}
// 1