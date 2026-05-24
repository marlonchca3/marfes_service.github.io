import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAnalytics,
  isSupported,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMzzP0U4s22f0V4IxO2av1PrJez3KJwqs",
  authDomain: "marfes-263ee.firebaseapp.com",
  projectId: "marfes-263ee",
  storageBucket: "marfes-263ee.firebasestorage.app",
  messagingSenderId: "151386133175",
  appId: "1:151386133175:web:9de0139a2a11c81629b332",
  measurementId: "G-Y9BGT89XGZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Analytics only runs in supported browser environments.
isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  })
  .catch((error) => {
    console.warn("Firebase Analytics no pudo inicializarse:", error);
  });

const yearEl = document.getElementById("year");
const menuToggleEl = document.querySelector(".menu-toggle");
const mainNavEl = document.getElementById("main-nav");
const adminEntryBtnEl = document.getElementById("admin-entry-btn");
const adminUserPhotoEl = document.getElementById("admin-user-photo");
const adminModalEl = document.getElementById("admin-modal");
const adminLoginFormEl = document.getElementById("admin-login-form");
const adminGoogleBtnEl = document.getElementById("admin-google-btn");
const adminCancelBtnEl = document.getElementById("admin-cancel-btn");
const adminErrorEl = document.getElementById("admin-error");
const adminLogoutBtnEl = document.getElementById("admin-logout-btn");
const productsAdminEl = document.getElementById("products-admin");
const productsFormEl = document.getElementById("products-form");

const ADMIN_SESSION_KEY = "marfes_admin_active";
const PRODUCTS_STORAGE_KEY = "marfes_products_data";

const productElements = [
  {
    title: document.getElementById("product1-title"),
    description: document.getElementById("product1-description"),
    image: document.getElementById("product1-image"),
    fields: {
      title: document.getElementById("p1-title"),
      description: document.getElementById("p1-description"),
      image: document.getElementById("p1-image"),
      imageFile: document.getElementById("p1-image-file"),
    },
  },
  {
    title: document.getElementById("product2-title"),
    description: document.getElementById("product2-description"),
    image: document.getElementById("product2-image"),
    fields: {
      title: document.getElementById("p2-title"),
      description: document.getElementById("p2-description"),
      image: document.getElementById("p2-image"),
      imageFile: document.getElementById("p2-image-file"),
    },
  },
];

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function getProductsFromDom() {
  return productElements.map((product) => ({
    title: product.title ? product.title.textContent.trim() : "",
    description: product.description ? product.description.textContent.trim() : "",
    image: product.image ? product.image.getAttribute("src") : "",
  }));
}

function applyProductsData(productsData) {
  productsData.forEach((item, index) => {
    const product = productElements[index];
    if (!product) {
      return;
    }

    if (product.title) {
      product.title.textContent = item.title;
    }
    if (product.description) {
      product.description.textContent = item.description;
    }
    if (product.image) {
      product.image.setAttribute("src", item.image);
    }

    if (product.fields.title) {
      product.fields.title.value = item.title;
    }
    if (product.fields.description) {
      product.fields.description.value = item.description;
    }
    if (product.fields.image) {
      product.fields.image.value = item.image;
    }
  });
}

function loadProductsData() {
  const fallbackData = getProductsFromDom();
  const rawData = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!rawData) {
    applyProductsData(fallbackData);
    return;
  }

  try {
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed) || parsed.length !== productElements.length) {
      applyProductsData(fallbackData);
      return;
    }
    applyProductsData(parsed);
  } catch (error) {
    console.warn("No se pudo leer productos guardados:", error);
    applyProductsData(fallbackData);
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo de imagen"));
    reader.readAsDataURL(file);
  });
}

