const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";
const PHOTOS_API_URL = "https://jsonplaceholder.typicode.com/photos";
const PHOTOS_LIMIT = 50;

const loginSection = document.getElementById("login-section");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");

const gallerySection = document.getElementById("gallery-section");
const logoutButton = document.getElementById("logout-button");
const photoListView = document.getElementById("photo-list-view");
const galleryLoading = document.getElementById("gallery-loading");
const galleryError = document.getElementById("gallery-error");
const photoList = document.getElementById("photo-list");

const photoDetailView = document.getElementById("photo-detail-view");
const backButton = document.getElementById("back-button");
const detailImage = document.getElementById("detail-image");
const detailTitle = document.getElementById("detail-title");

function showLoginError(message) {
  loginError.textContent = message;
  loginError.hidden = false;
}

function hideLoginError() {
  loginError.textContent = "";
  loginError.hidden = true;
}

function showGalleryError(message) {
  galleryError.textContent = message;
  galleryError.hidden = false;
}

function hideGalleryError() {
  galleryError.textContent = "";
  galleryError.hidden = true;
}

function openPhotoDetail(photo) {
  detailImage.src = photo.url;
  detailImage.alt = photo.title;
  detailTitle.textContent = photo.title;
  photoListView.hidden = true;
  photoDetailView.hidden = false;
}

function closePhotoDetail() {
  photoDetailView.hidden = true;
  photoListView.hidden = false;
  detailImage.removeAttribute("src");
  detailImage.alt = "";
  detailTitle.textContent = "";
}

function renderPhotos(photos) {
  photoList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  photos.slice(0, PHOTOS_LIMIT).forEach((photo) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "photo-item";

    const thumbnail = document.createElement("img");
    thumbnail.className = "photo-thumb";
    thumbnail.src = photo.thumbnailUrl;
    thumbnail.alt = photo.title;
    thumbnail.width = 32;
    thumbnail.height = 32;

    const title = document.createElement("span");
    title.className = "photo-title";
    title.textContent = photo.title;

    button.appendChild(thumbnail);
    button.appendChild(title);
    button.addEventListener("click", () => openPhotoDetail(photo));

    listItem.appendChild(button);
    fragment.appendChild(listItem);
  });

  photoList.appendChild(fragment);
}

async function loadPhotos() {
  hideGalleryError();
  photoList.innerHTML = "";
  galleryLoading.hidden = false;

  try {
    const response = await fetch(PHOTOS_API_URL);
    if (!response.ok) {
      throw new Error("Falha na requisição");
    }

    const photos = await response.json();
    if (gallerySection.hidden) {
      return;
    }

    renderPhotos(photos);
  } catch (error) {
    if (!gallerySection.hidden) {
      showGalleryError("Não foi possível carregar as fotos. Tente novamente.");
    }
  } finally {
    galleryLoading.hidden = true;
  }
}

function showGallery() {
  loginSection.hidden = true;
  gallerySection.hidden = false;
  photoDetailView.hidden = true;
  photoListView.hidden = false;
  loadPhotos();
}

function logout() {
  gallerySection.hidden = true;
  closePhotoDetail();
  photoList.innerHTML = "";
  hideGalleryError();
  galleryLoading.hidden = true;
  loginForm.reset();
  hideLoginError();
  loginSection.hidden = false;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideLoginError();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showLoginError("Preencha os campos de usuário e senha.");
    return;
  }

  loginButton.disabled = true;

  try {
    const response = await fetch(USERS_API_URL);
    if (!response.ok) {
      throw new Error("Falha na requisição");
    }

    const users = await response.json();
    const matchedUser = users.find(
      (user) => user.username === username && user.email === password
    );

    if (!matchedUser) {
      showLoginError("Usuário ou senha incorretos.");
      return;
    }

    showGallery();
  } catch (error) {
    showLoginError("Erro ao consultar os dados de login. Tente novamente.");
  } finally {
    loginButton.disabled = false;
  }
});

backButton.addEventListener("click", closePhotoDetail);
logoutButton.addEventListener("click", logout);
