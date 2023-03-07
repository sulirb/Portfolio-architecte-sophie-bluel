import { fetchWorks, deleteWorks, postWorks } from "./api.js";
// Création de la logique d'ouverture de la modale

const galleryDialog = document.getElementById("galleryDialog");
const myButton = document.getElementById("myButton");
const galleryCloseButton = document.getElementById("galleryCloseButton");
const body = document.body;

// Ouvre la fenêtre modale lorsqu'on clique sur le bouton
function openModal() {
  return galleryDialog.showModal();
}
myButton.addEventListener("click", openModal);

const categoriesSet = {};
async function main() {
  const data = await fetchWorks();
  createWorks(data);

  // Utilisation des catégories sur le formulaire
  for (const work of data) {
    categoriesSet[work.category.name] = work.category.id;
  }

  const datalistElement = document.getElementById("category-id");
  for (const [name, id] of Object.entries(categoriesSet)) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", id);
    optionElement.innerText = name;
    datalistElement.appendChild(optionElement);
  }
}

main();

// Création des éléments dans la modale

const modaleGallery = document.querySelector(".modal-gallery");

function createWorks(data) {
  for (const article of data) {
    // Création des works
    const worksElement = modaleGallery.appendChild(
      document.createElement("article")
    );

    const imageElement = worksElement.appendChild(
      document.createElement("img")
    );
    imageElement.src = article.imageUrl;
    imageElement.setAttribute("crossorigin", "anonymous");

    const titleElement = worksElement.appendChild(document.createElement("p"));
    titleElement.innerText = "éditer";

    const moveButton = worksElement.appendChild(
      document.createElement("button")
    );
    moveButton.classList.add("move-button");
    const moveIcon = document.createElement("i");
    moveIcon.classList.add("fas", "fa-arrows-up-down-left-right");
    moveButton.appendChild(moveIcon);

    // Ajouter l'événement "mouseover"
    worksElement.addEventListener("mouseover", function () {
      moveButton.style.display = "inline-block"; // Afficher le bouton de déplacement
    });

    // Ajouter l'événement "mouseout"
    worksElement.addEventListener("mouseout", function () {
      moveButton.style.display = "none"; // Masquer le bouton de déplacement
    });

    // Extrait l'id de chaque work
    worksElement.setAttribute("data-id", article.id);

    addDeleteButton(worksElement);
    addDeleteAll();
  }
}

// Supprime un ID
function addDeleteButton(worksElement) {
  const deleteButton = worksElement.appendChild(
    document.createElement("button")
  );
  deleteButton.classList.add("delete-button");
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fas", "fa-trash-can");
  deleteButton.appendChild(trashIcon);

  // Supression des éléments sur la modale
  deleteButton.addEventListener("click", async function (e) {
    // Utilise l'id d'un work pour le supprimer
    e.preventDefault();
    const id = worksElement.getAttribute("data-id");
    deleteWorks(id);
    worksElement.remove(); // supprime l'élément du DOM (supprime avant de refresh)
  });
}

// Supprime tous les ID
function addDeleteAll() {
  const deleteAll = document.getElementById("delete-all");
  deleteAll.addEventListener("click", async function (e) {
    const worksElements = document.querySelectorAll("[data-id]");
    // Boucle sur chaque data id pour pouvoir les supprimer d'un coup
    for (let i = 0; i < worksElements.length; i++) {
      e.preventDefault();
      const id = worksElements[i].getAttribute("data-id");
      await deleteWorks(id);
      worksElements[i].remove(); // supprime les éléments du DOM (supprime avant de refresh)
    }
  });
}

// Envoi d’un nouveau projet au back-end via le formulaire de la modale

const myForm = document.getElementById("myForm");

myForm.addEventListener("submit", function (e) {
  const formData = new FormData(myForm);
  postWorks(formData);
});

// Rajout bouton pour ajouter une image

const addImageButton = document.getElementById("add-image-button");

// Ajout d'un événement "click" au bouton
addImageButton.addEventListener("click", () => {
  imgInp.click();
});

// Prévisualisation de l'image
imgInp.onchange = (evt) => {
  const [file] = imgInp.files;
  if (file) {
    photo.src = URL.createObjectURL(file);
    const photoIcon = document.querySelector(".fa-image");
    photoIcon.style.display = "none";
    addImageButton.style.display = "none";
    document.getElementById("infoText").style.display = "none";
    document.querySelector('input[type="submit"]').style.backgroundColor =
      "#1d6154";
  }
};

// Création de la 2ème page modale
const addPhotoButton = document.getElementById("add-photo");
const submitDialog = document.getElementById("submitDialog");
const submitCloseButton = document.getElementById("submitCloseButton");
const btnModalPrevious = document.getElementById("btn-modal-previous");

// Bouton pour charger la 2ème page modale
function changeModal() {
  galleryDialog.close();
  submitDialog.showModal();
}

addPhotoButton.addEventListener("click", function (e) {
  e.preventDefault();
  changeModal();
});

// Revient à la 1ère modale
function changeModalTwo() {
  submitDialog.close();
  galleryDialog.showModal();
}

btnModalPrevious.addEventListener("click", function (e) {
  e.preventDefault();
  changeModalTwo();
});

// Fonction générale pour fermer la modale
function closeModal(dialog) {
  return dialog.close();
}

// Ferme la fenêtre modale lorsqu'on clique sur le bouton de fermeture
galleryCloseButton.addEventListener("click", function () {
  closeModal(galleryDialog);
});

// Ajoute la même fonctionnalité pour la 2ème modale
submitCloseButton.addEventListener("click", function () {
  closeModal(submitDialog);
});

// Ferme les fenêtres modale lorsqu'on clique en dehors de la fenêtre
body.addEventListener("click", function (event) {
  if (event.target === galleryDialog || event.target === submitDialog) {
    closeModal(event.target);
  }
});