function setAdminMode(enabled) {
  if (!productsAdminEl || !adminEntryBtnEl) {
    return;
  }

  productsAdminEl.hidden = !enabled;
  adminEntryBtnEl.textContent = enabled ? "Cerrar sesion" : "Iniciar sesion";
  adminEntryBtnEl.setAttribute("aria-pressed", String(enabled));

  if (enabled) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

function setAdminUserPhoto(user) {
  if (!adminUserPhotoEl) {
    return;
  }

  const photoUrl = user && user.photoURL ? user.photoURL.trim() : "";
  const displayName = user && user.displayName ? user.displayName.trim() : "usuario";

  if (!photoUrl) {
    adminUserPhotoEl.hidden = true;
    adminUserPhotoEl.removeAttribute("src");
    adminUserPhotoEl.setAttribute("alt", "Foto de perfil");
    return;
  }

  adminUserPhotoEl.setAttribute("src", photoUrl);
  adminUserPhotoEl.setAttribute("alt", `Foto de ${displayName}`);
  adminUserPhotoEl.hidden = false;
}

async function logoutAdminSession() {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("No se pudo cerrar sesion de Google:", error);
  }
  setAdminMode(false);
}

function toggleAdminModal(show) {
  if (!adminModalEl) {
    return;
  }

  adminModalEl.hidden = !show;
  if (adminErrorEl) {
    adminErrorEl.textContent = "";
  }
}

if (adminModalEl) {
  adminModalEl.hidden = true;
}

loadProductsData();
setAdminMode(false);
setAdminUserPhoto(null);

onAuthStateChanged(auth, (user) => {
  const isActive = Boolean(user);
  setAdminMode(isActive);
  setAdminUserPhoto(user);
});

if (menuToggleEl && mainNavEl) {
  menuToggleEl.addEventListener("click", () => {
    const isOpen = mainNavEl.classList.toggle("is-open");
    menuToggleEl.setAttribute("aria-expanded", String(isOpen));
    menuToggleEl.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  mainNavEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavEl.classList.remove("is-open");
      menuToggleEl.setAttribute("aria-expanded", "false");
      menuToggleEl.setAttribute("aria-label", "Abrir menú");
    });
  });
}

if (adminEntryBtnEl) {
  adminEntryBtnEl.addEventListener("click", async () => {
    const active = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    if (active) {
      await logoutAdminSession();
      return;
    }
    toggleAdminModal(true);
  });
}

if (adminCancelBtnEl) {
  adminCancelBtnEl.addEventListener("click", () => {
    toggleAdminModal(false);
  });
}

if (adminModalEl) {
  adminModalEl.addEventListener("click", (event) => {
    if (event.target === adminModalEl) {
      toggleAdminModal(false);
    }
  });
}

if (adminLoginFormEl) {
  adminLoginFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

if (adminGoogleBtnEl) {
  adminGoogleBtnEl.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      setAdminMode(true);
      toggleAdminModal(false);
    } catch (error) {
      console.warn("Error al iniciar sesion con Google:", error);
      if (adminErrorEl) {
        adminErrorEl.textContent = "No se pudo iniciar sesion con Google";
      }
    }
  });
}

productElements.forEach((product) => {
  const imageFileInput = product.fields.imageFile;
  if (!imageFileInput) {
    return;
  }

  imageFileInput.addEventListener("change", async () => {
    const selectedFile = imageFileInput.files && imageFileInput.files[0];
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      if (adminErrorEl) {
        adminErrorEl.textContent = "Selecciona un archivo de imagen valido";
      }
      imageFileInput.value = "";
      return;
    }

    try {
      const imageDataUrl = await fileToDataUrl(selectedFile);
      if (product.fields.image) {
        product.fields.image.value = imageDataUrl;
      }
      if (product.image) {
        product.image.setAttribute("src", imageDataUrl);
      }
      if (adminErrorEl) {
        adminErrorEl.textContent = "";
      }
    } catch (error) {
      console.warn("Error al cargar imagen local:", error);
      if (adminErrorEl) {
        adminErrorEl.textContent = "No se pudo cargar la imagen seleccionada";
      }
    }
  });
});

if (productsFormEl) {
  productsFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedProducts = productElements.map((product) => ({
      title: product.fields.title ? product.fields.title.value.trim() : "",
      description: product.fields.description ? product.fields.description.value.trim() : "",
      image: product.fields.image ? product.fields.image.value.trim() : "",
    }));

    applyProductsData(updatedProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
  });
}

if (adminLogoutBtnEl) {
  adminLogoutBtnEl.addEventListener("click", async () => {
    await logoutAdminSession();
  });
}
