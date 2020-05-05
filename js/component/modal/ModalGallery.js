define(['base/component'], function (Component) {
	'use strict';

	class ModalGallery extends Component{
		
	    render() {
	    	if ( !globalSliderPhotos.length ) {
	    		return '<div></div>';
	    	}

	    	let htmlContainer = '';	
	    	//Количество загружаемых фотографии в галерею
	    	this.amount = 12;
	    	this.download = true;
	    	if ( this.amount >= globalSliderPhotos.length) {
	    		this.amount = globalSliderPhotos.length;
	    		this.download = false;
	    	}
	    	for (let i = 0; i < this.amount; i++){
	    		htmlContainer += ` 
					<div class="galleryBig__imgContainer">
						<img class="galleryBig__img" src="${globalUrlServer + globalSliderPhotos[i].path}" alt="фотография">
						<div class="galleryBig__imgDelete" title="Удалить" data-id="${globalSliderPhotos[i].id}">
							<svg class="galleryBig__imgDelete_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
						</div>
					</div>
	    		`;
	    	}

	        return ` 
	        	<div class="modal modalGallery">
	        	    <button class="modal__close">
	        	      <svg class="modal__close_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/><line class="cls-1" x1="7" x2="25" y1="25" y2="7"/></g></svg>
	        	    </button>
	        	    <div class="modal-content modal-content_big modal-content_white">
            	    	<div class="galleryBig">
            	            <div class="galleryBig__head">
            	            	<span class="galleryBig__title">Мои фотографии</span>
            	            	<button class="galleryBig__add">Добавить</button>
            	            </div>
            	            <div class="galleryBig__container">
            	  				${htmlContainer}
            	            </div>         	          
      	    	        </div>
	        	    </div>
	        	</div>    
	        `;
	    }

	    afterMount(){
	    	//Скрывает полосу прокрутки и добавляет отступ на ширину прокрутки у html, чтобы сайт не дергался
	    	this.imgList = [];
	    	let html = document.getElementsByTagName('html')[0],
	    		WidthBefore = html.clientWidth;
	    	html.classList.add('html_overflow');
	    	let WidthAfter = html.clientWidth;
	    	html.style.marginRight = `${WidthAfter-WidthBefore}px`;
	    	this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
	    	this.subscribeTo(this.getContainer(), 'scroll', this.downloading.bind(this));
	    }

	    chooseAction(event){
	    	if ( event.target.closest('.galleryBig__imgDelete') ) {
	    		this.deleteImgBefore(event.target.closest('.galleryBig__imgDelete'));
	    	}else if (  event.target.closest('.galleryBig__add') ) {
	    		this.addPhoto();
	    	}else if ( event.target.classList.contains('galleryBig__img') ) {
	    		this.createBigSlider( event.target.parentElement );
	    	}else if ( event.target.classList.contains('galleryBig__restoreButton') ) {
	    		this.restoreImg( event.target.parentElement );
	    	}else if ( event.target.closest('.modal__close') ){
	    		this.onClose();
	    	}else if ( event.target.classList.contains('modal') ) {
	    	    this.onClose();
	    	}
	    }

	    //Создает большой слайдер при клике на фоографию
	    createBigSlider(element){
	    	let position = 0;
	    	//узнает позицию нажатой картинки
	    	while (element.previousSibling) {
	    	    element = element.previousSibling;
	    	    if ( element.nodeType === 1) {
	    	        position++;
	    	    }   
	    	}
	    	require(['modal/ModalSlider'], function(ModalSlider){

	    		if (  typeof(modalslider) !== "undefined" ) {
	    		    modalslider.unmount();
	    		}

	    		modalslider = factory.create(ModalSlider, {
	    			positionItem : position, 
	    		});
	    		modalslider.mount(document.body);
	    	});
	    }
	   	
	   	//Подзагружает фотографии из массива globalSliderPhotos;
	   	downloading(event){
	   		if (this.download === false) {
	   			return;
	   		}
	   		let bottom = this.getContainer().scrollHeight - this.getContainer().offsetHeight - this.getContainer().scrollTop;
	   		if (bottom < 100) {
		    	for (let i = this.amount; i < globalSliderPhotos.length; i++){
		    		if (i === globalSliderPhotos.length - 1) {
		    			this.download = false;
		    		}
		    		let imgContainer = document.createElement('div');
		    		imgContainer.className = 'galleryBig__imgContainer';
		    		imgContainer.innerHTML = ` 
						<img class="galleryBig__img" src="${globalUrlServer + globalSliderPhotos[i].path}" alt="фотография">
						<div class="galleryBig__imgDelete" title="Удалить" data-id="${globalSliderPhotos[i].id}">
							<svg class="galleryBig__imgDelete_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
						</div>
		    		`;
		    		this.getContainer().querySelector('.galleryBig__container').append(imgContainer);
		    	}
		    	this.amount += this.amount;
	   		}
	   	}

	   	//Загружает модальное окно, загрузки фотографии.
	    addPhoto(){
	    	require(['modal/ModalAddPhoto'], function(ModalAddPhoto){
	    		if (  typeof(modalAddPhoto) !== "undefined" ) {
	    		    modalAddPhoto.unmount();
	    		}

	    		modalAddPhoto = factory.create(ModalAddPhoto, {});
	    		modalAddPhoto.mount(document.body);
	    	});
	    }

	    //Востановить изображение
	    restoreImg(element){
	    	element.parentElement.querySelector('.galleryBig__imgDelete').style.display = 'block';
	    	let photo_id = element.getAttribute('data-id');
	    	if ( this.imgList.indexOf(Number(photo_id)) !== -1) {
	    		this.imgList.splice(this.imgList.indexOf(Number(photo_id)), 1);
	    	}
	    	element.remove();
	    }

	    //Заносит id фотографии в массив
	    deleteImgBefore(element){
	    	let dataId = element.getAttribute('data-id');
	    	this.imgList.push(Number(dataId));

	    	let restore = document.createElement('div');
	    	restore.className = 'galleryBig__restore';
	    	restore.setAttribute('data-id', dataId);
	    	restore.innerHTML = '<button class="galleryBig__restoreButton">Восстановить</button>';
	    	element.parentElement.append(restore);
	    	element.style.display = 'none';
	    	
	    }

	    //Удаляет фотографию с сервера
	    deleteImg(photo_id){
	    	let urlencoded = new URLSearchParams();
	        urlencoded.append("photo_id", photo_id);
	    	fetch(globalUrlServer + '/photo/delete', {
	    	  method : 'POST',
	    	  headers: {"Content-Type": "application/x-www-form-urlencoded"},
	    	  body: urlencoded,
	    	  credentials: 'include'
	    	})
	    	.then(response => {
	    	  if ( response.ok ) {
	    	  	return response.text();
	    	  }else{
	    	  	return response.error();
	    	  }
	    	  
	    	} )
	    	.then(result => {
	    	  return;
	    	})
	    	.catch(error => {
	    		console.log('error', error);
	    	});
	    }

	    //Удаляет фотографию с галереи
	    deleteImgOnPage(photo_id){
	    	let view = document.querySelector('.content-gallery .slider__view'),
	     		arrowLeft = document.querySelector('.content-gallery .slider-arrowLeft'),
				arrowRight = document.querySelector('.content-gallery .slider-arrowRight'),
				container = document.querySelector('.content-gallery .slider-container');
			document.querySelector('.content-gallery .slider__bufer').innerHTML = 'delete';
	    	//Удаляет фотографию из глобальной переменной globalSliderPhotos
	     	for (let i = 0; i < globalSliderPhotos.length; i++){
	     		if (globalSliderPhotos[i].id === Number(photo_id)) {
	     			globalSliderPhotos.splice(i, 1);
	     			break;
	     		}
	     	}
	    	//Если фотографии нет в DOM или находится после слайдера
	    	let deleteElement = container.querySelector(`[data-id="${photo_id}"]`);
	    	if (!deleteElement || deleteElement.getBoundingClientRect().left - (view.getBoundingClientRect().left  + view.getBoundingClientRect().width) > -10) {
	    		if (deleteElement) {
	    			deleteElement.remove();
	    		}
	    		let idlastViewElement = container.querySelector('.slider-container__item:last-child').getAttribute('data-id');
	    		if (Number(idlastViewElement) === globalSliderPhotos[globalSliderPhotos.length - 1].id) {
	    			arrowRight.style.display = 'none';
	    		}
	    		return;
	    	}
	    	//Если фотография существует в DOM, но не видно. Находится до слайдера
	    	if ( deleteElement.getBoundingClientRect().left - view.getBoundingClientRect().left < -10) {
	    		//Увеличивает transform 
	    		this.moveslider(view, container, deleteElement, arrowLeft);
	    		deleteElement.remove();
				return;
	    	}
	    	//Фотографию видно в галерее
	    	deleteElement.remove();
	    	//Если нет больше фотографии
	    	let lastViewElement = document.querySelector('.content-gallery .slider-container__item:last-child');
	    	if ( !lastViewElement ) {
	    		container.innerHTML = '<div class="slider-container__empty">фотографии не найдено</div>';
	    		document.querySelector('.content-gallery .content-gallery__title').classList.remove('content-gallery__title_js');
	    		return; 
	    	}
	    	let idLastViewElement = lastViewElement.getAttribute('data-id');
	    	//Определяет создается ли после удаления пустое пространство
	    	if ( Math.abs( (lastViewElement.getBoundingClientRect().left + lastViewElement.getBoundingClientRect().width) - (view.getBoundingClientRect().left  + view.getBoundingClientRect().width) ) < 10) {
	    		if (Number(idLastViewElement) === globalSliderPhotos[globalSliderPhotos.length - 1].id) {
	    			arrowRight.style.display = 'none';
	    		}
	    		return;
	    	}
	    	//Создалось пустое пространство справо
	    	//Пытаемся заполнить пустое пространство, создавая новый элемент справа
	    	if (Number(idLastViewElement) !== globalSliderPhotos[globalSliderPhotos.length - 1].id) {
	    		let dataNewElement = 0;
	    		for (let i = 0; i < globalSliderPhotos.length - 1; i++){
	    			if (globalSliderPhotos[i].id === Number(idLastViewElement) ) {
	    				dataNewElement = globalSliderPhotos[i + 1];
	    				if (i === globalSliderPhotos.length - 2) {
	    					arrowRight.style.display = 'none'
	    				}else{
	    					break;	
	    				}
	    			}
	    		}
	    		let slideHTML = document.createElement('div');
	    		slideHTML.className = 'slider-container__item slider-container__item_gallery';
	    		slideHTML.setAttribute('data-id', dataNewElement.id);
	    		slideHTML.innerHTML = `<img src="${globalUrlServer+dataNewElement.path}" alt="фотография" class="slider-container__img slider-container__img_min">`;
	    		container.append(slideHTML);
	    		return;
	    	}
	    	//Если справа не возможно заполнить пустое пространство, то увеличивает transform
	    	let firstViewElement = document.querySelector('.content-gallery .slider-container__item:first-child');
	    	//Если есть слева фотография, то сдвигаем слайдер
	    	if (firstViewElement.getBoundingClientRect().left - view.getBoundingClientRect().left < -10) {
	    		this.moveslider(view, container, firstViewElement,arrowLeft);
				return;
	    	}
	    }

	    //Увеличивает transform
	   	moveslider(view, container, viewElement, arrowLeft){
    		let transform = container.style.transform || container.style.webkitTransform || container.style.mozTransform || 'translateX(0%)';
    		let step = parseFloat(getComputedStyle(viewElement).width) / parseFloat(getComputedStyle(view).width) * 100;
	     	if (!transform.length) {
	     		return;
	     	}
	     	let valueTransform = parseFloat(transform.substr(11).slice(0, -2));
	     	if ( isNaN(valueTransform) ) { 
	     		valueTransform = 0;
	     	}
	     	valueTransform = valueTransform + step;
	     	container.style.transform = 'translateX(' + valueTransform + '%)';
	     	if (valueTransform === 0) {
	     		arrowLeft.style.display = 'none';
	     	}
	   	}

	   	//Выполняет проверку sliderа на отображение
	    /*checkingSlider(){
	    	let container = document.querySelector('.content-gallery .slider-container');
	    	let items = container.querySelectorAll('.slider-container__item');
	    	let view = document.querySelector('.content-gallery .slider__view');
	    	if (items.length !== 0) {
	    		let qt = parseFloat(getComputedStyle(view).width) / parseFloat(getComputedStyle(items[0]).width);
	    		if (items.length > qt) {
	    			return;
	    		}
	    	}
	    	container.style.transform = 'translateX(0%)';
	    	document.querySelector('.content-gallery .slider-arrowLeft').style.display = 'none';
	    	document.querySelector('.content-gallery .slider-arrowRight').style.display = 'none';
	    	return;
	    }*/

	   	//При закрытии галереи, удаляет фотки с сервера и на странице
	    onClose(event) {
	    	document.querySelector('.content-gallery .slider-container').classList.add('slider-containe_duration');
	    	for (let i = 0; i < this.imgList.length; i++){
	    		this.deleteImg(this.imgList[i]);
	    		this.deleteImgOnPage(this.imgList[i]);
	    	}
	    	/*this.checkingSlider();*/
	    	document.querySelector('.content-gallery .slider-container').classList.remove('slider-containe_duration');
	    	this.imgList = [];
	    	let html = document.getElementsByTagName('html')[0];
	    	html.classList.remove('html_overflow');
	    	html.style.marginRight = '0px';
	        this.unmount();
	    }
	}
	
	return ModalGallery;
});  
