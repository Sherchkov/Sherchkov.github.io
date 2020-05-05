define(['base/component', 'component/action/slider'], function (Component, slider) {
	'use strict';

	class ModalSlider extends Component {
	    
	    render(options) {
	    	/*console.log("options", options);*/

	    	this.items = options.items || globalSliderPhotos;
	    	this.positionItem = options.positionItem || 0;

	        return `
	            <div class="modalSlidder">
	                <button class="modal__close">
	                  <svg class="modal__close_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/><line class="cls-1" x1="7" x2="25" y1="25" y2="7"/></g></svg>
	                </button>
	                <div class="modal-content modal-content_dark">
	                    <div class="slider slider-max">
	                        <div class="slider-arrowLeft sliderLeft" title="Назад">
	                          <svg class="slider-arrowLeft__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153 "/></svg>
	                        </div>
	                        <div class="slider-container">
	                          <div class="slider-container__item slider-container__item_modal" data-id="${this.items[this.positionItem].id}">
	                            <img src="${globalUrlServer + this.items[this.positionItem].path}" alt="фотография" class="slider-container__img slider-container__img_max">
	                          </div>
	                        </div>
	                        <div class="slider-arrowRight sliderRight" title="Вперед">
	                          <svg class="slider-arrowRight__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="58.65,267.75 175.95,153 58.65,35.7 94.35,0 247.35,153 94.35,306"/></svg>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        `;
	    }

	    beforeMount(){
			if ( document.querySelector('.modal') ) {
				document.querySelector('.modal').style.opacity = 0;
			}
		}

	    afterMount() {
	    	if ( !document.querySelector('.modal') ) {
				let html = document.getElementsByTagName('html')[0],
					WidthBefore = html.clientWidth;

				html.classList.add('html_overflow');
				let WidthAfter = html.clientWidth;
				html.style.marginRight = `${WidthAfter-WidthBefore}px`;	
			}
    	   	slider(
    	   		document.getElementById(this.id),
    	   		{	
    	   			position : this.positionItem,
    	   			items : this.items,
    	   		}
    	   	);

	        this._closeButton = this.getContainer().querySelector('.modal__close');
	        this.subscribeTo(this._closeButton, 'click', this.onClose.bind(this));
	        this.subscribeTo(this.getContainer(), 'click', this.onCloseModal.bind(this));
	    }

	    beforeUnmount() {
	        delete this._closeButton;
	    }

	    onCloseModal(){
	    	if ( event.target.classList.contains('modalSlidder') ) {
	    	    this.onClose();
	    	}
	    }

	    onClose(event) {

	    	if ( document.querySelector('.modal') ) {
	    		document.querySelector('.modal').style.opacity = 1;
	    	}else{
	    		let html = document.getElementsByTagName('html')[0]
	    		html.classList.remove('html_overflow');
	    		html.style.marginRight = '0px';
	    	}
	        this.unmount();
	    }


	}

	return ModalSlider;
});  
