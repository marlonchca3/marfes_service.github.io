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
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js";

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
const functions = getFunctions(app, "us-central1");
const chatbotResponseFn = httpsCallable(functions, "chatbotResponse");

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
const chatbotLauncherEl = document.getElementById("chatbot-launcher");
const chatbotPanelEl = document.getElementById("chatbot-panel");
const chatbotCloseBtnEl = document.getElementById("chatbot-close-btn");
const chatbotMessagesEl = document.getElementById("chatbot-messages");
const chatbotFormEl = document.getElementById("chatbot-form");
const chatbotInputEl = document.getElementById("chatbot-input");
const chatbotChipEls = document.querySelectorAll(".chatbot-chip");
const newsGridEl = document.getElementById("news-grid");

const ADMIN_SESSION_KEY = "marfes_admin_active";
const PRODUCTS_STORAGE_KEY = "marfes_products_data";
const PRODUCT_PLACEHOLDER_IMAGE = "assets/logo-marfes.svg";
const OPTIONAL_PRODUCTS_START_INDEX = 2;
const OPTIONAL_PRODUCT_DEFAULT_TITLE = "Nuevo producto";
const OPTIONAL_PRODUCT_DEFAULT_DESCRIPTION = "Completa los datos desde el panel admin.";
const GUARDIAN_API_KEY = "a7916396-ad7f-40aa-868c-cb806888469e";
const GUARDIAN_API_URL = "https://content.guardianapis.com/search";
const GUARDIAN_QUERY =
  'healthcare OR "medical technology" OR "medical devices" OR "medical equipment"';
const ALLOWED_NEWS_TOPICS = [
  "healthcare",
  "medical technology",
  "medical technologies",
  "medical device",
  "medical devices",
  "medical equipment",
  "clinical equipment",
  "hospital equipment",
];
const NEWS_LIMIT = 6;
const NEWS_SUMMARY_MAX = 180;
const NEWS_LOOKBACK_DAYS = 7;

const CHATBOT_GREETING =
  "Hola, soy el asistente de Marfes Service. Puedo ayudarte con servicios, productos, horario y contacto.";

let isAdminMode = false;

const productElements = [
  {
    card: document.getElementById("product1-card"),
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
    card: document.getElementById("product2-card"),
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
  {
    card: document.getElementById("product3-card"),
    title: document.getElementById("product3-title"),
    description: document.getElementById("product3-description"),
    image: document.getElementById("product3-image"),
    fields: {
      title: document.getElementById("p3-title"),
      description: document.getElementById("p3-description"),
      image: document.getElementById("p3-image"),
      imageFile: document.getElementById("p3-image-file"),
    },
  },
  {
    card: document.getElementById("product4-card"),
    title: document.getElementById("product4-title"),
    description: document.getElementById("product4-description"),
    image: document.getElementById("product4-image"),
    fields: {
      title: document.getElementById("p4-title"),
      description: document.getElementById("p4-description"),
      image: document.getElementById("p4-image"),
      imageFile: document.getElementById("p4-image-file"),
    },
  },
  {
    card: document.getElementById("product5-card"),
    title: document.getElementById("product5-title"),
    description: document.getElementById("product5-description"),
    image: document.getElementById("product5-image"),
    fields: {
      title: document.getElementById("p5-title"),
      description: document.getElementById("p5-description"),
      image: document.getElementById("p5-image"),
      imageFile: document.getElementById("p5-image-file"),
    },
  },
];

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function appendChatbotMessage(text, sender) {
  if (!chatbotMessagesEl) {
    return;
  }

  const messageEl = document.createElement("div");
  messageEl.className = `chatbot-message ${sender}`;
  messageEl.innerHTML = text;
  chatbotMessagesEl.appendChild(messageEl);
  chatbotMessagesEl.scrollTop = chatbotMessagesEl.scrollHeight;
}

function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function parseHtmlToText(htmlValue) {
  if (!htmlValue) {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlValue, "text/html");
  return (doc.body.textContent || "").trim();
}

function isAllowedTopicArticle(article) {
  const title = (article && article.webTitle ? article.webTitle : "").toLowerCase();
  const summary = parseHtmlToText(
    article && article.fields && article.fields.trailText ? article.fields.trailText : "",
  ).toLowerCase();
  const fullText = `${title} ${summary}`;

  return ALLOWED_NEWS_TOPICS.some((keyword) => fullText.includes(keyword));
}

async function translateToSpanish(text) {
  const cleanText = (text || "").trim();
  if (!cleanText) {
    return "";
  }

  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: "en",
      tl: "es",
      dt: "t",
      q: cleanText,
    });

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error(`Translate API respondio con estado ${response.status}`);
    }

    const payload = await response.json();
    const chunks = Array.isArray(payload) && Array.isArray(payload[0]) ? payload[0] : [];
    const translated = chunks
      .map((chunk) => (Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : ""))
      .join("")
      .trim();

    return translated || cleanText;
  } catch (error) {
    console.warn("No se pudo traducir texto al espanol:", error);
    return cleanText;
  }
}

