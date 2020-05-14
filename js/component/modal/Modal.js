define(['base/component'], function (Component) {
	'use strict';

	class Modal extends Component {
	    
	    render() {
	        if (!this.options.list.theme) {
	            this.options.list.theme = 'modal-content_dark';
	        }else{
	            this.options.list.theme = 'modal-content_' + this.options.list.theme;
	        }

	        let style = '';
	        if (this.options.list.style) {
	        	style = this.options.list.style;
	        }

	        return `
	            <div class="modal">
	                <button class="modal__close">
	                  <svg class="modal__close_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/><line class="cls-1" x1="7" x2="25" y1="25" y2="7"/></g></svg>
	                </button>
	                <div class="modal-content ${this.options.list.theme}" style="${style}">
	                    ${this.childrens.create(this.options.list.children, this.options.list)}
	                </div>
	            </div>
	        `;
	    }

	    afterMount() {
	    	let html = document.getElementsByTagName('html')[0],
	    		WidthBefore = html.clientWidth;

	    	html.classList.add('html_overflow');
	    	let WidthAfter = html.clientWidth;
	    	html.style.marginRight = `${WidthAfter-WidthBefore}px`;

	        this._closeButton = this.getContainer().querySelector('.modal__close');
	        this.subscribeTo(this._closeButton, 'click', this.onClose.bind(this));
	        this.subscribeTo(this.getContainer(), 'click', this.onCloseModal.bind(this));
	    }

	    beforeUnmount() {
	        delete this._closeButton;
	    }

	    onCloseModal(){
	    	if ( event.target.classList.contains('modal') ) {
	    	    this.onClose();
	    	}
	    }

	    onClose(event) {
	    	let html = document.getElementsByTagName('html')[0]
	    	html.classList.remove('html_overflow');
	    	html.style.marginRight = '0px';
	        this.unmount();
	    }


	}

	return Modal;
});  
