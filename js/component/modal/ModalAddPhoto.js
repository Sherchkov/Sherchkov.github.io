define(['base/component'], function (Component) {
	'use strict';

	class ModalAddPhoto extends Component {
	    
	    render(options) {
	    	this.options = options;
	        return `
				<div class="modalAddPhoto">
				    <button class="modal__close">
				      <svg class="modal__close_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/><line class="cls-1" x1="7" x2="25" y1="25" y2="7"/></g></svg>
				    </button>
			        <div class="modal-content modal-content_white modal-content_big">
			    	    <div class="drop">
			    	    	<div class="drop-container">
			    				<div class="drop-container__empty">
			    					<img class="drop-container__emptyImg" src="img/icons/svg/photo-camera.svg" alt="Камера">
			    				</div>
			    				<div class="drop-container__list">
			    				</div>
			    			</div>
			    	      	<div class="drop__title">
			    	      		<input class="drop__input drop__input_none" id="fileDrop" type="file" accept=".jpg, .jpeg, .png" ${this.options.component === 'avatar' ? '' : 'multiple'}>
			    	      		<span>Перетащите cюда фотографи${this.options.component === 'avatar' ? 'ю' : 'и'} или нажмите</span>
			    	      		<label class="drop__label" id="fileDropLabel" for="fileDrop" name="file">Сюда</label>
			    	      	</div>
			    	      	<div class="drop__message"></div>
							<div class="drop__send"><button class="drop__sendButton">Опубликовать</button></div>
			    	    </div>
			        </div>
				</div>
	        `;
	    }

	    
	    beforeMount(){
	    	//Если открыто модальное окно modal, то скрываем.
			if ( document.querySelector('.modal') ) {
				document.querySelector('.modal').style.opacity = 0;
			}
		}

	    afterMount() {
	    	if ( !document.querySelector('.modal')  ) {
				let html = document.getElementsByTagName('html')[0],
					WidthBefore = html.clientWidth;

				html.classList.add('html_overflow');
				let WidthAfter = html.clientWidth;
				html.style.marginRight = `${WidthAfter-WidthBefore}px`;	
			}
	    	//Очищаем list файлов
	    	this.imgList = [];
			this.area = document.querySelector('.drop');
			this.fileInput = document.querySelector('.drop__input');
			this.amountFiles = 0;
			this.sendButton = document.querySelector('.drop__sendButton');
			//Добавляет обработчики для перетаскивания элемента
			this.subscribeTo(this.area, 'dragenter', this.defaultListener.bind(this));
			this.subscribeTo(this.area, 'dragleave', this.defaultListener.bind(this));
			this.subscribeTo(this.area, 'dragover', this.defaultListener.bind(this));
			this.subscribeTo(this.area, 'drop', this.dropArea.bind(this));
			this.subscribeTo(this.fileInput, 'change', this.dropArea.bind(this));

			//Обработчик закрытие окна
	        this._closeButton = this.getContainer().querySelector('.modal__close');
	        this.subscribeTo(this._closeButton, 'click', this.onClose.bind(this));
	        this.subscribeTo(this.getContainer(), 'click', this.onClick.bind(this));
	    }

	    beforeUnmount() {
	        delete this._closeButton;
	    }

	    //Добавляет действие для dragover и dragenter
	    defaultListener(event){
	    	event.preventDefault();
	    	event.stopPropagation();
	    	if (event.type === 'dragover' || event.type === 'dragenter') {
	    		this.area.classList.add('drop_border');
	    	}else{
	    		this.area.classList.remove('drop_border');
	    	}
	    }

	    //event - событие при отпускание файлов в заданное поле
	    dropArea(event){
	    	event.preventDefault();
	    	event.stopPropagation();

	    	this.area.classList.remove('drop_border');
	    	let dropMessage = document.querySelector('.modalAddPhoto .drop__message'); 
	    	let fileList;
	    	dropMessage.innerText = '';
	    	//Заносит файлы в переменную fileList
	    	if (event.dataTransfer) {
	    		fileList = event.dataTransfer.files;
	    	}else{
	    		fileList = this.fileInput.files;
	    	}
	    	//Если файлов нет, то return
	    	if (!fileList) {
	    		return;
	    	}
	    	//Если файлов больше 5, то выдает ошибку
	    	if (this.options.component === 'avatar' && (fileList.length > 1 || this.amountFiles >= 1)) {
	    		dropMessage.innerText = 'Нельзя загрузить больше 1 фотографии';
	    		return;
	    	}else if (fileList.length > 5 || (this.amountFiles + fileList.length) > 5) {
	    		dropMessage.innerText = 'Нельзя загрузить больше 5 фотографии одновременно';
	    		return;
	    	}
	    	
	    	//Проходит по каждому файлу и загружаем его на сервер
	   		for (let i = 0; i < fileList.length; i++){
	   			this.amountFiles++;
	        	this.uploadFile(fileList[i]);
	    	}
	    	this.checkingAmountFile(this.amountFiles);
	    }

	    //file - переданный файл
	    //list - объект в DOM, где отображаются загруженные фотографии
	    //classIMG - добавляем рандомный класс для file, чтобы его потом можно было найти
	    uploadFile(file){
	    	let list = document.querySelector('.modalAddPhoto .drop-container__list'),
	    		classIMG = 'photo' + Math.random().toString(32).slice(2),
	    		item = document.createElement('div');

	    	//Предварительно отрисовывает контайнер для будущей фотографии
	    	item.className = 'drop-container__item '+ classIMG;
	    	item.innerHTML = `
		   		<img src="img/icons/gif/load.gif" alt="photo" class="drop-container__img" data-id="0">
		   		<div class="drop-container__itemDelete drop-container__itemDelete_none" title="Удалить">
		   		  <svg class="drop-container__itemDelete_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
		   		</div>
		   		<div class="drop-container__error drop-container__error_none">
		   		  <span class="drop-container__error_sp">Ошибка</span>
		   		</div>
	    	`;
	    	list.append(item);
	    	//Если list был пуст, то удаляет иконку камеры
	    	document.querySelector('.modalAddPhoto .drop-container__empty').classList.add('drop-container__empty_none');
	    	//Получет расширение и размер фотографии на валидность 
	    	let exp = file.name.split('.').pop();
	    	if ( !/^(jpg|jpeg|png)$/i.test( file.name.split('.').pop() ) ) {
	    		document.querySelector(`.${classIMG} .drop-container__error`).classList.remove('drop-container__error_none');
	    		document.querySelector(`.${classIMG} .drop-container__error_sp`).innerText = 'Неверный тип файла';
	    		this.amountFiles--;
	    		this.checkingAmountFile(this.amountFiles);
	    		return;
	    	}
	    	if ( file.size > 5242880 ) {
	    		document.querySelector(`.${classIMG} .drop-container__error`).classList.remove('drop-container__error_none');
	    		document.querySelector(`.${classIMG} .drop-container__error_sp`).innerText = 'Допустимый размер фото 5мб';
	    		this.amountFiles--;
	    		this.checkingAmountFile(this.amountFiles);
	    		return;
	    	}
	    	//Загружаем фотографию на сервер. После загрузки отображаем ее в DOM
	    	fetch(globalUrlServer + this.options.urlDownload, {
	    	  method : 'POST',
	    	  headers: {"Content-Type": "image/png"},
	    	  body: file,
	    	  credentials: 'include'
	    	})
	    	.then(response => {
	    	  if ( response.ok ) {
	    	  	return response.json();
	    	  }else{
	    	  	this.amountFiles--;
	    		this.checkingAmountFile(this.amountFiles);
	    	  	document.querySelector(`.${classIMG} .drop-container__error`).classList.remove('drop-container__error_none');
	    	  	return response.error();
	    	  }
	    	  
	    	})
	    	.then(result => {
	    		if (this.options.component === 'avatar') {
	    			document.querySelector('.content-photo .content-photo__img').setAttribute('src', globalUrlServer + result.computed_data.photo_ref + '?v=' + classIMG);
	    			document.querySelector('.header .header__img').setAttribute('src', globalUrlServer + result.computed_data.photo_ref + '?v=' + classIMG);
	    			this.onClose();
	    			return;
	    		}
	    		this.imgList.push(result);
	    		document.querySelector(`.${classIMG} img`).setAttribute('src', globalUrlServer + result.path) ;
	    		document.querySelector(`.${classIMG} img`).setAttribute('data-id', result.id);
	    		document.querySelector(`.${classIMG} .drop-container__itemDelete`).classList.remove('drop-container__itemDelete_none');
	    		this.sendButton.classList.add('drop__sendButton_active'); 
	    	})
	    	.catch(error => {
	    		document.querySelector(`.${classIMG} .drop-container__error`).classList.remove('drop-container__error_none');
	    		console.log('error', error);
	    	});
	      
	    }

	    checkingAmountFile(amount){
	    	if ( (this.options.component === 'avatar' && amount >= 1) || (this.options.component === 'gallery' && amount >= 5) ) {
	    		this.getContainer().querySelector('.drop__title').style.display = 'none';
	    	}else{
	    		this.getContainer().querySelector('.drop__title').style.display = 'block';
	    	}
	    }
	    //Контроллер кликов по фотографии
	    onClick(){
	    	if ( event.target.closest('.drop-container__itemDelete') ) {
	    	    this.deleteImgElement(event.target.closest('.drop-container__itemDelete'));
	    	}else if ( event.target.classList.contains('modalAddPhoto') ) {
	    	    this.onClose();
	    	}else if (event.target.classList.contains('drop__sendButton')) {
	    		this.sendPhoto();
	    	}
	    }

	    //Если нажата кнопка опубликовать, то заносит фотографии в глобальную переменную globalSliderPhotos и отрисвывает их в большой или малой галерее
	    sendPhoto(){
	    	
	    	this.addPhotoInModal(this.imgList);
	    	for (let i = 0; i < this.imgList.length; i++){
	    		globalSliderPhotos.push(this.imgList[i]);
	    	}

	    	this.getContainer().querySelector('.drop-container__list').innerHTML = '';
	    	this.getContainer().querySelector('.modalAddPhoto .drop-container__empty').classList.remove('drop-container__empty_none');
	    	this.sendButton.classList.remove('drop__sendButton_active');

	    	if ( document.querySelector('.content-gallery .slider-container__empty') ) {
	    		document.querySelector('.content-gallery .slider-container__empty').remove();
	    		document.querySelector('.content-gallery .content-gallery__title').classList.add('content-gallery__title_js');
	    	}

	    	this.elementContainer = document.querySelector('.content-gallery .slider-container');
	    	this.elementItems = this.elementContainer.querySelectorAll('.slider-container__item');

	    	if (this.elementItems.length) {
	    		this.qt = Math.round(parseFloat(getComputedStyle(this.elementContainer).width) / parseFloat(getComputedStyle(this.elementItems[0]).width));
	    		if (this.elementItems.length >= this.qt) {
	    			document.querySelector('.content-gallery .slider-arrowRight').style.display = 'block';
	    			this.imgList = [];
	    			this.onClose();
	    		}
	    	}else{
	    		if ( !document.querySelector('.content-gallery .slider__bufer').innerHTML ) {
	    			document.querySelector('.content-gallery .slider__bufer').innerHTML = 'add';
	    		}
	    	}

	    	for (let i = 0; i < this.imgList.length; i++){
	    		let slideHTML = document.createElement('div');
	    		slideHTML.className = 'slider-container__item slider-container__item_gallery';
	    		slideHTML.setAttribute('data-id', this.imgList[i].id);
	    		slideHTML.innerHTML = `<img src="${globalUrlServer+ this.imgList[i].path}" alt="фотография" class="slider-container__img slider-container__img_min">`;	
	    		this.elementContainer.append(slideHTML);
	    	}

	    	this.elementItems = this.elementContainer.querySelectorAll('.slider-container__item');
	    	this.qt = Math.round(parseFloat(getComputedStyle(this.elementContainer).width) / parseFloat(getComputedStyle(this.elementItems[0]).width));

	    	if ( this.elementContainer.querySelectorAll('.slider-container__item').length > this.qt ) {
	    		document.querySelector('.content-gallery .slider-arrowRight').style.display = 'block';
	    	}	    	

	    	this.imgList = [];
	    	this.onClose();
	    }		

	    //Отрисовывает новые фотографии в большой галерее если требуется
	    addPhotoInModal(items){
	    	let modalGallery = document.querySelector('.modalGallery');
	    	if (modalGallery) {
	    		let idLastImg = modalGallery.querySelector('.galleryBig__imgContainer:last-child').querySelector('.galleryBig__imgDelete').getAttribute('data-id');
	    		if (Number(idLastImg) === globalSliderPhotos[globalSliderPhotos.length - 1].id) {
	    			for(let i = 0; i < items.length; i++){
	    				let imgBlock = document.createElement('div');
	    				imgBlock.className = 'galleryBig__imgContainer';
	    				imgBlock.innerHTML = `
		    				<img class="galleryBig__img" src="${globalUrlServer + items[i].path}" alt="фотография"><div class="galleryBig__imgDelete" title="Удалить" data-id="${items[i].id}">
								<svg class="galleryBig__imgDelete_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
							</div>
						`;
						modalGallery.querySelector('.galleryBig__container').append(imgBlock);
	    			}
	    		}
	    	}
	    }

	    //Удаляет фотографию в DOM
	    deleteImgElement(element){
	    	let image = element.parentElement.querySelector('.drop-container__img');
	    	if ( image.getAttribute('data-id') === 0 ) {
	    		return false;
	    	}
	    	let photo_id = image.getAttribute('data-id');
	    	this.deleteImg(photo_id);
	    	
	    	for (let i = 0; i < this.imgList.length; i++){
	    		if (this.imgList[i].id  === Number(photo_id) ) {
	    			this.imgList.splice(i, 1);
	    			break;
	    		}
	    	}
	    	if (!this.imgList.length) {
	    		this.sendButton.classList.remove('drop__sendButton_active');
	    	}
	    	element.parentElement.remove();
	    	if ( !document.querySelector('.modalAddPhoto .drop-container__list div') ) {
	    		document.querySelector('.modalAddPhoto .drop-container__empty').classList.remove('drop-container__empty_none');
	    	}
	    	this.amountFiles--;
	        this.checkingAmountFile(this.amountFiles);
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


	    //Если мы вышли с окна, то все что загрузили на сервер удаляет
	    onClose(event) {
	    	for (let i = 0; i < this.imgList.length; i++){
	    		this.deleteImg(this.imgList[i].id);
	    	}
	    	this.imgList = [];
	    	if ( document.querySelector('.modal') ) {
	    		document.querySelector('.modal').style.opacity = 1;
	    	}else{
	    		let html = document.getElementsByTagName('html')[0];
	    		html.classList.remove('html_overflow');
	    		html.style.marginRight = '0px';
	    	}
	        this.unmount();
	    }


	}

	return ModalAddPhoto;
});  
