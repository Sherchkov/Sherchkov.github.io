define(function(){
	function slider(element, config = {}){

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

		let elementContainer = element.querySelector('.slider-container'),
			widthContainer = 0,
			elementItems = element.querySelectorAll('.slider-container__item'),
			widthItem = 0,
			amountElementItems = elementItems.length,
			items = config.items || [],
			itemsLenght = 0,
			step = 0,
			dstep = config.dstep || 1,
			position = config.position || 0,
			transform = 0,
			classItem = config.classItem || 'slider-container__item_modal',
			classImg = config.classImg || 'slider-container__img_max',
			arrowLeft = config.leftButton || element.querySelector('.slider-arrowLeft'),
			arrowRight = config.RightButton || element.querySelector('.slider-arrowRight');

		// если нету переданных изображений, то выходим
		if ( !items.length && !amountElementItems ){
			return false;
		}

		// если элементы не переданы через config , то заносим их в items  
		if ( !items.length ) {
			elementItems.forEach(function(elementItem){
				items.push(elementItem);
			});
		}
		//определяем количество элементов для отображения
		itemsLenght = items.length;

		// Инициализация слайдера
		function initialization(){
			// обновляем параметры
			updateStep();
			// получаем максимальное количество видимых элементов
			let qt = getCountVisible();
			// если максимальное количество видимых элементов больше, чем количество всех элементов, то прерываем инициализацию
			if ( qt >= itemsLenght ) {
				return;
			}
			//если позиция 0, то добавляем кнопку только вперед; если позиция последнего элемента, то добавляем кнопку назад; иначе добавляем кнопку вперед и назад;
			if ( position === 0 ) {
				arrowRight.style.display = 'block';
			}else if ( position >=  itemsLenght - qt  ){
				arrowLeft.style.display = 'block';
			}else{
				arrowLeft.style.display = 'block';
				arrowRight.style.display = 'block';
			}
			// добавление обработчиков
			setEventListener();
		}

		/**
		   * Возвращает true если элемент c data-position есть, иначе false
		   * @param {position} - Позиция отображаемого элемента
		  */
		function searchSlide(position){
			let slide = element.querySelector('.slider-container__item[data-position="'+ position +'"]');
			if ( slide ) {
				return true;
			}else{
				return false;
			}
		}

		/**
		   * Добавление нового блока с изображением в контейнер
		   * @param {direction} - Направление в начало контейнера или в конец
		   * @param {position} - Позиция нового элемента
		  */
		function addSlide(direction,position){

			if (amountElementItems === itemsLenght) {
				return;
			}
			let qt = getCountVisible();
			console.log("qt", qt);

			if (classItem === 'slider-container__item_gallery') {
				qt = 3;
			}else{
				qt -= 1;
			}

			let slideHTML = document.createElement('div');
			slideHTML.className = 'slider-container__item ' + classItem;
			slideHTML.setAttribute('data-position', position + qt);
			slideHTML.innerHTML = `<img src="${items[position + qt]}" alt="фотография" class="slider-container__img ${classImg}">`;

			if (direction === 'prev') {
				elementContainer.prepend(slideHTML);
			}
			if (direction === 'next') {
				elementContainer.append(slideHTML);
				elementContainer.style.transform = 'translateX(' + (transform - step) + '%)';
			}

		}

		/**
		   * Возвращает максимальное количество видимых элементов
		  */
		function getCountVisible(){
			return Math.round(widthContainer / widthItem);
		}

		/**
		   * Добавление обработчиков на кнопку назад и вперед
		  */
		function setEventListener(){
			arrowLeft.addEventListener('click', clickСontroller);	
			arrowRight.addEventListener('click', clickСontroller);
		}
			
		/**
		   * Обновление размеров элементов (при изменении экрана)
		  */
		function updateStep(){
			widthContainer = parseFloat(getComputedStyle(elementContainer).width);
			widthItem = parseFloat(getComputedStyle(elementItems[0]).width);
			step = widthItem / widthContainer * 100;
			if (itemsLenght != amountElementItems) {
				amountElementItems = element.querySelectorAll('.slider-container__item').length;
			}
		}
		
		/**
		   * Определение события prev/next
		  */
		function clickСontroller(event){
			if ( this === arrowLeft ) {
				switchSlide('prev');
			}else if ( this === arrowRight ) {
				switchSlide('next');
			}else{
				return;
			}
		}

		/**
		   * Переключение слайда
		   * @param {direction} - Направление вперед или назад
		  */
		function switchSlide(direction){
			updateStep();
			let qt = getCountVisible();
			if (direction === 'prev') {
				if (position - 1 < 0) {
					return;
				}
				if (position - 1 == 0) {
					arrowLeft.style.display = 'none';
				}

				arrowRight.style.display = 'block';
				position--;
				if (amountElementItems !== itemsLenght && position >= 0 && !searchSlide(position) ) {
					addSlide('prev', position);
					return;
				}

			  	transform += step;
			}

			if (direction === 'next') {
				if (position + qt + 1 > items.length) {
					return;
				}
				if (position + qt + 1 == items.length) {
					arrowRight.style.display = 'none';
				}

				arrowLeft.style.display = 'block';
				position++;

				if (amountElementItems !== itemsLenght && position + qt - 1< items.length ) {
					console.log("items.length", items.length);
					console.log("position", position);
					console.log(position + qt - 1)
					addSlide('next', position)
				}

			  	transform -= step;
			  	
			}

			elementContainer.style.transform = 'translateX(' + transform + '%)';
		}

		initialization();
	}	
	return slider;
});
