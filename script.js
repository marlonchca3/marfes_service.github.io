import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAnalytics,
  isSupported,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

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
const adminModalEl = document.getElementById("admin-modal");
const adminLoginFormEl = document.getElementById("admin-login-form");
const adminCancelBtnEl = document.getElementById("admin-cancel-btn");
const adminErrorEl = document.getElementById("admin-error");
const adminLogoutBtnEl = document.getElementById("admin-logout-btn");
const productsAdminEl = document.getElementById("products-admin");
const productsFormEl = document.getElementById("products-form");

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin";
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

function setAdminMode(enabled) {
  if (!productsAdminEl || !adminEntryBtnEl) {
    return;
  }

  productsAdminEl.hidden = !enabled;
  adminEntryBtnEl.textContent = enabled ? "Admin activo" : "Admin";
  adminEntryBtnEl.setAttribute("aria-pressed", String(enabled));

  if (enabled) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
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

loadProductsData();
setAdminMode(sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");

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
  adminEntryBtnEl.addEventListener("click", () => {
    const active = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    if (active) {
      const productosSectionEl = document.getElementById("productos");
      if (productosSectionEl) {
        productosSectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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

    const usernameEl = document.getElementById("admin-username");
    const passwordEl = document.getElementById("admin-password");
    const username = usernameEl ? usernameEl.value.trim() : "";
    const password = passwordEl ? passwordEl.value : "";

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      setAdminMode(true);
      toggleAdminModal(false);

      if (usernameEl) {
        usernameEl.value = "";
      }
      if (passwordEl) {
        passwordEl.value = "";
      }
      return;
    }

    if (adminErrorEl) {
      adminErrorEl.textContent = "Credenciales incorrectas";
    }
  });
}

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
  adminLogoutBtnEl.addEventListener("click", () => {
    setAdminMode(false);
  });
}
