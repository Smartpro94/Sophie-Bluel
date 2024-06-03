// Configuration and global variables
const API_BASE_URL = 'http://localhost:5678/api';
let allWorks = [];

// DOM elements
const gallery = document.querySelector('.gallery');
const categoryContainer = document.getElementById('categories');
const galleryModal = document.querySelector('.galleryModal');
const formIndex = document.querySelector('.modal-form');
const connexionAlert = document.createElement('div');
connexionAlert.id = 'connexionAlert';
formIndex.appendChild(connexionAlert);

// Fetch and display works
async function fetchWorks() {
    try {
        const response = await fetch(`${API_BASE_URL}/works`);
        allWorks = await response.json();
        displayWorks(allWorks);
    } catch (error) {
        console.error('Error fetching works:', error);
    }
}

function displayWorks(works) {
    gallery.innerHTML = '';
    works.forEach(work => gallery.appendChild(createWorkFigure(work, false)));
}

function createWorkFigure(work, isModal) {
    const figure = document.createElement('figure');
    figure.setAttribute('work-id', work.id);
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    const caption = document.createElement('figcaption');
    caption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);

    if (isModal) {
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash-can fa-xs delete-icon';
        deleteIcon.style.cursor = 'pointer';
        figure.appendChild(deleteIcon);
    }

    return figure;
}

// Fetch and display categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        categories.unshift({ id: 0, name: 'Tous' });
        displayCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function displayCategories(categories) {
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.setAttribute('data-category', category.id);
        categoryContainer.appendChild(button);
    });
}

// Event listeners
categoryContainer.addEventListener('click', event => {
    const categoryId = event.target.getAttribute('data-category');
    if (categoryId) {
        const filteredWorks = categoryId === '0' ? allWorks : allWorks.filter(work => work.categoryId === parseInt(categoryId));
        displayWorks(filteredWorks);
    }
});

document.querySelector('.galleryModal').addEventListener('click', event => {
    if (event.target.classList.contains('delete-icon')) {
        const workId = event.target.closest('figure').getAttribute('work-id');
        deleteWork(workId);
    }
});

async function deleteWork(workId) {
    try {
        const response = await fetch(`${API_BASE_URL}/works/${workId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('Token')}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        fetchWorks();  // Refresh the works display
    } catch (error) {
        console.error('Error deleting work:', error);
    }
}

// Opening and Closing Modal
function openModal(event) {
    event.preventDefault();
    const modal = document.querySelector(event.target.getAttribute('href')); // Assuming href contains the selector to the modal
    if (modal) {
        modal.style.display = 'block'; // Show modal
        modal.addEventListener('click', closeModal);
        document.querySelector('.modal-icon').addEventListener('click', closeModal);
        document.querySelector('.js-icon').addEventListener('click', closeModal);
        modal.querySelector('.js-modal-1').addEventListener('click', stopPropagation);
        modal.querySelector('.js-modal-2').addEventListener('click', stopPropagation);
    }
}

function closeModal(event) {
    const modal = document.querySelector('.js-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.modal-icon').removeEventListener('click', closeModal);
        modal.querySelector('.js-icon').removeEventListener('click', closeModal);
    }
}

function stopPropagation(event) {
    event.stopPropagation();
}

// Event listener for opening the modal
document.querySelector('.js-modal').addEventListener('click', openModal);

// Token verification and UI adjustment based on authentication status
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('Token');
    // Toggle visibility of edit mode elements based on token presence
    const editElements = document.querySelectorAll('.edition, .js-modal');
    if (token) {
        editElements.forEach(el => el.style.display = 'block');
    } else {
        editElements.forEach(el => el.style.display = 'none');
    }
});



formIndex.addEventListener('submit', async event => {
    event.preventDefault();
    await submitWork();
});

async function submitWork() {
    const formData = new FormData(formIndex);
    try {
        const response = await fetch(`${API_BASE_URL}/works`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('Token')}` },
            body: formData
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        console.log('Work submitted:', result);
        fetchWorks();  // Refresh the works display
    } catch (error) {
        console.error('Error submitting work:', error);
        displayAlert('Failed to submit work.');
    }
}

function displayAlert(message) {
    connexionAlert.textContent = message;
    connexionAlert.style.visibility = 'visible';
    setTimeout(() => connexionAlert.style.visibility = 'hidden', 5000);
}

// Initial data loading
document.addEventListener('DOMContentLoaded', () => {
    fetchWorks();
    fetchCategories();
});

