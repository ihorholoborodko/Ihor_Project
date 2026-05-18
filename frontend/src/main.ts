import { getAds, createAd, deleteAd } from "./apiClient.js";
import { renderTable, renderListStatus, showNotice, clearFormErrors } from "./ui.js";
import type { CreateAdDto, AdDto } from "./dtos.js";

const form = document.getElementById("createForm") as HTMLFormElement;
const tbody = document.getElementById("itemsTableBody") as HTMLTableSectionElement;
const thead = document.querySelector("#itemsTable thead") as HTMLTableSectionElement;

let currentAds: AdDto[] = [];
let sortedColumn: string = "";
let sortAsc: boolean = true;

function applySort() {
    if (!sortedColumn) return;

    currentAds.sort((a, b) => {
        const key = sortedColumn as keyof AdDto;
        
        const valA = String(a[key] || "").toLowerCase();
        const valB = String(b[key] || "").toLowerCase();

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
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
    } catch (e: any) {
        renderListStatus("error", e);
        showNotice(e.message, true);
    }
}

thead.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const th = target.closest("th");
    if (!th || !th.dataset.key) return;

    const key = th.dataset.key;

    if (sortedColumn === key) {
        sortAsc = !sortAsc;
    } else {
        sortedColumn = key;
        sortAsc = true;
    }

    applySort();
    renderTable(currentAds);
});

form.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    clearFormErrors();
    
    const dto: CreateAdDto = {
        title: (document.getElementById("titleInput") as HTMLInputElement).value.trim(),
        category: (document.getElementById("categorySelect") as HTMLSelectElement).value,
        body: (document.getElementById("bodyInput") as HTMLTextAreaElement).value.trim(),
        author: (document.getElementById("authorInput") as HTMLInputElement).value.trim()
    };

    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
    submitBtn.disabled = true;

    try {
        await createAd(dto);
        showNotice("Оголошення додано успішно!");
        form.reset();
        await load(); 
    } catch (err: any) {
        if (err.errors) {
            if (err.errors.title) (document.getElementById("titleError") as HTMLElement).innerText = err.errors.title[0];
            if (err.errors.category) (document.getElementById("categoryError") as HTMLElement).innerText = err.errors.category[0];
            if (err.errors.body) (document.getElementById("bodyError") as HTMLElement).innerText = err.errors.body[0];
        } else {
            showNotice("Сталася помилка збереження", true);
        }
    } finally {
        submitBtn.disabled = false;
    }
});

document.getElementById("resetBtn")!.addEventListener("click", () => {
    form.reset();
    clearFormErrors();
});

tbody.addEventListener("click", async (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("delete-btn")) {
        const id = target.dataset.id;
        if (!id) return;
        
        if (!confirm("Видалити оголошення?")) return;
        
        target.innerText = "...";
        try {
            await deleteAd(id);
            await load(); 
        } catch (err: any) {
            showNotice("Не вдалося видалити", true);
            target.innerText = "🗑️ Видалити";
        }
    }
});

load();