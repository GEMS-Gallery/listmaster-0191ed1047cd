import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('add-item-form');
    const input = document.getElementById('new-item');
    const list = document.getElementById('shopping-list');

    // Load initial items
    await loadItems();

    // Add new item
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = input.value.trim();
        if (description) {
            await backend.addItem(description);
            input.value = '';
            await loadItems();
        }
    });

    // Load and display items
    async function loadItems() {
        const items = await backend.getItems();
        list.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${item.completed ? 'completed' : ''}">${item.description}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            li.dataset.id = item.id;
            li.addEventListener('click', toggleCompleted);
            li.querySelector('.delete-btn').addEventListener('click', deleteItem);
            list.appendChild(li);
        });
    }

    // Toggle completed status
    async function toggleCompleted(e) {
        if (e.target.tagName === 'BUTTON') return;
        const id = parseInt(this.dataset.id);
        await backend.toggleCompleted(id);
        await loadItems();
    }

    // Delete item
    async function deleteItem(e) {
        e.stopPropagation();
        const id = parseInt(this.parentElement.dataset.id);
        await backend.deleteItem(id);
        await loadItems();
    }
});