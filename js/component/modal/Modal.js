define(['base/component'], function (Component) {
	'use strict';

	class Modal extends Component {
	    
	    render() {
	        if ( !this.options.list.theme ) {
	            this.options.list.theme = 'modal-content_dark';
	        }else{
	            this.options.list.theme = 'modal-content_' + this.options.list.theme;
	        }

	        return `
	            <div class="modal">
	                <button class="modal__close">
	                  <svg class="modal__close_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"/><line class="cls-1" x1="7" x2="25" y1="25" y2="7"/></g></svg>
	                </button>
	                <div class="modal-content ${this.options.list.theme}">
	                    ${this.childrens.create(this.options.list.children, this.options.list)}
	                </div>
	            </div>
	        `;
	    }

	    afterMount() {
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
	        this.unmount();
	    }


	}

	return Modal;
});  
