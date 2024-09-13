import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('add-item-form');
    const input = document.getElementById('new-item');
    const emojiInput = document.getElementById('new-item-emoji');
    const list = document.getElementById('shopping-list');
    const predefinedCategories = document.getElementById('predefined-categories');
    const saveCartBtn = document.getElementById('save-cart-btn');

    let shoppingItems = [];

    // Load initial items and predefined categories
    await loadItems();
    await loadPredefinedCategories();

    // Add new item
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = input.value.trim();
        const emoji = emojiInput.value.trim();
        if (description) {
            const id = await backend.addItem(description, emoji);
            const newItem = { id, description, completed: false, emoji };
            shoppingItems.push(newItem);
            renderItems();
            input.value = '';
            emojiInput.value = '';
        }
    });

    // Load and display items
    async function loadItems() {
        shoppingItems = await backend.getItems();
        renderItems();
    }

    // Render shopping items
    function renderItems() {
        list.innerHTML = '';
        shoppingItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${item.completed ? 'completed' : ''}">
                    ${item.emoji} ${item.description}
                </span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            li.dataset.id = item.id;
            li.addEventListener('click', toggleCompleted);
            li.querySelector('.delete-btn').addEventListener('click', deleteItem);
            list.appendChild(li);
        });
    }

    // Load and display predefined categories
    async function loadPredefinedCategories() {
        const categories = await backend.getPredefinedCategories();
        predefinedCategories.innerHTML = '';
        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.innerHTML = `
                <h2>${category.name}</h2>
                <div class="category-items">
                    ${category.items.map(item => `
                        <span class="category-item" data-description="${item.description}" data-emoji="${item.emoji}">
                            ${item.emoji} ${item.description}
                        </span>
                    `).join('')}
                </div>
            `;
            predefinedCategories.appendChild(categoryDiv);
        });

        // Add event listeners to predefined items
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', addPredefinedItem);
        });
    }

    // Add predefined item to the shopping list
    async function addPredefinedItem(e) {
        const description = this.dataset.description;
        const emoji = this.dataset.emoji;
        const id = await backend.addItem(description, emoji);
        const newItem = { id, description, completed: false, emoji };
        shoppingItems.push(newItem);
        renderItems();
    }

    // Toggle completed status
    async function toggleCompleted(e) {
        if (e.target.tagName === 'BUTTON') return;
        const id = parseInt(this.dataset.id);
        const updatedItem = await backend.toggleItemCompleted(id);
        const index = shoppingItems.findIndex(item => item.id === id);
        if (index !== -1) {
            shoppingItems[index] = updatedItem;
            renderItems();
        }
    }

    // Delete item
    async function deleteItem(e) {
        e.stopPropagation();
        const id = parseInt(this.parentElement.dataset.id);
        const success = await backend.deleteItem(id);
        if (success) {
            shoppingItems = shoppingItems.filter(item => item.id !== id);
            renderItems();
        }
    }

    // Save cart
    saveCartBtn.addEventListener('click', async () => {
        const success = await backend.saveCart(shoppingItems);
        if (success) {
            alert('Cart saved successfully!');
        } else {
            alert('Failed to save cart. Please try again.');
        }
    });
});