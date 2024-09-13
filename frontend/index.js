import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('add-item-form');
    const input = document.getElementById('new-item');
    const emojiInput = document.getElementById('new-item-emoji');
    const shoppingList = document.getElementById('shopping-list');
    const predefinedCategories = document.getElementById('predefined-categories');
    const saveCartBtn = document.getElementById('save-cart-btn');
    const notification = document.getElementById('notification');
    const listViewBtn = document.getElementById('list-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');

    let shoppingItems = [];

    // Load initial items and predefined categories
    await loadItems();
    await loadPredefinedCategories();

    // Toggle view
    listViewBtn.addEventListener('click', () => {
        shoppingList.className = 'list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        predefinedCategories.style.display = 'block';
        renderItems();
    });

    gridViewBtn.addEventListener('click', () => {
        shoppingList.className = 'grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        predefinedCategories.style.display = 'none';
        renderItems();
    });

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Add new item
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = input.value.trim();
        const emoji = emojiInput.value.trim();
        if (description) {
            addItem(description, emoji);
            input.value = '';
            emojiInput.value = '';
        }
    });

    async function addItem(description, emoji) {
        const tempId = Date.now();
        const tempItem = { id: tempId, description, completed: false, emoji };
        shoppingItems.push(tempItem);
        renderItems();
        showNotification('Item added successfully!');

        try {
            const id = await backend.addItem(description, emoji);
            const index = shoppingItems.findIndex(item => item.id === tempId);
            if (index !== -1) {
                shoppingItems[index].id = id;
            }
        } catch (error) {
            console.error('Failed to add item:', error);
            shoppingItems = shoppingItems.filter(item => item.id !== tempId);
            renderItems();
            showNotification('Failed to add item. Please try again.');
        }
    }

    // Load and display items
    async function loadItems() {
        shoppingItems = await backend.getItems();
        renderItems();
    }

    // Render shopping items
    function renderItems() {
        shoppingList.innerHTML = '';
        const isListView = shoppingList.classList.contains('list-view');
        shoppingItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `shopping-item ${item.completed ? 'completed' : ''}`;
            if (isListView) {
                itemElement.innerHTML = `
                    <div class="item-content">
                        <span class="item-emoji">${item.emoji}</span>
                        <span class="item-description">${item.description}</span>
                    </div>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                `;
            } else {
                itemElement.innerHTML = `
                    <span class="item-emoji">${item.emoji}</span>
                    <span class="item-description">${item.description}</span>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                `;
            }
            itemElement.dataset.id = item.id;
            itemElement.addEventListener('click', toggleCompleted);
            itemElement.querySelector('.delete-btn').addEventListener('click', deleteItem);
            shoppingList.appendChild(itemElement);
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
    function addPredefinedItem(e) {
        const description = this.dataset.description;
        const emoji = this.dataset.emoji;
        addItem(description, emoji);
    }

    // Toggle completed status
    async function toggleCompleted(e) {
        if (e.target.tagName === 'BUTTON') return;
        const id = parseInt(this.dataset.id);
        const index = shoppingItems.findIndex(item => item.id === id);
        if (index !== -1) {
            shoppingItems[index].completed = !shoppingItems[index].completed;
            renderItems();
            try {
                await backend.toggleItemCompleted(id);
            } catch (error) {
                console.error('Failed to toggle item:', error);
                shoppingItems[index].completed = !shoppingItems[index].completed;
                renderItems();
                showNotification('Failed to update item. Please try again.');
            }
        }
    }

    // Delete item
    async function deleteItem(e) {
        e.stopPropagation();
        const id = parseInt(this.parentElement.dataset.id);
        const index = shoppingItems.findIndex(item => item.id === id);
        if (index !== -1) {
            shoppingItems.splice(index, 1);
            renderItems();
            showNotification('Item deleted successfully!');
            try {
                await backend.deleteItem(id);
            } catch (error) {
                console.error('Failed to delete item:', error);
                shoppingItems.splice(index, 0, { id, description: 'Error: Item not deleted', completed: false, emoji: '❌' });
                renderItems();
                showNotification('Failed to delete item. Please try again.');
            }
        }
    }

    // Save cart
    saveCartBtn.addEventListener('click', async () => {
        try {
            await backend.saveCart(shoppingItems);
            showNotification('Cart saved successfully!');
        } catch (error) {
            console.error('Failed to save cart:', error);
            showNotification('Failed to save cart. Please try again.');
        }
    });
});