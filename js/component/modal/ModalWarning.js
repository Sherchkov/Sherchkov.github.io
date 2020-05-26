define(['base/component'], function (Component) {
	'use strict';

	class ModalWarning extends Component{
	    render(options) {
	    	this.options = options;
	        return ` 
	            <div class="warning">
	            	<div class="warning__title">Предупреждение</div>
	            	<div class="warning-content">
						${this.options.text}
	            	</div>
	            	<div class="warning-footer">
	            		<button class="warning__cansel">${this.options.canselButton}</button>
				${typeof(this.options.dataButton) !== 'undefined' ? `<button class="warning__act" data-act="${this.options.dataButton}">${this.options.textButton}</button>` : ''}
	            	</div>
	            </div>
	        `;
	    }

	    afterMount() {
	        this._closeButton = this.getContainer().querySelector('.warning__cansel');
	        this.subscribeTo(this._closeButton, 'click', this.onClose.bind(this));
	        if (this.options.dataButton) {
	        	this._act = this.getContainer().querySelector('.warning__act');
	        	this.subscribeTo(this._act, 'click', this.onClick.bind(this));
	        } 
	    }

	    onClick(){
	    	let data = this.getContainer().querySelector('.warning__act').getAttribute('data-act');
	    	if (data === 'deletePhoto') {
	    		this.deleteAvatar();
	    	}
	    	this.onClose();
	    }
	    
	    deleteAvatar(){
	    	//Удаляем фотографию
	    	fetch(globalUrlServer + '/user/upload_photo', {
	    		method : 'POST',
	    		headers: {"Content-Type": "image/png"},
	    		body: null,
	    		credentials: 'include'  
	    	})
	    	.then(response => {
	    		if ( response.ok ) {
	    			this.updating();
	    			document.querySelector('.content-photo .content-photo__img').setAttribute('src', 'img/avatar/avatar_default.png');
	    			document.querySelector('.header .header__img').setAttribute('src', 'img/avatar/avatar_default.png');
	    			document.querySelector('.content-photo .photo__delete').remove();
	    		}else{
	    			alert('Не удалось удалить фотографию');
	    			return;
	    		}  
	    	  
	    	})
	    	.catch(error => {
			alert('Не удалось удалить фотографию');
	    		console.log('error', error);
	    	});
	    }

	    onClose(event) {
	    	let html = document.getElementsByTagName('html')[0];
	    	html.classList.remove('html_overflow');
	    	html.style.marginRight = '0px';
	        modal.unmount();
	    }

	    //Вызов обновления стены 
	    updating() {
	        let updatingEvent = new Event('update');
	        document.querySelector('.content-wall').dispatchEvent(updatingEvent);
	    }
	}

	return ModalWarning;
});  
