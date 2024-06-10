//Recup de la liste des works

const gallery = document.querySelector('.gallery');
const categoryContainer = document.getElementById('categories');
const galleryModal = document.querySelector('.galleryModal');
var url = 'http://localhost:5678/api/works/id';

let allWorks = [];
let allCategory = [];

const getWorks = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/works');
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

const getCategory = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
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

document
  .querySelector('.galleryModal')
  .addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-trash-can')) {
      const figure = event.target.closest('figure');
      const workId = figure.getAttribute('work-id');
      console.log("l'Id est :", workId);
      deleteData(`http://localhost:5678/api/works/${workId}`, figure);
    }
  });

const getWorksModal = async () => {
  try {
    const response = await fetch('http://localhost:5678/api/works');
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
  } catch (error) {
    console.error("Erreur lorsqu'on essaye de supprimer les works");
  }
  gallery.innerHTML = '';
  getWorks();
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
  selectCategory();
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = 'none';
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.modal-icon').removeEventListener('click', closeModal);
  modal = null;
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
    logout.innerHTML = 'logout';
  } else {
    // Si le token n'est pas présent, masque les éléments
    document.querySelector('.edition').style.display = 'none';
    document.querySelector('.js-modal').style.display = 'none';
  }
});

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
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]);
  let n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

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
    var blobImg = dataURLtoBlob(base64String);

    const formData = new FormData();
    formData.append('image', blobImg);
    formData.append('title', title);
    formData.append('category', optionId);

    postDataBdd(token, formData, title, optionName);
  };
  reader.readAsDataURL(selectedFile);
};

//Permet d'ajouter un work dans la BDD ensuite dans la gallery
const postDataBdd = async (token, formData, title, optionName) => {
  const urlPostWork = 'http://localhost:5678/api/works';
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
    addToWorksData(responseData, optionName);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
  }
};

const addToWorksData = (data, optionName) => {
  newWork = {};
  newWork.title = data.title;
  newWork.id = data.id;
  newWork.category = { id: data.optionId, name: optionName };
  newWork.imageUrl = data.imageUrl;
  allWorks.push(newWork);
};
