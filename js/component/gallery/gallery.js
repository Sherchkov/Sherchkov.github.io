define(['base/component', 'component/action/slider', 'server/json', 'css!component/gallery/gallery'], function (Component, slider, json) {
	'use strict';


	class Gallery extends Component {

	    render() {
	        let sliderContainer = ''
	        this.items = json.gallery.images;
	        for (let i = 0; i < this.items.length; i++){
	        	if (i == 4) {
	        		break;
	        	}
	            sliderContainer += `
	                <div class="slider-container__item slider-container__item_gallery" data-position="${i}">
	                  <img src="${this.items[i]}" alt="фотография" class="slider-container__img slider-container__img_min">
	                </div>`;
	        }
	        return `
	            <div class="content-gallery content_default">
	            	<div class="content-gallery__head">
						<span class="content-gallery__title">Мои фотографии</span>
						<button class="content-gallery__add">добавить</button>
	            	</div>
	                <div class="slider slider-mini">
	                  <div class="slider-arrowLeft sliderLeft" title="Назад">
	                    <svg class="slider-arrowLeft__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153 "/></svg>
	                  </div>
	                  <div class="slider-container slider-container_four">
	                     ${sliderContainer}
	                  </div>
	                  <div class="slider-arrowRight sliderRight" title="Вперед">
	                    <svg class="slider-arrowRight__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="58.65,267.75 175.95,153 58.65,35.7 94.35,0 247.35,153 94.35,306"/></svg>
	                  </div>
	                </div>
	            </div>
	        `;
	    }

	    afterMount(){
	        slider(
	        	document.getElementById(this.id),
	        	{
	        		items : this.items,
	        		classItem : 'slider-container__item_gallery',
	        		classImg : 'slider-container__img_min'
	        	}
	        );
	        this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
	    }

	    chooseAction(event){
	    	if (event.target.classList.contains('content-gallery__title')) {
	    		this.createBigGallery();
	    	}else if (event.target.classList.contains('content-gallery__add')) {
	    		this.addPhoto();
	    	}else if (event.target.classList.contains('slider-container__img')) {
	    		this.createBigSlider(event.target.parentElement);
	    	}
	    }

	    createBigGallery(){
	    	let items = this.items;
	    	require(['modal/ActionModal', 'modal/ModalGallery'], function(ActionModal, ModalGallery){
	    		new ActionModal({
	    		    children : ModalGallery,
	    		    theme: 'white',
	    		    items : items,
	    		});  
	    	})

	    }

	    createBigSlider(element){
	    	let position = 0,
	    		items = this.items;

	    	//узнаем позицию нажатой картинки
	    	while (element.previousSibling) {
	    	    element = element.previousSibling;
	    	    if ( element.nodeType === 1) {
	    	        position++;
	    	    }   
	    	}

	    	require(['modal/ModalSlider'], function(ModalSlider){

	    		if (  typeof(modalslider) !== 'undefined' ) {
	    		    modalslider.unmount();
	    		}

	    		modalslider = factory.create(ModalSlider, {
	    			positionItem : position,
	    			items : items
	    		});
	    		modalslider.mount(document.body);
	    	})
	    }

	    addPhoto(){
	    	require(['modal/ModalAddPhoto'], function(ModalSlider){
	    		if (  typeof(modalAddPhoto) !== 'undefined' ) {
	    		    modalAddPhoto.unmount();
	    		}

	    		modalAddPhoto = factory.create(ModalSlider, {});
	    		modalAddPhoto.mount(document.body);
	    	})
	    }
	}


	return Gallery;
});  

