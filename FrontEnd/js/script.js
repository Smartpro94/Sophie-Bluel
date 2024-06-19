//Recup de la liste des works

const gallery = document.querySelector('.gallery');
const categoryContainer = document.getElementById('categories');
const galleryModal = document.querySelector('.galleryModal');
const BASE_URL = 'http://localhost:5678/api/';

let allWorks = [];
let allCategory = [];

// Fonction pour récupérer et afficher les travaux
const getWorks = async () => {
  try {
    const response = await fetch(`${BASE_URL}works`);
    const works = await response.json();
    //on vérifie que le tableau est vide d'abord
    allWorks.length = 0;
    allWorks = works;
    console.log("L'ensemble des works est :", works);
    for (let work of works) {
      const figure = createWorksFigure(work);
      gallery.appendChild(figure);
    }
  } catch (error) {
    console.error('Erreur dans la récupération de works', error);
  }
};
getWorks();

// Fonction pour créer une figure HTML pour un travail
const createWorksFigure = (work) => {
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;
  figure.appendChild(img);

  const figcaption = document.createElement('figcaption');
  figcaption.innerText = work.title;
  figure.appendChild(figcaption);
  return figure;
};

// Fonction pour récupérer et afficher les catégories
const getCategory = async () => {
  try {
    const response = await fetch(`${BASE_URL}categories`);
    const categories = await response.json();
    categories.unshift({
      id: 0,
      name: 'Tous',
    });
    console.log("L'ensemble des catégorie est : ", categories);
    allCategory = categories;
    for (let category of categories) {
      const button = document.createElement('button');
      button.innerHTML = category.name;
      button.setAttribute('data-category', category.id);
      categoryContainer.appendChild(button);
    }
  } catch (error) {
    console.error('Erreur fetching', error);
  }
};
getCategory();

// Gestionnaire d'événements pour le clic sur les boutons de catégorie
categoryContainer.addEventListener('click', (event) => {
  const allButtons = document.querySelectorAll('.filters button');
  if (event.target.getAttribute('data-category')) {
    allButtons.forEach((button) => {
      button.classList.remove('active-filter');
    });
    const categoryId = parseInt(event.target.getAttribute('data-category'));
    event.target.classList.add('active-filter');
    FilterWorksByCategory(categoryId);
  }
});

// Fonction pour filtrer les travaux par catégorie
const FilterWorksByCategory = (categoryId) => {
  gallery.innerHTML = ''; //Efface le contenue de la gallerie
  if (categoryId === 0) {
    for (let work of allWorks) {
      const figure = createWorksFigure(work);
      gallery.appendChild(figure);
    }
  } else {
    const filteredWorks = allWorks.filter(
      (work) => work.categoryId === categoryId
    );
    for (let work of filteredWorks) {
      const figure = createWorksFigure(work);
      gallery.appendChild(figure);
    }
  }
};

//Crée des figures de travaux avec une icône de suppression pour chaque travail en modal
const createWorksModal = (work) => {
  const figure = document.createElement('figure');
  figure.setAttribute('work-id', work.id);
  const img = document.createElement('img');
  const icon = document.createElement('div');
  img.src = work.imageUrl;
  img.alt = work.title;
  icon.innerHTML = '<i class="fa-solid fa-trash-can fa-xs"></i>';
  icon.classList.add('delete-icon');
  icon.style.cursor = 'pointer';
  figure.appendChild(img);
  figure.appendChild(icon);
  return figure;
};