function renderNewsStatus(message) {
  if (!newsGridEl) {
    return;
  }

  newsGridEl.innerHTML = "";

  const card = document.createElement("article");
  card.className = "news-card reveal";

  const text = document.createElement("p");
  text.className = "news-status";
  text.textContent = message;

  card.appendChild(text);
  newsGridEl.appendChild(card);
}

function createNewsCard(article, index, translatedTitle, translatedSummary) {
  const card = document.createElement("article");
  const delayClass = index % 3 === 0 ? "delay-1" : index % 3 === 1 ? "delay-2" : "delay-3";
  card.className = `news-card reveal ${delayClass}`;

  const source = document.createElement("p");
  source.className = "news-source";
  const publishedAt = article.webPublicationDate
    ? new Date(article.webPublicationDate).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Reciente";
  source.textContent = `${article.sectionName || "The Guardian"} · ${publishedAt}`;

  const thumbnailUrl = article.fields && article.fields.thumbnail ? article.fields.thumbnail : "";
  if (thumbnailUrl) {
    const thumbnail = document.createElement("img");
    thumbnail.className = "news-thumb";
    thumbnail.src = thumbnailUrl;
    thumbnail.alt = article.webTitle || "Noticia medica";
    thumbnail.loading = "lazy";
    card.appendChild(thumbnail);
  }

  const title = document.createElement("h3");
  title.textContent = translatedTitle || article.webTitle || "Noticia del sector medico";

  const summary = document.createElement("p");
  const trailText = parseHtmlToText(article.fields && article.fields.trailText ? article.fields.trailText : "");
  summary.textContent =
    truncateText(translatedSummary || trailText, NEWS_SUMMARY_MAX) ||
    "Consulta la publicacion completa para mas detalles sobre innovacion medica.";

  const link = document.createElement("a");
  link.className = "news-link";
  link.href = article.webUrl || "https://www.theguardian.com";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Leer noticia";

  card.appendChild(source);
  card.appendChild(title);
  card.appendChild(summary);
  card.appendChild(link);

  return card;
}

async function loadGuardianNews() {
  if (!newsGridEl) {
    return;
  }

  renderNewsStatus("Cargando noticias recientes de The Guardian (ultimos 7 dias)...");

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - NEWS_LOOKBACK_DAYS);

    const params = new URLSearchParams({
      "api-key": GUARDIAN_API_KEY,
      q: GUARDIAN_QUERY,
      "order-by": "newest",
      "page-size": String(NEWS_LIMIT),
      "show-fields": "trailText,thumbnail",
      "from-date": fromDate.toISOString().slice(0, 10),
      lang: "en",
    });

    const response = await fetch(`${GUARDIAN_API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Guardian API respondio con estado ${response.status}`);
    }

    const data = await response.json();
    const articles =
      data && data.response && Array.isArray(data.response.results)
        ? data.response.results
        : [];
    const filteredArticles = articles.filter(isAllowedTopicArticle).slice(0, NEWS_LIMIT);

    if (!filteredArticles.length) {
      renderNewsStatus("No se encontraron noticias recientes para equipos medicos, healthcare, medical technology o medical devices.");
      return;
    }

    newsGridEl.innerHTML = "";
    const translatedArticles = await Promise.all(
      filteredArticles.map(async (article) => {
        const originalTitle = article.webTitle || "";
        const originalSummary = parseHtmlToText(
          article.fields && article.fields.trailText ? article.fields.trailText : "",
        );

        const [translatedTitle, translatedSummary] = await Promise.all([
          translateToSpanish(originalTitle),
          translateToSpanish(originalSummary),
        ]);

        return {
          article,
          translatedTitle,
          translatedSummary,
        };
      }),
    );

    translatedArticles.forEach(({ article, translatedTitle, translatedSummary }, index) => {
      newsGridEl.appendChild(createNewsCard(article, index, translatedTitle, translatedSummary));
    });
  } catch (error) {
    console.warn("No se pudo cargar noticias de The Guardian:", error);
    renderNewsStatus("No se pudieron cargar noticias en este momento. Intenta nuevamente en unos minutos.");
  }
}

