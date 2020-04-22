define(['base/component'], function (Component) {
	'use strict';

	class ModalGallery extends Component{
		
	    render(options) {
	    	if ( !options.items || !options.items.length ) {
	    		return false;
	    	}else{
	    		this.items = options.items;
	    	}
	    	let htmlContainer = '';
	    	for (let i = 0; i < this.items.length; i++){
	    		htmlContainer += ` 
					<div class="galleryBig__imgContainer">
						<img class="galleryBig__img" src="${this.items[i]}" alt="фотография">
						<div class="galleryBig__imgDelete" title="Удалить" data-id="${i}">
							<svg class="galleryBig__imgDelete_icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g><line class="cls-1" x1="7" x2="25" y1="7" y2="25"></line><line class="cls-1" x1="7" x2="25" y1="25" y2="7"></line></g></svg>
						</div>
					</div>
	    		`;
	    	}

	        return ` 
	          <div class="galleryBig">
	  	          <div class="galleryBig__head">
	  	          	<span class="galleryBig__title">Мои фотографии</span>
	  	          	<button class="galleryBig__add">Добавить</button>
	  	          </div>
	  	          <div class="galleryBig__container">
	  				${htmlContainer}
	  	          </div> 
	          </div>
	        `;
	    }

	    afterMount(){
	    	document.querySelector('.modal-content').classList.add('modal-content_big');
	    	this._container = this.getContainer().querySelector('.galleryBig__container');
	    	this.subscribeTo(this._container, 'click', this.chooseAction.bind(this));

	    	this._addPhoto = this.getContainer().querySelector('.galleryBig__add');
	    	this.subscribeTo(this._addPhoto, 'click', this.addPhoto);
	    }

	    chooseAction(event){
	    	if ( event.target.closest('.galleryBig__imgDelete') ) {
	    		this.deleteImg(event.target.closest('.galleryBig__imgDelete'));
	    	}else if ( event.target.classList.contains('galleryBig__img') ) {
	    		this.createBigSlider( event.target.parentElement );
	    	}else if ( event.target.classList.contains('galleryBig__restoreButton') ) {
	    		this.restoreImg( event.target.parentElement );
	    	}
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

	    		if (  typeof(modalslider) !== "undefined" ) {
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
	    		if (  typeof(modalAddPhoto) !== "undefined" ) {
	    		    modalAddPhoto.unmount();
	    		}

	    		modalAddPhoto = factory.create(ModalSlider, {});
	    		modalAddPhoto.mount(document.body);
	    	})
	    }

	    restoreImg(element){
	    	element.parentElement.querySelector('.galleryBig__imgDelete').style.display = 'block';
	    	element.remove();
	    }

	    deleteImg(element){
	    	let restore = document.createElement('div');
	    	restore.className = 'galleryBig__restore';
	    	restore.innerHTML = '<button class="galleryBig__restoreButton">Восстановить</button>';
	    	element.parentElement.append(restore);
	    	element.style.display = 'none';
	    }
	}
	
	return ModalGallery;
});  
