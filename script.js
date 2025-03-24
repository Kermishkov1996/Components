/*=========================Header=======================*/

const menu = document.querySelector('.menu__body');
const menuBtn = document.querySelector('.menu__icon');
const body = document.body;

if (menu && menuBtn) {
	menuBtn.addEventListener('click', () => {
		menu.classList.toggle('active');
		menuBtn.classList.toggle('active');
		body.classList.toggle('lock');
	})

	menu.addEventListener('click', event => {
		if (event.target.classList.contains('menu__body')) {
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
		}
	})

	menu.querySelectorAll('.menu__link').forEach(link => {
		link.addEventListener('click', () => {
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('lock');
		})
	})
}

/*=========================Плавный переход по ссылкам в меню=======================*/

const anchors = document.querySelectorAll('a[href*="#"]');

anchors.forEach(anchor => {
	anchor.addEventListener('click', event => {
		event.preventDefault();

		const blockID = anchor.getAttribute('href').substring(1);

		document.getElementById(blockID).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	})
})

/*=========================Подсветка активного пункта меню при скролле=======================*/

const observer = new IntersectionObserver((entries) => {
	console.log(entries);
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			document.querySelectorAll(".menu__link").forEach(link => {
				let id = link.getAttribute('href').substring(1);
				if (id === entry.target.id) {
					link.classList.add('menu__link--active');
				} else {
					link.classList.remove('menu__link--active');
				}
			})
		}
	});
}, {
	threshold: 0.5
});

document.querySelectorAll(".section").forEach(section => {
	observer.observe(section);
});

/*=========================Header-Hide=======================*/

let lastScroll = 0;
const defaultOffset = 100;
const header = document.querySelector('header');

const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
const containHide = () => header.classList.contains('hide');

window.addEventListener('scroll', () => {

	if (scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
		//scroll down
		header.classList.add('hide');
	} else if (scrollPosition() < lastScroll && containHide()) {
		//scroll up
		header.classList.remove('hide');
	}

	lastScroll = scrollPosition();
});

/*=========================Popup=======================*/

const modalController = ({modal, btnOpen, btnClose, time = 300}) => {
	const buttonElem = document.querySelector(btnOpen);
	const modalElem = document.querySelector(modal);

	modalElem.style.cssText = `
	 display: flex;
	 visibility: hidden;
	 opacity: 0;
	 transition: opacity ${time}ms ease-in-out;
	`;

	const closeModal = event => {
		const target = event.target;

		if (
			target === modalElem ||
			(btnClose && target.closest(btnClose)) ||
			event.code === 'Escape'
		) {
			modalElem.style.opacity = 0;

			setTimeout(() => {
				modalElem.style.visibility = 'hidden';
			}, time);

			window.removeEventListener('keydown', closeModal);
		}
	}

	const openModal = () => {
		modalElem.style.visibility = 'visible';
		modalElem.style.opacity = 1;
		window.addEventListener('keydown', closeModal);
	}

	buttonElem.addEventListener("click", openModal);
	modalElem.addEventListener("click", closeModal);
};

modalController({
	modal: '.modal',
	btnOpen: '.popup__button',
	btnClose: '.modal__close',
});

/*=========================Drag and Drop=======================*/

const tasksListElement = document.querySelector(".tasks__list");
const taskElements = document.querySelectorAll(".tasks__item");

for (const task of taskElements) {
	task.draggable = true;

	tasksListElement.addEventListener("dragstart", (event) => {
		event.target.classList.add("selected");
	});

	tasksListElement.addEventListener("dragend", (event) => {
		event.target.classList.remove("selected");
	});

	tasksListElement.addEventListener("dragover", (event) => {
		event.preventDefault();

		const activeElement = tasksListElement.querySelector(".selected");
		const currentElement = event.target;
		const isMoveable = activeElement !== currentElement && currentElement.classList.contains("tasks__item");

		if (!isMoveable) {
			return;
		}

		// evt.clientY — вертикальная координата курсора в момент, когда сработало событие
		const nextElement = getNextElement(event.clientY, currentElement);
		// Проверяем, нужно ли менять элементы местами
		if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
			// Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
			return;
		}

		tasksListElement.insertBefore(activeElement, nextElement);
	});

	const getNextElement = (cursorPosition, currentElement) => {
		// Получаем объект с размерами и координатами
		const currentElementCoord = currentElement.getBoundingClientRect();
		// Находим вертикальную координату центра текущего элемента
		const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
		// Если курсор выше центра элемента, возвращаем текущий элемент
		// В ином случае — следующий DOM-элемент
		const nextElement = (cursorPosition < currentElementCenter) ?
			currentElement :
			currentElement.nextElementSibling;

		return nextElement;
	}

}

