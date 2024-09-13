import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('add-item-form');
    const input = document.getElementById('new-item');
    const emojiInput = document.getElementById('new-item-emoji');
    const list = document.getElementById('shopping-list');
    const predefinedCategories = document.getElementById('predefined-categories');
    const saveCartBtn = document.getElementById('save-cart-btn');
    const notification = document.getElementById('notification');

    let shoppingItems = [];

    // Load initial items and predefined categories
    await loadItems();
    await loadPredefinedCategories();

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Add new item with debounce
    const debouncedAddItem = debounce(async (description, emoji) => {
        const id = await backend.addItem(description, emoji);
        const newItem = { id, description, completed: false, emoji };
        shoppingItems.push(newItem);
        renderItems();
        showNotification('Item added successfully!');
    }, 300);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = input.value.trim();
        const emoji = emojiInput.value.trim();
        if (description) {
            // Optimistic update
            const tempId = Date.now();
            const tempItem = { id: tempId, description, completed: false, emoji };
            shoppingItems.push(tempItem);
            renderItems();
            input.value = '';
            emojiInput.value = '';
            debouncedAddItem(description, emoji);
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
        // Optimistic update
        const tempId = Date.now();
        const tempItem = { id: tempId, description, completed: false, emoji };
        shoppingItems.push(tempItem);
        renderItems();
        debouncedAddItem(description, emoji);
    }

    // Toggle completed status
    async function toggleCompleted(e) {
        if (e.target.tagName === 'BUTTON') return;
        const id = parseInt(this.dataset.id);
        // Optimistic update
        const index = shoppingItems.findIndex(item => item.id === id);
        if (index !== -1) {
            shoppingItems[index].completed = !shoppingItems[index].completed;
            renderItems();
        }
        const updatedItem = await backend.toggleItemCompleted(id);
        // Update with server response
        const serverIndex = shoppingItems.findIndex(item => item.id === updatedItem.id);
        if (serverIndex !== -1) {
            shoppingItems[serverIndex] = updatedItem;
            renderItems();
        }
    }

    // Delete item
    async function deleteItem(e) {
        e.stopPropagation();
        const id = parseInt(this.parentElement.dataset.id);
        // Optimistic update
        shoppingItems = shoppingItems.filter(item => item.id !== id);
        renderItems();
        const success = await backend.deleteItem(id);
        if (!success) {
            // Revert if delete failed
            await loadItems();
        }
    }

    // Save cart
    saveCartBtn.addEventListener('click', async () => {
        const success = await backend.saveCart(shoppingItems);
        if (success) {
            showNotification('Cart saved successfully!');
        } else {
            showNotification('Failed to save cart. Please try again.');
        }
    });
});