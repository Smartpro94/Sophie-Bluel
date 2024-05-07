//Recup de la liste des works

const gallery = document.querySelector('.gallery');
const categoryContainer = document.getElementById('categories');

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
    for (let category of categories) {
      const button = document.createElement('button');
      button.innerHTML = category.name;
      button.setAttribute('attribut-category', category.id);
      categoryContainer.appendChild(button);
    }
  } catch (error) {
    console.error('Erreur fetching', error);
  }
};
getCategory();

categoryContainer.addEventListener("click", (event) => {
  const allButtons = document.querySelectorAll(".filters button");
  if (event.target.getAttribute("attribut-category")) {
    allButtons.forEach((button) => {
      button.classList.remove("active-filter");
    })
    const categoryId = parseInt(event.target.getAttribute("attribut-category"))
    event.target.classList.add("active-filter");
    FilterWorksByCategory(categoryId);
  }
})

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
