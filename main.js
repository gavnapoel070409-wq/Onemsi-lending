// Бургер-меню
const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.header__mobile-menu');
const body = document.body;
const mobileMenuLinks = document.querySelectorAll('.header__mobile-menu-item, .header__mobile-cta');

// Открытие/закрытие меню
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Закрытие при клике на ссылку
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Закрытие при клике вне меню (опционально)
document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !burger.contains(e.target)) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 86;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});




// Слайдер галереи
const sliderTrack = document.querySelector('.slider__track');
const slides = document.querySelectorAll('.slider__slide');
const prevButton = document.querySelector('.slider__button--prev');
const nextButton = document.querySelector('.slider__button--next');
const dots = document.querySelectorAll('.slider__dot');

let currentIndex = 0;
const totalSlides = slides.length;

// Функция обновления слайдера
function updateSlider() {
    // Сдвигаем трек
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Обновляем активную точку
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Клик на кнопку "Вперёд"
nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
});

// Клик на кнопку "Назад"
prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
});

// Клик на точки
dots.forEach((dot) => {
    dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.getAttribute('data-index'));
        updateSlider();
    });
});

// Свайп на мобильных устройствах
let touchStartX = 0;
let touchEndX = 0;

sliderTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

sliderTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Свайп влево — следующий слайд
            currentIndex = (currentIndex + 1) % totalSlides;
        } else {
            // Свайп вправо — предыдущий слайд
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        }
        updateSlider();
    }
}

// Клавиатурная навигация (стрелки)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    } else if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
});



// === Табы секции услуг ===
const tabs = document.querySelectorAll('.services__tab');
const categories = document.querySelectorAll('.services__category');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');

        tabs.forEach(t => t.classList.remove('active'));
        categories.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const target = document.querySelector(`.services__category[data-category="${category}"]`);
        if (target) target.classList.add('active');
    });
});

// === Слайдеры секции услуг ===
const servicesSliders = document.querySelectorAll('.services-slider');

servicesSliders.forEach((slider) => {
    const track = slider.querySelector('.services-slider__track');
    const cards = Array.from(slider.querySelectorAll('.services-card'));
    const prevBtn = slider.querySelector('.services-slider__button--prev');
    const nextBtn = slider.querySelector('.services-slider__button--next');

    let pageIndex = 0;
    let pages = [];

    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1200) return 2;
        return 3;
    }

    function buildPages() {
        const perView = getCardsPerView();
        pages = [];
        for (let i = 0; i < cards.length; i += perView) {
            pages.push(cards.slice(i, i + perView));
        }
    }

    function getMaxPage() {
        return pages.length - 1;
    }

    function render() {
        buildPages();
        if (pageIndex > getMaxPage()) pageIndex = getMaxPage();
        if (pageIndex < 0) pageIndex = 0;

        const currentPage = pages[pageIndex] || [];

        // Старые карточки скрываем, новые показываем
        cards.forEach(card => card.classList.remove('visible'));
        currentPage.forEach(card => card.classList.add('visible'));

        // Центрирование последней неполной страницы — только десктоп
        const isDesktop = window.innerWidth > 1200;
        const isLastIncomplete = pageIndex === getMaxPage() && currentPage.length < getCardsPerView();
        track.classList.toggle('centered', isDesktop && isLastIncomplete);

        prevBtn.disabled = pageIndex === 0;
        nextBtn.disabled = pageIndex >= getMaxPage();
    }

    nextBtn.addEventListener('click', () => {
        if (pageIndex < getMaxPage()) {
            pageIndex++;
            render();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (pageIndex > 0) {
            pageIndex--;
            render();
        }
    });

    // Свайпы
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && pageIndex < getMaxPage()) {
                pageIndex++;
                render();
            } else if (diff < 0 && pageIndex > 0) {
                pageIndex--;
                render();
            }
        }
    }, { passive: true });

    // Сброс слайдера при переключении таба
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            const categoryEl = document.querySelector(`.services__category[data-category="${category}"]`);
            if (categoryEl && categoryEl.contains(slider)) {
                pageIndex = 0;
                requestAnimationFrame(() => {
                    render();
                });
            }
        });
    });

    window.addEventListener('resize', () => {
        render();
    });

    render();
});