function openChatbot() {
  if (!chatbotPanelEl || !chatbotLauncherEl) {
    return;
  }

  chatbotPanelEl.hidden = false;
  chatbotLauncherEl.setAttribute("aria-expanded", "true");

  if (chatbotMessagesEl && chatbotMessagesEl.childElementCount === 0) {
    appendChatbotMessage(CHATBOT_GREETING, "bot");
  }

  if (chatbotInputEl) {
    chatbotInputEl.focus();
  }
}

function closeChatbot() {
  if (!chatbotPanelEl || !chatbotLauncherEl) {
    return;
  }

  chatbotPanelEl.hidden = true;
  chatbotLauncherEl.setAttribute("aria-expanded", "false");
}

function getChatbotReplyLocal(userText) {
  const text = userText.toLowerCase();

  if (text.includes("servicio") || text.includes("mantenimiento")) {
    return "Ofrecemos mantenimiento preventivo, reparación y venta de equipos médicos para clínicas y centros de salud.";
  }

  if (text.includes("producto") || text.includes("equipo")) {
    return "Tenemos equipos médicos disponibles y también podemos cotizar soluciones según la necesidad de tu institución.";
  }

  if (text.includes("whatsapp") || text.includes("contacto") || text.includes("llamar")) {
    return 'Puedes escribirnos por WhatsApp <a href="https://wa.me/51960129839" target="_blank" rel="noopener noreferrer">aquí</a> o llamarnos al <a href="tel:+51960129839">+51 960 129 839</a>.';
  }

  if (text.includes("horario") || text.includes("atención") || text.includes("atencion")) {
    return "Podemos coordinar atención según tu necesidad. Escríbenos y te respondemos lo antes posible.";
  }

  if (text.includes("garant") || text.includes("soporte")) {
    return "Brindamos soporte técnico especializado y seguimiento para cada equipo según el servicio solicitado.";
  }

  return "Puedo ayudarte con servicios, productos, garantía y contacto. Si quieres, escribe 'servicios' o 'WhatsApp'.";
}

async function getChatbotReply(userText) {
  try {
    // Call the Cloud Function with the user message
    const result = await chatbotResponseFn({ message: userText });

    if (result.data && result.data.success) {
      return result.data.message;
    } else if (result.data && result.data.message) {
      // Return error message from function
      return result.data.message;
    }
  } catch (error) {
    console.warn("Error llamando Cloud Function:", error);
    // Fall back to local keyword matching if Cloud Function fails
  }

  // Fallback to local keyword matching
  return getChatbotReplyLocal(userText);
}

async function sendChatbotMessage(messageText) {
  const text = messageText.trim();
  if (!text) {
    return;
  }

  appendChatbotMessage(text, "user");

  // Show loading indicator
  const loadingMessageEl = document.createElement("div");
  loadingMessageEl.className = "chatbot-message bot";
  loadingMessageEl.innerHTML = "Escribiendo... 💭";
  loadingMessageEl.id = "chatbot-loading-msg";
  if (chatbotMessagesEl) {
    chatbotMessagesEl.appendChild(loadingMessageEl);
    chatbotMessagesEl.scrollTop = chatbotMessagesEl.scrollHeight;
  }

  // Get AI response
  const reply = await getChatbotReply(text);

  // Remove loading indicator
  if (loadingMessageEl && loadingMessageEl.parentNode) {
    loadingMessageEl.remove();
  }

  appendChatbotMessage(reply, "bot");
}

