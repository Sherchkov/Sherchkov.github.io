define(['base/component', 'css!component/avatar/avatar'], function (Component) {
	'use strict';

	class Avatar extends Component {
	    render(options) {
 			this.options = options;
 			this.mobile = (options.mobile === true) ? true : false;
	    	this.avatar = (!options.computed_data.photo_ref) ? 'img/avatar/avatar_default.png' : globalUrlServer + options.computed_data.photo_ref;

	        if ( options.mobile ) {
	        	return `
	        	    <div class="content-photo content-photo_mobile">
	        	      <img src="${this.avatar}" alt="Профиль" class="content-photo__img modalPhoto content-photo__img_mobile">
	        	      ${this.options.id === user_id ? `  
		        	      <div class="photo-edit_mobile">
		        	      	<img class="photo-edit__icon" src="img/icons/system/editMobil.png" alt="Редактировать" title="Редактировать">
		        	      </div>
		        	      ${options.computed_data.photo_ref ? `
								 <div class="photo__delete photo__delete_mobile" title="Удалить">
										<svg class="photo__deleteIcon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
								 </div>
		        	      	` : ''}
	        	      ` : ''}
	        	    </div>
	        	`;
	        } else {
	        	return `
	        	    <div class="content-photo content_default">
	        	      <img src="${this.avatar}" alt="Профиль" class="content-photo__img modalPhoto">
					  ${this.options.id === user_id ? ` 
		        	      <div class="photo-edit">
		        	      	<img class="photo-edit__icon" src="img/icons/system/pen.png" alt="Редактировать" title="Редактировать">
		        	      </div>
		        	      ${options.computed_data.photo_ref ? `
								 <div class="photo__delete" title="Удалить">
										<svg class="photo__deleteIcon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
								 </div>
		        	      ` : ''}
					  ` : ''}
	        	    </div>
	        	`;
	        }
	    }

	    afterMount() {
	    	if (this.options.id === user_id && !this.mobile) {
	    		this.subscribeTo(this.getContainer(), 'mouseenter', this.onShowEditPhoto.bind(this));
	        	this.subscribeTo(this.getContainer(), 'mouseleave', this.onHideEditPhoto.bind(this));
	    	}
	        this.subscribeTo(this.getContainer(), 'click', this.clickOnPhoto.bind(this));
	    }

	    //добавление класса при наведении на фотографию
	    onShowEditPhoto(event){
	        this.getContainer().querySelector('.photo-edit').classList.add('photo-edit__active');
	        if (this.getContainer().querySelector('.photo__delete')) {
	        	this.getContainer().querySelector('.photo__delete').classList.add('photo__delete_active');
	        }
	    }

	    //удаление класса при наведении на фотографию
	    onHideEditPhoto(event){
	        this.getContainer().querySelector('.photo-edit').classList.remove('photo-edit__active');
	        if (this.getContainer().querySelector('.photo__delete_active')) {
	        	this.getContainer().querySelector('.photo__delete').classList.remove('photo__delete_active');
	        }
	    }

	    clickOnPhoto(event){
	        let element = event.target;
	        if (element.closest(".photo-edit") || element.closest(".photo-edit_mobile")) {
	        	this.editPhoto();
	        } else if (element.classList.contains("modalPhoto")) {
	        	this.showPhoto(element);
	        } else if (element.closest('.photo__delete')){
	        	this.deletePhoto();
	        }	

	    }

	    editPhoto(){
	    	require(['modal/ModalAddPhoto'], function(ModalAddPhoto){
	    		if (  typeof(modalAddPhoto) !== 'undefined' ) {
	    		    modalAddPhoto.unmount();
	    		}
	    		modalAddPhoto = factory.create(ModalAddPhoto, {
	    			component : 'avatar', 
	    			urlDownload : '/user/upload_photo', 
	    		});
	    		modalAddPhoto.mount(document.body);
	    	});
	    }

	    showPhoto(element){
	    	require(['modal/ActionModal', 'modal/ModalPhoto'], function(ActionModal, ModalPhoto){ 
        		new ActionModal({
	                children : ModalPhoto,
	                src : element.getAttribute('src'),
	                title : element.getAttribute('title'),
	                alt : element.getAttribute('title') || element.parentElement.getAttribute('title') || ""
	            });
        	});
	    }

	    deletePhoto(){
	    	require(['modal/ActionModal', 'modal/ModalWarning'], function(ActionModal, ModalWarning){ 
        		new ActionModal({
        			theme : 'white',
        			style : `top:30%; height:auto; max-width:90%; width: 500px; background:transparent;`,
	                children : ModalWarning,
	                text : 'Вы уверены, что хотите удалить фотографию?',
	                textButton : 'Удалить',
	                dataButton : 'deletePhoto'
	            });
        	});
	    }
	    
	}

	return Avatar;
});  
