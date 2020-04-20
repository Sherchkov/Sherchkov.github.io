define(['base/component', 'modal/ActionModal', 'modal/ModalDrop', 'modal/ModalPhoto', 'server/json', 'css!component/avatar/avatar.min'], function (Component, ActionModal, ModalDrop, ModalPhoto, json) {
	'use strict';

	let avatar = json.avatar.photo;

	class Avatar extends Component {
	    render(options) {
	    	if ( options.mobile ) {
	    		this.mobile = true;
	    	}else{
	    		this.mobile = false;
	    	}
	        let avatar = json.avatar.photo;
	        if ( options.mobile ) {
	        	return `
	        	    <div class="content-photo content-photo_mobile">
	        	      <img src="${avatar}" alt="Профиль" class="content-photo__img modalPhoto content-photo__img_mobile">
	        	      <div class="photo-edit_mobile">
	        	        <img class="photo-edit__icon" src="img/icons/system/editMobil.png" alt="Редактировать" title="Редактировать">
	        	      </div>
	        	    </div>
	        	`;
	        }else{
	        	return `
	        	    <div class="content-photo content_default">
	        	      <img src="${avatar}" alt="Профиль" class="content-photo__img modalPhoto">
	        	      <div class="photo-edit">
	        	        <img class="photo-edit__icon" src="img/icons/system/pen.png" alt="Редактировать" title="Редактировать">
	        	      </div>
	        	    </div>
	        	`;
	        }

	        
	    }
	    afterMount() {
	    	if ( !this.mobile ) {
	    		this.subscribeTo(this.getContainer(), 'mouseenter', this.onShowEditPhoto.bind(this));
	        	this.subscribeTo(this.getContainer(), 'mouseleave', this.onHideEditPhoto.bind(this));
	    	}
	        this.subscribeTo(this.getContainer(), 'click', this.createModalPhoto.bind(this));
	    }

	    //добавление класса при наведении на фотографию
	    onShowEditPhoto(event){

	        this.getContainer().querySelector('.photo-edit').classList.add('photo-edit__active');
	    }

	    //удаление класса при наведении на фотографию
	    onHideEditPhoto(event){
	        this.getContainer().querySelector('.photo-edit').classList.remove('photo-edit__active');
	    }


	    createModalPhoto(event){
	        let element = event.target;
	        if ( element.classList.contains("photo-edit") || element.parentElement.classList.contains("photo-edit")  || element.classList.contains("photo-edit_mobile") || element.parentElement.classList.contains("photo-edit_mobile")) {
	            new ActionModal({
	                children : ModalDrop,
	                theme : 'white',
	            });
	        } else if ( element.classList.contains("modalPhoto") ) {
	            new ActionModal({
	                children : ModalPhoto,
	                src : element.getAttribute('src'),
	                title : element.getAttribute('title'),
	                alt : element.getAttribute('title') || element.parentElement.getAttribute('title') || ""
	            }); 
	        } 

	    }
	}

	return Avatar;
});  
