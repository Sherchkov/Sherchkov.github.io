define(['base/component', 'component/action/slider', 'server/json', 'css!component/gallery/gallery'], function (Component, slider, json) {
	'use strict';

	class Gallery extends Component {

	    render() {
	        return `
	            <div class="content-gallery content_default">
	            	<div class="content-gallery__head">
						<span class="content-gallery__title">Мои фотографии</span>
						<button class="content-gallery__add">Добавить</button>
	            	</div>
	                <div class="slider slider-mini">
	                  <div class="slider-arrowLeft sliderLeft" title="Назад">
	                    <svg class="slider-arrowLeft__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153 "/></svg>
	                  </div>
	                  <div class="slider__view">
		                  <div class="slider-container">
		                     <div class="slider-container__loading"></div>
		                  </div>
	                  </div>
	                  <div class="slider-arrowRight sliderRight" title="Вперед">
	                    <svg class="slider-arrowRight__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="58.65,267.75 175.95,153 58.65,35.7 94.35,0 247.35,153 94.35,306"/></svg>
	                  </div>
	                  <div class="slider__bufer"></div>               
	                </div>
	                
	            </div>
	        `;
	    }

	    afterMount(){
	    	this.getImage();
	        this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this)); 
	    }

	    getImage(){
			fetch(globalUrlServer + '/photo/list/' + user_id, {
				method : 'GET',
            	credentials: 'include'
            })
            .then(response => { 
            	if (response.ok) {
            		return response.json();	
            	}
            	else{
            		return response.error();	
            	}
            })
  			.then(result => {
  			  	for (let i = 0; i < result.photos.length; i++){
  			  		globalSliderPhotos.push(result.photos[i]);
  			  	}
  			  	this.createMinSlider();
  			})
  			.catch(error => {
  			  	console.log('error', error);
  			});
	    }

	    chooseAction(event){
	    	if (event.target.classList.contains('content-gallery__title_js')) {
	    		this.createBigGallery();
	    	}else if (event.target.classList.contains('content-gallery__add')) {
	    		this.addPhoto();
	    	}
	    	if (event.target.classList.contains('slider-container__img')) {
	    		this.createBigSlider(event.target.parentElement);
	    	}
	    }


	    createMinSlider(){
	    	if (!globalSliderPhotos.length) {
	    		this.getContainer().querySelector('.content-gallery .slider-container').innerHTML = '<div class="slider-container__empty">Нет фотографий</div>';
	    	}else{
	    		let sliderContainer = '';
	    		for (let i = 0; i < globalSliderPhotos.length; i++){
	    			if (i == 4) {
	    				break;
	    			}
	    		    sliderContainer += `
	    		        <div class="slider-container__item slider-container__item_gallery" data-id="${globalSliderPhotos[i].id}">
	    		          <img src="${globalUrlServer+ globalSliderPhotos[i].path}" alt="фотография" class="slider-container__img slider-container__img_min">
	    		        </div>`;
	    		}
	    		document.querySelector('.content-gallery .slider-container').innerHTML = sliderContainer;
	    		document.querySelector('.content-gallery .content-gallery__title').classList.add('content-gallery__title_js');
	    	}
	    	slider(
	    		document.getElementById(this.id),
	    		{	
	 	   			globalItems : true, 
	    			classItem : 'slider-container__item_gallery',
	    			classImg : 'slider-container__img_min',
	    		}
	    	);
	    }

	    createBigGallery(){
	    	require(['modal/ModalGallery'], function(ModalGallery){ 
	    		if (  typeof(modalGallery) !== 'undefined' ) {
	    		    modalGallery.unmount();
	    		}
	    		modalGallery = factory.create(ModalGallery, {});
	    		modalGallery.mount(document.body);
	    	});
	    }

	    createBigSlider(element){
	    	require(['modal/ModalSlider'], function(ModalSlider){

	    		let position = 0;

	    		//узнает позицию нажатой картинки
	    		while (element.previousSibling) {
	    		    element = element.previousSibling;
	    		    if ( element.nodeType === 1) {
	    		        position++;
	    		    }   
	    		}

	    		if (  typeof(modalslider) !== 'undefined' ) {
	    		    modalslider.unmount();
	    		}
	    		modalslider = factory.create(ModalSlider, {
	    			positionItem : position,
	    		});
	    		modalslider.mount(document.body);
	    	});
	    }

	    addPhoto(){
	    	require(['modal/ModalAddPhoto'], function(ModalAddPhoto){
	    		if (  typeof(modalAddPhoto) !== 'undefined' ) {
	    		    modalAddPhoto.unmount();
	    		}
	    		modalAddPhoto = factory.create(ModalAddPhoto, {
	    			component : 'gallery', 
	    			urlDownload : '/photo/upload', 
	    			urlDelete : '/photo/delete'
	    		});
	    		modalAddPhoto.mount(document.body);
	    	});
	    }
	}


	return Gallery;
});  
