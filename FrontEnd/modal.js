import {
    addWorkButton, modalContainer, modalGallery, modalTriggers, modalContentGallery,
    modalContentAddWork, categorySelector, addPhotoFile, previewPhoto, blankPhoto,
    addPhotoLabel, photoSize, returnButton, submitBtn, photoTitle, addWorkForm
} from "./scripts/domLinker.js";
import { getWorks, getCategories, deleteWork, createWork } from "./scripts/api.js";

modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));
addWorkButton.addEventListener('click', displayAddWorkForm);
returnButton.addEventListener('click', displayModalGallery);

// On affiche la modale
function toggleModal() {
    modalContainer.classList.toggle('active');
    modalContentGallery.classList.remove('hidden');
    modalContentAddWork.classList.add('hidden');
    displayModalWorks();
}

// On affiche la mini galerie dans la modale
function displayModalGallery() {
    modalContentGallery.classList.remove('hidden');
    modalContentAddWork.classList.add('hidden');
    returnButton.classList.add('hidden');
    displayModalWorks();
}

function displayAddWorkForm() {
    modalContentGallery.classList.add('hidden');
    modalContentAddWork.classList.remove('hidden');
    returnButton.classList.remove('hidden');
    photoTitle.value = "";
    addPhotoFile.value = "";
    submitBtn.disabled = true;

    // On reset la preview de l'image
    previewPhoto.src = "";
    blankPhoto.classList.remove('hidden');
    previewPhoto.classList.add('hidden');
    addPhotoFile.classList.remove('hidden');
    addPhotoLabel.classList.remove('hidden');
    photoSize.classList.remove('hidden');
    displayCategories();
}

// On active le bouton d'envoi du formulaire si les champs sont remplis
photoTitle.addEventListener("change", () => {
    if (photoTitle.value !== "" && categorySelector.value !== "" && addPhotoFile.value !== "") {
        submitBtn.disabled = false;
    }
});

categorySelector.addEventListener("change", () => {
    if (photoTitle.value !== "" && categorySelector.value !== "" && addPhotoFile.value !== "") {
        submitBtn.disabled = false;
    }
});

// Prise en charge de la preview de l'image & activation du bouton d'envoi du formulaire si les champs sont remplis
addPhotoFile.onchange = evt => {
    const [file] = addPhotoFile.files
    if (file) {
        previewPhoto.src = URL.createObjectURL(file)
        blankPhoto.classList.add('hidden');
        previewPhoto.classList.remove('hidden');
        addPhotoFile.classList.add('hidden');
        addPhotoLabel.classList.add('hidden');
        photoSize.classList.add('hidden');
    }
    if (photoTitle.value !== "" && categorySelector.value !== "" && addPhotoFile.value !== "") {
        submitBtn.disabled = false;
    }
}

// On affiche les catégories dans le select
function displayCategories() {
    categorySelector.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.text = "";
    categorySelector.appendChild(option);

    getCategories()
        .then((data) => {
            data.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categorySelector.appendChild(option);
            });
        });
}

addWorkForm.addEventListener("submit", event => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("title", photoTitle.value);
    formData.append("image", addPhotoFile.files[0]);
    formData.append("category", parseInt(categorySelector.value));
    createWork(formData)
});

// On crée un élément figure pour chaque oeuvre
function createElement(modalWork) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = modalWork.imageUrl;
    img.alt = modalWork.title;
    img.crossOrigin = "anonymous";
    figure.appendChild(img);
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class='fa-solid fa-trash-can'></i>";
    deleteButton.classList.add("delete-button");
    figure.appendChild(deleteButton);
    deleteButton.addEventListener("click", () => {
        const id = modalWork.id;
        deleteWork(id);
    });
    return figure;
}

// On affiche les oeuvres dans la modale
const displayModalWorks = () =>
    getWorks()
        .then((data) => {
            modalGallery.innerHTML = ''
            data.forEach((work) => {
                console.log(work);
                const element = createElement(work);
                modalGallery.appendChild(element);
            });
        });