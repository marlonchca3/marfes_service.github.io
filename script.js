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

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

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