//Supprime un travail de la base de données et de l'affichage côté client
const deleteData = async (urlId, figure) => {
  var token = sessionStorage.getItem('Token');
  try {
    let response = await fetch(urlId, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Erreur http: ${response.status}`);
    }
    figure.remove();
    alert('Element supprimé');
    gallery.innerHTML = '';
    getWorks();
  } catch (error) {
    console.error("Erreur lorsqu'on essaye de supprimer les works");
  }
};

document
  .querySelector('.galleryModal')
  .addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-trash-can')) {
      const figure = event.target.closest('figure');
      const workId = figure.getAttribute('work-id');
      console.log("l'Id est :", workId);
      deleteData(`${BASE_URL}works/${workId}`, figure);
    }
  });

//Récupère et affiche les travaux dans une modal depuis l'API
const getWorksModal = async () => {
  try {
    const response = await fetch(`${BASE_URL}works`);
    const works = await response.json();
    //on vérifie que le tableau est vide d'abord
    allWorks.length = 0;
    allWorks = works;
    console.log("L'ensemble des works est :", works);
    for (let work of works) {
      const figure = createWorksModal(work);
      galleryModal.appendChild(figure);
    }
  } catch (error) {
    console.error('Erreur dans la récupération de works', error);
  }
};
getWorksModal();

//Remplit le sélecteur de catégories avec les options récupérées depuis allCategory, excluant la catégorie "Tous".
const selectCategory = () => {
  document.querySelector('#categorie').innerHTML = '';

  option = document.createElement('option');
  document.querySelector('#categorie').appendChild(option);
  console.log(allCategory);
  const categoriesWithoutTous = allCategory.filter(
    (categorie) => categorie.id != 0
  );

  categoriesWithoutTous.forEach((categorie) => {
    option = document.createElement('option');
    option.value = categorie.name;
    option.innerText = categorie.name;
    option.id = categorie.id;
    document.querySelector('#categorie').appendChild(option);
  });
};

let modal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute('href'));
  target.style.display = null;
  modal = target;
  modal.addEventListener('click', closeModal);
  modal.querySelector('.modal-icon').addEventListener('click', closeModal);
  modal.querySelector('.js-icon').addEventListener('click', closeModal);
  modal.querySelector('.js-modal-1').addEventListener('click', stopPropagation);
  modal.querySelector('.js-modal-2').addEventListener('click', stopPropagation);
  document.querySelector('.js-modal-1').style.display = 'flex';
  document.querySelector('.js-modal-2').style.display = 'none';
  selectCategory();
  resetInputs();
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  resetInputs();
  modal.style.display = 'none';
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.modal-icon').removeEventListener('click', closeModal);
  modal.querySelector('.js-icon').removeEventListener('click', closeModal);
  document.querySelector('.js-modal-1').style.display = 'flex';
  document.querySelector('.js-modal-2').style.display = 'none';
};

const stopPropagation = function (e) {
  e.stopPropagation();
};
document.querySelector('.js-modal').addEventListener('click', openModal);

let connected = false;
const logout = document.getElementById('logout');

document.addEventListener('DOMContentLoaded', function () {
  // Vérifie si le token est présent dans le sessionStorage
  const token = sessionStorage.getItem('Token');

  if (token) {
    connected = true;
  }

  // Si le token est présent, affiche les éléments
  if (connected) {
    // Affiche les éléments qui étaient masqués
    document.querySelector('.edition').style.display = null;
    document.querySelector('.js-modal').style.display = null;
    categoryContainer.style.display = 'none';
    logout.innerHTML = 'logout';
  } else {
    // Si le token n'est pas présent, masque les éléments
    document.querySelector('.edition').style.display = 'none';
    document.querySelector('.js-modal').style.display = 'none';
    categoryContainer.style.display = 'flex';
  }
});

//Au click sur le logout
logout.addEventListener('click', () => {
  if (connected) {
    connected = false;
    sessionStorage.removeItem('Token');
    logout.innerHTML = 'login';
    logout.href = 'index.html';
  } else {
    window.location.href = 'index.html';
  }
});

document.querySelector('.modal-button').addEventListener('click', function () {
  document.querySelector('.js-modal-1').style.display = 'none';
  document.querySelector('.js-modal-2').style.display = 'flex';
  resetInputs();
});

document.querySelector('.modal-arrow').addEventListener('click', function () {
  document.querySelector('.js-modal-1').style.display = 'flex';
  document.querySelector('.js-modal-2').style.display = 'none';
});

document
  .querySelector('.button-file button')
  .addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('fileInput').click();
  });

document
  .querySelector('.button-file .fa-image')
  .addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('fileInput').click();
  });

document
  .getElementById('fileInput')
  .addEventListener('change', function (event) {
    const file = event.target.files[0];
    const ACCEPTED_EXTENSIONS = ['png', 'jpg'];
    // Stocker le nom du fichier dans une variable
    const fileName = file.name;
    console.log('Nom du fichier sélectionné:', fileName);
    const extension = fileName.split('.').pop().toLowerCase();

    if (
      file &&
      file.size <= 4 * 1024 * 1024 &&
      ACCEPTED_EXTENSIONS.includes(extension)
    ) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.getElementById('preview');
        img.src = e.target.result;
        img.style.display = 'flex';
        document.querySelector('.button-file button').style.display = 'none';
        document.querySelector('.button-file i').style.display = 'none';
        document.querySelector('.button-file p').style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      console.error("L'image ne respecte pas les critères");
    }
  });

//Formulaire validé = changement de couleur du bouton
let form = document.querySelector('.modal-form');
let button = document.getElementById('input-color-validation');

function buttonColor() {
  let champs = form.querySelectorAll('input');
  let selects = form.querySelectorAll('select');
  for (let select of selects) {
    if (!select.value) {
      return false;
    }
  }
  for (let champ of champs) {
    if (!champ.value) {
      return false;
    }
  }
  return true;
}

function changerCouleurBouton() {
  if (buttonColor()) {
    button.style.backgroundColor = '#1D6154';
  } else {
    button.style.backgroundColor = '';
  }
}

const champs = form.querySelectorAll('input');
for (let champ of champs) {
  champ.addEventListener('input', changerCouleurBouton);
}
const selects = form.querySelectorAll('select');
for (let select of selects) {
  select.addEventListener('input', changerCouleurBouton);
}

const connexionAlert = document.createElement('div'); // Crée un nouvel élément div pour les alertes de connexion
connexionAlert.id = 'connexionAlert'; // Attribue un ID à la nouvelle div
form.appendChild(connexionAlert); // Ajoute la div d'alerte au formulaire

form.addEventListener('submit', async function (e) {
  e.preventDefault(); // Empêche le comportement de soumission de formulaire par défaut
  await connect(); // Appelle la fonction connect
});

//Pour transformer l'image en blob (binary large object) afin de faciliter le televersement.
const convertDataURLToBlob = async (dataurl) => {
  const res = await fetch(dataurl);
  return await res.blob();
};

//Envoie les données du formulaire pour créer un nouveau travail dans la base de données
const connect = async () => {
  const token = sessionStorage.getItem('Token');

  const select = document.getElementById('categorie');
  const title = document.getElementById('title').value;
  const optionName = select.options[select.selectedIndex].innerText;
  const optionId = select.options[select.selectedIndex].id;

  const fileInput = document.getElementById('fileInput');
  const selectedFile = fileInput.files[0];

  const reader = new FileReader();
  reader.onloadend = async function (event) {
    const base64String = event.target.result;
    const blobImg = await convertDataURLToBlob(base64String);

    const formData = new FormData();
    formData.append('image', blobImg);
    formData.append('title', title);
    formData.append('category', optionId);

    uploadWorkToDatabase(token, formData, title, optionName);
  };
  reader.readAsDataURL(selectedFile);
};

//Permet d'ajouter un work dans la BDD ensuite dans la gallery
const uploadWorkToDatabase = async (token, formData, title, optionName) => {
  const urlPostWork = `${BASE_URL}works`;
  try {
    const response = await fetch(urlPostWork, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      console.error(`Erreur HTTP : ${response.status}`);
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const responseData = await response.json();
    alert(title + ' a bien été publié');
    console.log('Successful response:', responseData);
    gallery.innerHTML = ''; //Vide la galerie
    galleryModal.innerHTML = '';
    appendGallery(responseData, optionName);
    await getWorks();
    await getWorksModal();
    document.querySelector('#modal').style.display = 'none';
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
  }
};

//Ajoute un nouveau travail à la liste allWorks après son ajout dans la base de données
const appendGallery = (data, optionName) => {
  let workToAdd = {};
  workToAdd.title = data.title;
  workToAdd.id = data.id;
  workToAdd.category = { id: data.optionId, name: optionName };
  workToAdd.imageUrl = data.imageUrl;
  allWorks.push(workToAdd);
};

const resetInputs = () => {
  const imgPreview = document.getElementById('preview');
  document.getElementById('title').value = '';
  fileInput.value = ''; //Initialise l'élement input
  imgPreview.src = '';
  imgPreview.style.display = 'none';
  document.querySelector('.button-file button').style.display = 'inline';
  document.querySelector('.button-file .fa-image').style.display = 'inline';
  document.querySelector('.button-file p').style.display = 'flex';
};
