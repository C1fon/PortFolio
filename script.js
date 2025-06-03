// Objeto para almacenar las traducciones cargadas desde lang.json
let translations = {};

// Idioma actual seleccionado, por defecto español
let currentLang = 'es';

// Detectar si está corriendo en GitHub Pages o en local
const isGitHubPages = window.location.hostname.includes("github.io");
const basePath = isGitHubPages ? window.location.pathname.replace(/\/$/, "") : "";

// Array con los proyectos que mostrarás en la página
const projects = [
  {
    title: "Memory-Card Game",
    description: "Juego Clasico de Memoria.",
    link: "https://github.com/C1fon/Memory-Game",
    demo: "https://c1fon.github.io/Memory-Game/",
    image: "IMG/Proyecto1.png"
  },
  {
    title: "IP-Calculator",
    description: "Calculadora de Redes.",
    link: "https://github.com/C1fon/Ip-Calculator",
    demo: "https://c1fon.github.io/Ip-Calculator/",
    image: "IMG/Proyecto2.png"
  },
  {
    title: "Google Maps Test",
    description: "Api de Google Maps.",
    link: "https://github.com/C1fon/Google-Maps-Api",
    demo: "https://c1fon.github.io/Google-Maps-Api/",
    image: "IMG/Proyecto3.png"
  },
];

// Ajustar las rutas de imágenes para que funcionen tanto en local como en GitHub Pages
projects.forEach(project => {
  project.image = `${basePath}/${project.image}`;
});

// Referencia al contenedor donde se insertarán las tarjetas de proyectos
const projectListEl = document.getElementById('project-list');

// Función que genera las tarjetas de proyecto y las agrega al DOM
function renderProjects() {
  projectListEl.innerHTML = ''; // Limpiar el contenido previo antes de renderizar

  projects.forEach(({ title, description, link, demo, image }) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    card.innerHTML = `
      <img src="${image}" alt="Imagen del proyecto ${title}" class="project-image" />
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="project-buttons">
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn github">
          <i class="fab fa-github"></i> Código
        </a>
        <a href="${demo}" target="_blank" rel="noopener noreferrer" class="btn demo">
          <i class="fas fa-external-link-alt"></i> Probar
        </a>
      </div>
    `;
    projectListEl.appendChild(card);
  });
}

// Ejecutar la función para mostrar los proyectos al cargar el script
renderProjects();

// Lista de iconos para fondo flotante
const icons = ['fab fa-html5', 'fab fa-css3-alt', 'fab fa-js'];

function createFloatingIcon() {
  const icon = document.createElement('i');
  icon.className = `icon ${icons[Math.floor(Math.random() * icons.length)]}`;
  icon.style.left = `${Math.random() * 100}%`;
  icon.style.fontSize = `${Math.random() * 30 + 20}px`;
  icon.style.animationDuration = `${Math.random() * 20 + 10}s`;
  document.querySelector('.animated-icons-bg').appendChild(icon);
  setTimeout(() => icon.remove(), 30000);
}

setInterval(createFloatingIcon, 500);

// Función para aplicar traducciones
function applyTranslations(lang) {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Dropdown de idioma
const customSelect = document.getElementById('custom-lang-select');
const selected = customSelect.querySelector('.selected');
const options = customSelect.querySelector('.options');

function setLanguage(lang) {
  currentLang = lang;
  applyTranslations(currentLang);
  localStorage.setItem('preferredLang', currentLang);
  const optionToSelect = [...options.children].find(opt => opt.getAttribute('data-lang') === lang);
  if (optionToSelect) {
    const flag = optionToSelect.getAttribute('data-flag');
    const name = optionToSelect.textContent.trim();
    selected.innerHTML = `
      <img src="${flag}" alt="${lang}" />
      <span>${name}</span>
      <i class="fas fa-chevron-down"></i>
    `;
  }
}

selected.addEventListener('click', () => {
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

options.querySelectorAll('li').forEach(option => {
  option.addEventListener('click', () => {
    const lang = option.getAttribute('data-lang');
    options.style.display = 'none';
    setLanguage(lang);
  });
});

document.addEventListener('click', e => {
  if (!customSelect.contains(e.target)) {
    options.style.display = 'none';
  }
});

// Cargar idioma y traducciones al inicio
window.addEventListener('DOMContentLoaded', () => {
  fetch('lang.json')
    .then(res => res.json())
    .then(data => {
      translations = data;
      const savedLang = localStorage.getItem('preferredLang') || 'es';
      setLanguage(savedLang);
    });
});
