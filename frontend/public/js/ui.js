export function renderTable(items) {
    const tbody = document.getElementById("itemsTableBody");
    if (!tbody)
        return;
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        const row = document.createElement("tr");
        const tdIndex = document.createElement("td");
        tdIndex.textContent = String(index + 1);
        const tdTitle = document.createElement("td");
        tdTitle.textContent = item.title;
        const tdCat = document.createElement("td");
        tdCat.textContent = item.category;
        const tdAuth = document.createElement("td");
        tdAuth.textContent = item.author;
        const tdDate = document.createElement("td");
        tdDate.textContent = item.createdAt;
        const tdAction = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "delete-btn";
        btn.dataset.id = item.id;
        btn.textContent = "🗑️ Видалити";
        tdAction.appendChild(btn);
        row.append(tdIndex, tdTitle, tdCat, tdAuth, tdDate, tdAction);
        tbody.appendChild(row);
    });
}
export function renderListStatus(status, error) {
    const tbody = document.getElementById("itemsTableBody");
    if (!tbody)
        return;
    if (status === "loading") {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Завантаження...</td></tr>`;
    }
    else if (status === "error") {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Помилка: ${error?.message || "Не вдалося завантажити дані"}</td></tr>`;
    }
    else if (status === "empty") {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Список оголошень порожній.</td></tr>`;
    }
}
export function clearFormErrors() {
    const errorIds = ["titleError", "categoryError", "bodyError"];
    errorIds.forEach(id => {
        const el = document.getElementById(id);
        if (el)
            el.innerText = "";
    });
}
export function showNotice(message, isError = false) {
    if (isError) {
        alert(`❌ Помилка: ${message}`);
    }
    else {
        alert(`✅ ${message}`);
    }
}
