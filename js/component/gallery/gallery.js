define(['base/component', 'component/action/slider', 'modal/ActionModal', 'modal/ModalSlider', 'server/json', 'css!component/gallery/gallery.min'], function (Component, slider, ActionModal, ModalSlider, json) {
	'use strict';

	let items = json.gallery.images;

	class Gallery extends Component {

	    render() {
	        let items = json.gallery.images;
	        let sliderContainer = ''
	        for (let i = 0; i < items.length; i++){
	            sliderContainer += `
	                <div class="slider-container__item slider-container__item_four">
	                  <img src="${items[i]}" alt="фотография" class="slider-container__img slider-container__img_min">
	                </div>`;
	        }
	        return `
	            <div class="content-gallery content_default">
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
	        slider(document.getElementById(this.id));
	        this.subscribeTo(this.getContainer(), 'click', this.createBigSlider.bind(this));
	    }

	    createBigSlider(event){
	        if (event.target.classList.contains('slider-container__img')) {
	            let element = event.target.parentElement,
	                position = 0,
	                items = [];

	            /*console.log(element.previousSibling)
	            return;*/
	            // заносим левые элементы в список items
	            while (element.previousSibling) {

	                element = element.previousSibling;
	                if ( element.nodeType === 1) {
	                    items.push( element.querySelector('.slider-container__img').getAttribute('src') );
	                }   
	            }

	            position = items.length;
	            element = event.target.parentElement;
	            items.push( element.querySelector('.slider-container__img').getAttribute('src') );

	            // заносим правые элементы в список items
	            while (element.nextSibling) {
	                element = element.nextSibling;
	                if ( element.nodeType === 1) {
	                    items.push( element.querySelector('.slider-container__img').getAttribute('src') );
	                }   
	            }

	            new ActionModal({
	                children : ModalSlider,
	                position : position,
	                items : items,
	            });

	        }
	    }

	}


	return Gallery;
});  

