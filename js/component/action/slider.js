define(function(){
	function slider(element, config = {}){

		// element - Обертка слайдера (Пример content-gallery)
		// elementContainer - контейнер изображений
		// widthContainer - ширина контейнера изображений
		// elementItems - блок с изображением 
		// widthItem - ширина блока с изображением 
		// items - элементы || пути к фотографиям, которые нужно отобразить
		// itemsLenght - количество элементов в контейнере
		// step - шаг для трансформации
		// dstep - количество перемотанных объектов (не сделано)
		// position - позиция элемента, который отображается (если несколько, то позиция первого)
		// transform - значение трансфомации для контейнера
		// arrowLeft - кнопка назад
		// arrowRight - кнопка вперед
		let elementContainer = element.querySelector('.slider-container'), //используется 
			view = element.querySelector('.slider__view'), // используется
			widthContainer = 0, // используется
			elementItems = element.querySelectorAll('.slider-container__item'), // используется
			bufer = element.querySelector('.slider__bufer'),
			widthItem = 0, // используется
			globalItems = config.globalItems || false, //используется
			items = config.items || globalSliderPhotos, // используется
			step = 0,
			dstep = config.dstep || 1, // НЕ используется
			position = config.position || 0, //используется 
			dataId = config.dataId || 0, //используется 
			transform = 0, //используется 
			qt = 0, //используется 
			classItem = config.classItem || 'slider-container__item_modal', //используется 
			classImg = config.classImg || 'slider-container__img_max', //используется 
			arrowLeft = config.leftButton || element.querySelector('.slider-arrowLeft'), //используется 
			arrowRight = config.RightButton || element.querySelector('.slider-arrowRight'); //используется 
 
		
		

		// Инициализация слайдера
		function initialization(){
			if (items.length) {
				update();
				if (items.length > qt) {
					if ( position === 0 ) {
						arrowRight.style.display = 'block';
					}else if ( position >=  items.length - qt  ){
						arrowLeft.style.display = 'block';
					}else{
						arrowLeft.style.display = 'block';
						arrowRight.style.display = 'block';
					}
				}
			}
			setEventListener();
		}

		// Обновление слайдера при удалении фотографий
		function fullupdate(){
			items = globalSliderPhotos;
			qt = getCountVisible();
			step = widthItem / widthContainer * 100;
			position = 0;
			for (let i = 0; i < elementItems.length; i++){
				// Math.abs(elementItems[i].getBoundingClientRect().left - view.getBoundingClientRect().left) < elementItems[i].getBoundingClientRect().width
				if ( elementItems[i].getBoundingClientRect().left - view.getBoundingClientRect().left > -10 ) {
					dataId = elementItems[i].getAttribute('data-id');
					break;
				}
			}

			for (let i = 0; i <= items.length; i++){
				if (items[i].id === Number(dataId)) {
					break;
				}
				position++;
			}

			
			bufer.innerHTML = '';
			transform = elementContainer.style.transform || elementContainer.style.webkitTransform || elementContainer.style.mozTransform || 'translateX(0%)';
			transform = parseFloat(transform.substr(11).slice(0, -2));
		}

		// Обновление слайдера
		function update(){
			//Если были добавлены новые фотографии
			if (globalItems && bufer && bufer.innerHTML === 'add') {
				updateSize();
			}
			//Если были удалены какие-то фотографии
			if (globalItems && bufer && bufer.innerHTML === 'delete') {
				updateSize();
				fullupdate();
				return;
			}
			qt = getCountVisible();
			step = widthItem / widthContainer * 100;
		}

		//Обновляет размеры
		function updateSize(){
			elementContainer = element.querySelector('.slider-container');
			elementItems = element.querySelectorAll('.slider-container__item');
			bufer.innerHTML = '';
		}


		function nextSlide(){
			update();
			if ( items[position +qt] ) {
				if ( !searchElementOnPage(items[position + qt].id) ) {
					let newElement = createElement(items[position + qt]);
					elementItems = element.querySelectorAll('.slider-container__item');
					elementContainer.append(newElement);
				}
				
				transform -= step;
				elementContainer.style.transform = 'translateX(' + transform + '%)';
				arrowLeft.style.display = 'block';
				position++;
				if (position + qt === items.length) {
					arrowRight.style.display = 'none';
				}
			}
			else{
				reload();
			}
		}

		//Предыдущий слайд
		function prevSlide(){
			update();
			if ( items[position - 1] ) {
				if ( !searchElementOnPage(items[position - 1].id) ) {
					let newElement = createElement(items[position - 1]);
					elementItems = element.querySelectorAll('.slider-container__item');
					elementContainer.prepend(newElement);	
				}else{
					transform += step;
					elementContainer.style.transform = 'translateX(' + transform + '%)';
				}
				arrowRight.style.display = 'block';
				
				position--; 
				if (position === 0) {
					arrowLeft.style.display = 'none';
				}
			}
			else{
				reload();
			}
		}

		//Создает фотографию 
		function createElement(data){
			let slideHTML = document.createElement('div');
			slideHTML.className = 'slider-container__item ' + classItem;
			slideHTML.setAttribute('data-id', data.id);
			slideHTML.innerHTML = `<img src="${globalUrlServer+data.path}" alt="фотография" class="slider-container__img ${classImg}">`;
			return slideHTML;
		}

		function searchElementOnPage(idElement){
			let slide = element.querySelector('.slider-container__item[data-id="'+ idElement +'"]');
			if ( slide ) {
				return true;
			}else{
				return false;
			}
		}

		//Перезагружает слайдер, если возникла ошибка
		function reload(){
			let sliderContainer = '';
			for (let i = 0; i < items.length; i++){
				if (i === qt || i >= 4) {
					break;
				}
			    sliderContainer += `
			        <div class="slider-container__item ${classItem}" data-id="${items[i].id}">
			          <img src="${globalUrlServer+ items[i].path}" alt="фотография" class="slider-container__img ${classImg}">
			        </div>`;
			}
			transform = 0;
			position = 0;
			arrowLeft.style.display = 'none';
			arrowRight.style.display = 'none';
			elementContainer.style.transform = 'translateX(' + transform + '%)';
			elementContainer.innerHTML = sliderContainer;
			elementItems = element.querySelectorAll('.slider-container__item');
			initialization();
		}

		/**
			* Добавление обработчиков на кнопку назад и вперед
		*/
		function setEventListener(){
			arrowLeft.addEventListener('click', prevSlide);	
			arrowRight.addEventListener('click', nextSlide);
		}

		/**
		   *Возвращает максимальное количество видимых элементов
		*/
		function getCountVisible(){
			widthContainer = parseFloat(getComputedStyle(elementContainer).width);
			widthItem = parseFloat(getComputedStyle(elementItems[0]).width);
			return Math.round(widthContainer / widthItem);
		}
		
		initialization();
	}	
	return slider;
});
