// Objeto para almacenar las traducciones cargadas desde lang.json
let translations = {};

// Idioma actual seleccionado, por defecto español
let currentLang = 'es';

// Array de proyectos vacío inicialmente (se llenará con los datos de lang.json)
let projects = [];

// Referencia al contenedor donde se insertarán las tarjetas de proyectos
const projectListEl = document.getElementById('project-list');

// Función que genera las tarjetas de proyecto y las agrega al DOM
function renderProjects() {
  projectListEl.innerHTML = ''; // Limpiar el contenido previo antes de renderizar

  projects.forEach(({ title, description, link, demo, image }) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    // Crear el contenido HTML de la tarjeta con datos del proyecto
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

    // Añadir la tarjeta al contenedor principal
    projectListEl.appendChild(card);
  });
}

// Función que aplica las traducciones a los elementos que tengan el atributo data-translate
function applyTranslations(lang) {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    // Si hay traducción para la clave en el idioma actual, actualizar el texto
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Función que obtiene los proyectos del archivo JSON y los actualiza según el idioma
function getProjects() {
  if (translations[currentLang] && translations[currentLang].projects) {
    projects = translations[currentLang].projects;
    renderProjects(); // Re-renderizar los proyectos con el nuevo idioma
  }
}

// Referencias al dropdown personalizado de idioma
const customSelect = document.getElementById('custom-lang-select');
const selected = customSelect.querySelector('.selected'); // Elemento que muestra la opción seleccionada
const options = customSelect.querySelector('.options');   // Contenedor con las opciones disponibles


// Ejecutar la función para mostrar los proyectos al cargar el script
renderProjects();

// Lista de clases para iconos que flotan en el fondo (HTML5, CSS3, JS)
const icons = ['fab fa-html5', 'fab fa-css3-alt', 'fab fa-js'];

// Función que crea un icono flotante aleatorio y lo añade al fondo animado
function createFloatingIcon() {
  const icon = document.createElement('i');

  // Asignar clase aleatoria de icono junto con clase común 'icon'
  icon.className = `icon ${icons[Math.floor(Math.random() * icons.length)]}`;

  // Posición horizontal aleatoria (0% a 100%)
  icon.style.left = `${Math.random() * 100}%`;

  // Tamaño de fuente aleatorio entre 20px y 50px
  icon.style.fontSize = `${Math.random() * 30 + 20}px`;

  // Duración de animación aleatoria entre 10s y 30s
  icon.style.animationDuration = `${Math.random() * 20 + 10}s`;

  // Añadir el icono al contenedor con clase 'animated-icons-bg'
  document.querySelector('.animated-icons-bg').appendChild(icon);

  // Eliminar el icono después de 30 segundos para no saturar el DOM
  setTimeout(() => icon.remove(), 30000);
}

// Crear un nuevo icono flotante cada 500ms (medio segundo)
setInterval(createFloatingIcon, 500);


// Función para cambiar idioma, aplicar traducciones y actualizar UI
function setLanguage(lang) {
  currentLang = lang; // Actualizar idioma actual
  applyTranslations(currentLang); // Aplicar traducciones al contenido
  getProjects(); // Obtener proyectos traducidos y renderizarlos
  localStorage.setItem('preferredLang', currentLang); // Guardar preferencia en localStorage

  // Cambiar el favicon dinámicamente
  const favicon = document.getElementById('favicon');
  let flagUrl = '';

  // Asignar el favicon dependiendo del idioma
  switch (lang) {
    case 'es':
      flagUrl = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/es.svg';
      break;
    case 'en':
      flagUrl = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/gb.svg';
      break;
    case 'fr':
      flagUrl = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/fr.svg';
      break;
    case 'ar':
      flagUrl = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/sa.svg';
      break;
    default:
      flagUrl = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/es.svg';
  }

  // Actualizar el favicon
  favicon.setAttribute('href', flagUrl);

  // Actualizar visualmente el dropdown con la opción seleccionada (bandera y nombre)
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

// Mostrar u ocultar las opciones del dropdown al hacer click sobre el elemento seleccionado
selected.addEventListener('click', () => {
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

// Agregar eventos a cada opción para cambiar idioma al hacer click
options.querySelectorAll('li').forEach(option => {
  option.addEventListener('click', () => {
    const lang = option.getAttribute('data-lang');
    options.style.display = 'none'; // Ocultar opciones al seleccionar
    setLanguage(lang); // Cambiar idioma y actualizar todo
  });
});

// Cerrar dropdown si se hace click fuera del mismo
document.addEventListener('click', e => {
  if (!customSelect.contains(e.target)) {
    options.style.display = 'none';
  }
});

// Al cargar la página, obtener traducciones, idioma guardado y actualizar UI
window.addEventListener('DOMContentLoaded', () => {
  fetch('lang.json') // Cargar archivo con traducciones
    .then(res => res.json())
    .then(data => {
      translations = data; // Guardar traducciones
      const savedLang = localStorage.getItem('preferredLang') || 'es'; // Leer idioma guardado o usar español
      setLanguage(savedLang); // Aplicar idioma guardado
    });
});
