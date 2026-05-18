import type { AdDto, ApiError } from "./dtos.js";

export function showNotice(text: string, isError = false) {
    const el = document.getElementById("notice")!;
    el.innerHTML = text;
    el.style.backgroundColor = isError ? "#ffcccc" : "#ccffcc";
    setTimeout(() => { 
        el.innerHTML = ""; 
        el.style.backgroundColor = "transparent"; 
    }, 4000);
}

export function clearFormErrors() {
    ["titleError", "categoryError", "bodyError", "authorError"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = "";
    });
}

export function renderListStatus(status: "idle" | "loading" | "empty" | "error", error?: ApiError) {
    const el = document.getElementById("listStatus")!;
    if (status === "loading") el.innerHTML = "Завантаження...";
    else if (status === "empty") el.innerHTML = "Список порожній.";
    else if (status === "error") el.innerHTML = `Помилка: ${error?.message}`;
    else el.innerHTML = "";
}

export function renderTable(items: AdDto[]) {
    const tbody = document.getElementById("itemsTableBody")!;
    tbody.innerHTML = "";
    
    items.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>${item.author}</td>
            <td>${item.createdAt}</td>
            <td><button class="delete-btn" data-id="${item.id}">🗑️ Видалити</button></td>
        `;
        tbody.appendChild(row);
    });
}