import { getAds, createAd, deleteAd } from "./apiClient.js";
import { renderTable, renderListStatus, showNotice, clearFormErrors } from "./ui.js";
const form = document.getElementById("createForm");
const tbody = document.getElementById("itemsTableBody");
const thead = document.querySelector("#itemsTable thead");
let currentAds = [];
let sortedColumn = "";
let sortAsc = true;
function applySort() {
    if (!sortedColumn)
        return;
    currentAds.sort((a, b) => {
        const key = sortedColumn;
        const valA = String(a[key] || "").toLowerCase();
        const valB = String(b[key] || "").toLowerCase();
        if (valA < valB)
            return sortAsc ? -1 : 1;
        if (valA > valB)
            return sortAsc ? 1 : -1;
        return 0;
    });
}
async function load() {
    renderListStatus("loading");
    try {
        currentAds = await getAds();
        applySort();
        renderTable(currentAds);
        renderListStatus(currentAds.length === 0 ? "empty" : "idle");
    }
    catch (e) {
        renderListStatus("error", e);
        showNotice(e.message, true);
    }
}
thead.addEventListener("click", (e) => {
    const target = e.target;
    const th = target.closest("th");
    if (!th || !th.dataset.key)
        return;
    const key = th.dataset.key;
    if (sortedColumn === key) {
        sortAsc = !sortAsc;
    }
    else {
        sortedColumn = key;
        sortAsc = true;
    }
    applySort();
    renderTable(currentAds);
});
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormErrors();
    const dto = {
        title: document.getElementById("titleInput").value.trim(),
        category: document.getElementById("categorySelect").value,
        body: document.getElementById("bodyInput").value.trim(),
        author: document.getElementById("authorInput").value.trim()
    };
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    try {
        await createAd(dto);
        showNotice("Оголошення додано успішно!");
        form.reset();
        await load();
    }
    catch (err) {
        if (err.errors) {
            if (err.errors.title)
                document.getElementById("titleError").innerText = err.errors.title[0];
            if (err.errors.category)
                document.getElementById("categoryError").innerText = err.errors.category[0];
            if (err.errors.body)
                document.getElementById("bodyError").innerText = err.errors.body[0];
        }
        else {
            showNotice("Сталася помилка збереження", true);
        }
    }
    finally {
        submitBtn.disabled = false;
    }
});
document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    clearFormErrors();
});
tbody.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("delete-btn")) {
        const id = target.dataset.id;
        if (!id)
            return;
        if (!confirm("Видалити оголошення?"))
            return;
        target.innerText = "...";
        try {
            await deleteAd(id);
            await load();
        }
        catch (err) {
            showNotice("Не вдалося видалити", true);
            target.innerText = "🗑️ Видалити";
        }
    }
});
load();