/*=========================SLIDER-CONTROL=======================*/

let thumb = runner.querySelector('.thumb');

thumb.onmousedown = function (event) {
	event.preventDefault();

	let shiftX = event.clientX - thumb.getBoundingClientRect().left;

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	function onMouseMove(event) {
		let newLeft = event.clientX - shiftX - shiftX - runner.getBoundingClientRect().left;

		if (newLeft < 0) {
			newLeft = 0;
		}
		let rightEdge = runner.offsetWidth - thumb.offsetWidth;
		if (newLeft > rightEdge) {
			newLeft = rightEdge;
		}

		thumb.style.left = newLeft + "px";
	}

	function onMouseUp() {
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('mousemove', onMouseMove);
	}

	thumb.ondragstart = function () {
		return false;
	}
}

/*=========================SLIDER-CONTAINER=======================*/

const slider = document.querySelector(".slider");
const arrowLeft = document.querySelector(".arrow--left");
const arrowRight = document.querySelector(".arrow--right");
const slides = document.querySelectorAll(".slider__image");
const bottom = document.querySelector(".bottom");

let currentSlideIndex = 0;
const paginationCircles = [];
const sliderWidth = slider.clientWidth;

function createPaginationCircles() {
	const div = document.createElement("div");
	div.className = "pagination-circle";
	bottom.appendChild(div);
	paginationCircles.push(div);
}

function addPagination() {
	slides.forEach(createPaginationCircles);
	paginationCircles[0].classList.add("active-circle");
	paginationCircles.forEach((circle, index) => {
		circle.addEventListener("click", () => changeSlide(index));
	})
}

function addActiveClass() {
	paginationCircles[currentSlideIndex].classList.add("active-circle");
}

function removeActiveClass() {
	paginationCircles[currentSlideIndex].classList.remove("active-circle");
}

function showSlide() {
	slider.style.transform = `translateX(-${currentSlideIndex * sliderWidth}px)`;
}

function changeSlide(slideIndex) {
	removeActiveClass();
	currentSlideIndex = slideIndex;
	addActiveClass();
	showSlide();
}

function nextSlide() {
	let newSlideIndex = currentSlideIndex + 1;
	if (newSlideIndex > slides.length - 1) {
		newSlideIndex = 0;
	}
	changeSlide(newSlideIndex);
}

function previousSlide() {
	let newSlideIndex = currentSlideIndex - 1;
	if (newSlideIndex < 0) {
		newSlideIndex = slides.length - 1;
	}
	changeSlide(newSlideIndex);
}

addPagination();
arrowLeft.addEventListener("click", previousSlide);
arrowRight.addEventListener("click", nextSlide);

/*=========================Accordion=======================*/

const accordionElements = Array.from(document.querySelectorAll(".accordion__item"));

accordionElements.forEach((accordion) => {
	accordion.addEventListener("click", boxHandler);
})

function boxHandler(event) {
	event.preventDefault();

	let currentBox = event.target.closest(".accordion__item"); //возвращает текущий блок по которому кликнули
	let currentContent = event.target.nextElementSibling; //возвращает последующий блок с контентом
	currentBox.classList.toggle("active");

	if (currentBox.classList.contains("active")) {
		currentContent.style.maxHeight = `${currentContent.scrollHeight}px`;
	} else {
		currentContent.style.maxHeight = `0px`;
	}
}

/*=========================Scroll-up=======================*/

let scrollUpBtn = document.getElementById("scroll-up");

let scrollUp = () => {
	this.scrollY >= 300
		? scrollUpBtn.classList.add("show-scroll-btn")
		: scrollUpBtn.classList.remove("show-scroll-btn");
}
window.addEventListener("scroll", scrollUp);

scrollUpBtn.addEventListener("click", function () {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth",
	});
});