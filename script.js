const API_URL = 'https://openapi.programming-hero.com/api';

let cart = [];
let plantsData = [];

const cartList = document.getElementById('cart-list');
const totalPriceSpan = document.getElementById('total-price');
const plantsContainer = document.getElementById('plants-container');
const categoriesList = document.getElementById('categories-list');
const modal = document.getElementById('plant-modal');
const modalBody = document.getElementById('modal-body');
const spinner = document.getElementById('loading-spinner');
const donationForm = document.getElementById('donation-form');

/**
 * Toggles the visibility of the loading spinner.
 * @param {boolean} show - True to show, false to hide.
 */
const toggleSpinner = (show) => {
    spinner.style.display = show ? 'block' : 'none';
};

const loadCategories = async () => {
    toggleSpinner(true);
    try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        const categories = data?.categories || [];

        categoriesList.innerHTML = '<li class="active" data-id="all">All Trees</li>';

        categories.forEach((cat) => {
            const li = document.createElement('li');
            li.textContent = cat.category_name;
            li.dataset.id = String(cat.id);
            categoriesList.appendChild(li);
        });

        await loadPlants('all');
    } catch (err) {
        console.error('Category load failed:', err);
    } finally {
        toggleSpinner(false);
    }
};

/**
 * Fetches and displays plants for a given category.
 * @param {string} categoryId - The ID of the category, or 'all'.
 */
const loadPlants = async (categoryId) => {
    toggleSpinner(true);
    try {
        const url = categoryId === 'all' ? `${API_URL}/plants` : `${API_URL}/category/${categoryId}`;
        const res = await fetch(url);
        const data = await res.json();

        plantsData = data?.plants || data?.data || [];
        displayPlants(plantsData);
    } catch (err) {
        console.error('Plant load failed:', err);
        plantsContainer.innerHTML = '<p style="text-align:center">Could not load plants.</p>';
    } finally {
        toggleSpinner(false);
    }
};

/**
 * Renders plant cards to the main container.
 * @param {Array} plants - An array of plant objects.
 */
const displayPlants = (plants) => {
    plantsContainer.innerHTML = '';
    if (!plants || plants.length === 0) {
        plantsContainer.innerHTML = '<p style="text-align:center">No plants found for this category.</p>';
        return;
    }

    plants.forEach((plant) => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3 class="plant-name" data-id="${plant.id}">${plant.name}</h3>
            <p class="plant-description">${plant.small_description || plant.description || ''}</p>
            <span class="plant-category"><span>${plant.category_name || plant.category || '—'}</span></span>
            <p class="plant-price">৳<span>${Number(plant.price) || 0}</span></p>
            <button class="add-to-cart-btn" data-id="${plant.id}">Add to cart</button>
        `;
        plantsContainer.appendChild(card);
    });
};

const updateCartUI = () => {
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        const li = document.createElement('li');
        total += item.price * item.quantity;

        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price-qty">৳${item.price} × ${item.quantity}</span>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">×</button>
        `;
        cartList.appendChild(li);
    });

    totalPriceSpan.textContent = total.toFixed(2).replace(/\.00$/, '');
};

/**
 * Adds a plant to the shopping cart.
 * @param {string} plantId - The ID of the plant to add.
 */
const addToCart = (plantId) => {
    const idNum = parseInt(plantId, 10);
    const item = plantsData.find((p) => parseInt(p.id, 10) === idNum);
    if (!item) return;

    const existing = cart.find((c) => parseInt(c.id, 10) === idNum);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: idNum,
            name: item.name,
            price: Number(item.price) || 0,
            quantity: 1,
        });
    }
    updateCartUI();
};

/**
 * Removes a plant from the shopping cart.
 * @param {string} plantId - The ID of the plant to remove.
 */
const removeFromCart = (plantId) => {
    const idNum = parseInt(plantId, 10);
    cart = cart.filter((c) => parseInt(c.id, 10) !== idNum);
    updateCartUI();
};

/**
 * Displays a plant's details in a modal using locally stored data.
 * @param {string} plantId - The ID of the plant.
 */
const showPlantDetails = (plantId) => {
    const idNum = parseInt(plantId, 10);
    const plant = plantsData.find((p) => parseInt(p.id, 10) === idNum);

    if (!plant) {
        modalBody.innerHTML = '<p>Sorry, no details found for this tree.</p>';
    } else {
        modalBody.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <p><strong>Description:</strong> ${plant.description || plant.small_description || 'No description available.'}</p>
            <p><strong>Category:</strong> ${plant.category || plant.category_name || '—'}</p>
            <p><strong>Price:</strong> ৳${Number(plant.price) || 0}</p>
        `;
    }
    modal.style.display = 'block';
};

/**
 * Sets the active class for a category list item and loads the corresponding plants.
 * @param {HTMLElement} element - The clicked category list item.
 */
const setActiveCategory = (element) => {
    document.querySelectorAll('#categories-list li').forEach((li) => li.classList.remove('active'));
    element.classList.add('active');
    loadPlants(element.dataset.id);
};

// --- Event Listeners ---
// Use specific event listeners instead of one large document-wide listener
plantsContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('add-to-cart-btn')) {
        addToCart(target.dataset.id);
    } else if (target.closest('.plant-card')) {
        const card = target.closest('.plant-card');
        const id = card.querySelector('.plant-name')?.dataset?.id;
        if (id) {
            showPlantDetails(id);
        }
    }
});

cartList.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('remove-item-btn')) {
        removeFromCart(target.dataset.id);
    }
});

categoriesList.addEventListener('click', (e) => {
    const catLi = e.target.closest('li');
    if (catLi) {
        setActiveCategory(catLi);
    }
});

modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn') || e.target.id === 'plant-modal') {
        modal.style.display = 'none';
    }
});

donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your donation! 💚');
    e.target.reset();
});

document.addEventListener('DOMContentLoaded', loadCategories);