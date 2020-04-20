define(['base/component', 'component/action/slider'], function (Component, slider) {
	'use strict';

	class ModalSlider extends Component{
	    render(options) {
	        this.items = options.items;
	        this.position = options.position;
	        return ` 
	            <div class="slider slider-max">
	                <div class="slider-arrowLeft sliderLeft" title="Назад">
	                  <svg class="slider-arrowLeft__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153 "/></svg>
	                </div>
	                <div class="slider-container">
	                  <div class="slider-container__item slider-container__item_one" data-position="${options.position}">
	                    <img src="${options.items[options.position]}" alt="фотография" class="slider-container__img slider-container__img_max">
	                  </div>
	                </div>
	                <div class="slider-arrowRight sliderRight" title="Вперед">
	                  <svg class="slider-arrowRight__icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="306px" height="306px" viewBox="0 0 306 306" style="enable-background:new 0 0 306 306;" xml:space="preserve"><polygon points="58.65,267.75 175.95,153 58.65,35.7 94.35,0 247.35,153 94.35,306"/></svg>
	                </div>
	            </div>
	        `;
	    }

	    afterMount(){
	        slider(
	            document.getElementById(this.id),
	            {
	                position: this.position,
	                items: this.items,
	            }
	        );
	    }
	}

	return ModalSlider;
});  