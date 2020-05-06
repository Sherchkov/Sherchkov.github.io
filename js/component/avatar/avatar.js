define(['base/component', 'css!component/avatar/avatar.min'], function (Component) {
	'use strict';

	class Avatar extends Component {
	    render(options) {
	    	if ( options.mobile ) {
	    		this.mobile = true;
	    	}else{
	    		this.mobile = false;
	    	}

	    	if (options.computed_data.photo_ref) {
	    		this.avatar = globalUrlServer + options.computed_data.photo_ref;
	    	}else{
	    		this.avatar = 'img/avatar/avatar_default.png';
	    	}

	        if ( options.mobile ) {
	        	return `
	        	    <div class="content-photo content-photo_mobile">
	        	      <img src="${this.avatar}" alt="Профиль" class="content-photo__img modalPhoto content-photo__img_mobile">
	        	      <div class="photo-edit_mobile">
	        	        <img class="photo-edit__icon" src="img/icons/system/editMobil.png" alt="Редактировать" title="Редактировать">
	        	      </div>
	        	    </div>
	        	`;
	        }else{
	        	return `
	        	    <div class="content-photo content_default">
	        	      <img src="${this.avatar}" alt="Профиль" class="content-photo__img modalPhoto">
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
	        if (element.closest(".photo-edit") || element.closest(".photo-edit_mobile")  ) {
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

	        } else if ( element.classList.contains("modalPhoto") ) {
	        	require(['modal/ActionModal', 'modal/ModalPhoto'], function(ActionModal, ModalPhoto){ 
	        		new ActionModal({
		                children : ModalPhoto,
		                src : element.getAttribute('src'),
		                title : element.getAttribute('title'),
		                alt : element.getAttribute('title') || element.parentElement.getAttribute('title') || ""
		            });
	        	});
	        } 

	    }
	}

	return Avatar;
});  
