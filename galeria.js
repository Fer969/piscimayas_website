// JavaScript específico para la página de galería

document.addEventListener('DOMContentLoaded', function() {
    
    // Lista de imágenes disponibles en la galería (se cargan automáticamente)
    const availableImages = [
        'lagunas-produccion.jpg',
        'proceso-alimentacion.jpg', 
        'cosecha-tilapia.jpg',
        'instalaciones.jpg',
        'sistema-filtracion.jpg',
        'equipo-tecnico.jpg',
        'alevines-tilapia.jpg',
        'vista-general.jpg'
    ];

    // Títulos simples para las imágenes (sin descripciones largas)
    const imageTitles = {
        'lagunas-produccion.jpg': 'Lagunas de Producción',
        'proceso-alimentacion.jpg': 'Proceso de Alimentación',
        'cosecha-tilapia.jpg': 'Cosecha de Tilapia Roja',
        'instalaciones.jpg': 'Instalaciones',
        'sistema-filtracion.jpg': 'Sistema de Filtración',
        'equipo-tecnico.jpg': 'Equipo Técnico',
        'alevines-tilapia.jpg': 'Alevines de Tilapia',
        'vista-general.jpg': 'Vista General'
    };

    // Variables globales
    let displayedImages = 6; // Mostrar 6 imágenes inicialmente
    let allImages = []; // Se llenará dinámicamente

    // Elementos del DOM
    const galleryContainer = document.getElementById('gallery-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const downloadBtn = document.getElementById('download-btn');

    // Cargar imágenes dinámicamente
    function loadImages() {
        allImages = availableImages.map(filename => {
            const imageObj = {
                src: `images/galeria/${filename}`,
                title: imageTitles[filename] || filename.replace('.jpg', '').replace('-', ' '),
                description: '', // Sin descripciones en la galería completa
                alt: imageTitles[filename] || filename.replace('.jpg', '').replace('-', ' ')
            };
            return imageObj;
        });
    }

    // Inicializar la galería
    function initGallery() {
        loadImages();
        renderGallery();
        setupEventListeners();
    }

    // Renderizar la galería
    function renderGallery() {
        const imagesToShow = allImages.slice(0, displayedImages);
        
        galleryContainer.innerHTML = '';
        
        imagesToShow.forEach((image, index) => {
            const galleryItem = createGalleryItem(image, index);
            galleryContainer.appendChild(galleryItem);
        });

        // Mostrar/ocultar botón de cargar más
        if (allImages.length > displayedImages) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Crear elemento de galería
    function createGalleryItem(image, index) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 col-sm-6';
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.setAttribute('data-index', index);
        
        // Crear elemento de imagen simple (sin descripciones)
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'gallery-placeholder\\'><i class=\\'fas fa-image\\'></i><h6>${image.title}</h6><p>Imagen no disponible</p></div>'">
            <div class="gallery-overlay">
                <h5>${image.title}</h5>
            </div>
        `;
        
        // Agregar evento de click
        galleryItem.addEventListener('click', () => openImageModal(image));
        
        col.appendChild(galleryItem);
        return col;
    }


    // Configurar event listeners
    function setupEventListeners() {
        // Botón de cargar más
        loadMoreBtn.addEventListener('click', function() {
            displayedImages += 6;
            renderGallery();
            
            // Scroll suave hacia las nuevas imágenes
            setTimeout(() => {
                const newImages = galleryContainer.querySelectorAll('.gallery-item:nth-last-child(-n+6)');
                if (newImages.length > 0) {
                    newImages[0].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 100);
        });
        // Botón de descarga
        downloadBtn.addEventListener('click', function() {
            const currentImage = getCurrentModalImage();
            if (currentImage) {
                downloadImage(currentImage.src, currentImage.title);
            }
        });
    }

    // Abrir modal de imagen
    function openImageModal(image) {
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalTitle.textContent = image.title;
        modalDescription.textContent = image.description || ''; // Sin descripción en galería
        
        // Mostrar botón de descarga
        downloadBtn.style.display = 'inline-block';
        
        imageModal.show();
    }

    // Obtener imagen actual del modal
    function getCurrentModalImage() {
        const currentSrc = modalImage.src;
        return allImages.find(img => img.src === currentSrc);
    }

    // Descargar imagen
    function downloadImage(src, filename) {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename.replace(/\s+/g, '_') + '.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Efecto de scroll en el navbar
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Navegación del navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si es un enlace a la página principal con sección específica
            if (href.startsWith('index.html#')) {
                e.preventDefault();
                
                // Redirigir a la página principal con la sección específica
                window.location.href = href;
            }
            // Si es un enlace a sección de la misma página (por si acaso)
            else if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Para otros enlaces (como galeria.html), dejar que funcionen normalmente
        });
    });

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos de galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(el => {
        observer.observe(el);
    });

    // Lazy loading para imágenes
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observar imágenes lazy
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (imageModal._isShown) {
                imageModal.hide();
            }
        }
    });

    // Inicializar la galería
    initGallery();
    
    console.log('Galería de Pisci-Mayas inicializada correctamente!');
});