if (chatbotLauncherEl && chatbotPanelEl && chatbotMessagesEl) {
  chatbotLauncherEl.addEventListener("click", () => {
    const shouldOpen = chatbotPanelEl.hidden;
    if (shouldOpen) {
      openChatbot();
    } else {
      closeChatbot();
    }
  });

  if (chatbotCloseBtnEl) {
    chatbotCloseBtnEl.addEventListener("click", closeChatbot);
  }

  chatbotChipEls.forEach((chip) => {
    chip.addEventListener("click", () => {
      const topic = chip.getAttribute("data-chat-topic") || "";
      const quickReplies = {
        servicios: "¿Qué servicios ofrecen?",
        productos: "¿Qué productos tienen disponibles?",
        whatsapp: "Quiero contacto por WhatsApp",
        horario: "¿Cuál es su horario de atención?",
      };

      openChatbot();
      sendChatbotMessage(quickReplies[topic] || chip.textContent || "");
    });
  });

  if (chatbotFormEl && chatbotInputEl) {
    chatbotFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = chatbotInputEl.value;
      chatbotInputEl.value = "";
      chatbotInputEl.disabled = true;
      await sendChatbotMessage(message);
      chatbotInputEl.disabled = false;
      chatbotInputEl.focus();
    });
  }

  appendChatbotMessage(CHATBOT_GREETING, "bot");
}

function getProductsFromDom() {
  return productElements.map((product, index) => {
    const title = product.title ? product.title.textContent.trim() : "";
    const description = product.description ? product.description.textContent.trim() : "";
    const image = product.image ? product.image.getAttribute("src") : PRODUCT_PLACEHOLDER_IMAGE;

    // Optional products start hidden in markup and should remain empty until admin configures them.
    if (
      index >= OPTIONAL_PRODUCTS_START_INDEX &&
      product.card &&
      product.card.hasAttribute("hidden")
    ) {
      return {
        title: "",
        description: "",
        image: "",
      };
    }

    return {
      title,
      description,
      image,
    };
  });
}

function hasVisibleProductData(item, index) {
  if (index < OPTIONAL_PRODUCTS_START_INDEX) {
    return true;
  }

  const title = (item.title || "").trim();
  const description = (item.description || "").trim();
  const image = (item.image || "").trim();

  return Boolean(
    title &&
      description &&
      image &&
      title !== OPTIONAL_PRODUCT_DEFAULT_TITLE &&
      description !== OPTIONAL_PRODUCT_DEFAULT_DESCRIPTION &&
      image !== PRODUCT_PLACEHOLDER_IMAGE,
  );
}

function mergeProductsData(baseProducts, incomingProducts) {
  return baseProducts.map((base, index) => {
    const incoming = incomingProducts[index] || {};
    return {
      title: typeof incoming.title === "string" ? incoming.title.trim() : base.title,
      description:
        typeof incoming.description === "string"
          ? incoming.description.trim()
          : base.description,
      image: typeof incoming.image === "string" ? incoming.image.trim() : base.image,
    };
  });
}

function updateProductCardVisibility(product, item) {
  if (!product.card) {
    return;
  }

  const productIndex = productElements.indexOf(product);
  product.card.hidden = !(isAdminMode || hasVisibleProductData(item, productIndex));
}

function applyProductsData(productsData) {
  productsData.forEach((item, index) => {
    const product = productElements[index];
    if (!product) {
      return;
    }

    const normalizedItem = {
      title: item.title || "",
      description: item.description || "",
      image: item.image || PRODUCT_PLACEHOLDER_IMAGE,
    };

    if (product.title) {
      product.title.textContent = normalizedItem.title;
    }
    if (product.description) {
      product.description.textContent = normalizedItem.description;
    }
    if (product.image) {
      product.image.setAttribute("src", normalizedItem.image);
    }

    if (product.fields.title) {
      product.fields.title.value = normalizedItem.title;
    }
    if (product.fields.description) {
      product.fields.description.value = normalizedItem.description;
    }
    if (product.fields.image) {
      product.fields.image.value = item.image || "";
    }

    updateProductCardVisibility(product, normalizedItem);
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
    if (!Array.isArray(parsed)) {
      applyProductsData(fallbackData);
      return;
    }

    const mergedProducts = mergeProductsData(fallbackData, parsed);
    applyProductsData(mergedProducts);
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

  isAdminMode = enabled;
  productsAdminEl.hidden = !enabled;
  adminEntryBtnEl.textContent = enabled ? "Cerrar sesion" : "Iniciar sesion";
  adminEntryBtnEl.setAttribute("aria-pressed", String(enabled));

  const currentProducts = productElements.map((product) => ({
    title: product.fields.title ? product.fields.title.value.trim() : "",
    description: product.fields.description ? product.fields.description.value.trim() : "",
    image: product.fields.image ? product.fields.image.value.trim() : "",
  }));
  applyProductsData(currentProducts);

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
loadGuardianNews();
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
