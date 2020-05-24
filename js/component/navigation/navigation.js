// eslint-disable-next-line no-undef
define(['base/component', 
		'modal/ActionModal', 
		'modal/ModalVideo', 
		'modal/ModalLike', 
		'modal/ModalFan', 
		'modal/ModalFriends', 
		'modal/ModalMusic', 
		'modal/ModalGallery',
		'server/json', 
		'css!component/navigation/navigation.min'], 
		function (Component, ActionModal, ModalVideo, ModalLike, ModalFan, ModalFriends, ModalMusic, ModalGallery, json) {
	'use strict';

	class Navigation extends Component {
		constructor(options) {
			super();
			this.options = options;
		}
		render() {
			this.items = json.gallery.images;
			this.items.push(json.header.photo);
			const links = [{
				title: 'Поклонники',
				img: 'img/icons/system/heart.png'
			},{
				title: 'Интересное',
				img: 'img/icons/system/star.png'
			},{
				title: 'Друзья товарищи',
				img: 'img/icons/system/friend.png'
			},{
				title: 'Видеозаписи',
				img: 'img/icons/system/cinema.png'
			},{
				title: 'Фотографии',
				img: 'img/icons/system/photo-camera.png'
			},{
				title: 'Музыка',
				img: 'img/icons/system/speaker.png'
			}];
		
			let str = '<div class="content-link content_default">';
			let id = 0;
			links.forEach(function(item){
				str += `<div class="link-element" data-id="${id}">
							<div class="link-element__img" data-id="${id}">
								<img src="${item.img}" data-id="${id}" alt="${item.title}" title="${item.title}">
							</div>
							<span class="link-element__title" data-id="${id}" title="${item.title}">${item.title}</span>
						  </div>`;
				id++;
			});
		
			str += '</div>';

			return str;
		}
		
		afterMount() {
			this.subscribeTo(this.getContainer(), 'click', this.createModalVideo.bind(this));
		}

		createModalVideo(event){
			let element = event.target;
			switch (element.dataset.id) {
				case '0':{
					new ActionModal({
						children : ModalFan,
					}); 
					break;
				}
				case '1':{
					new ActionModal({
						children : ModalLike
						
					}); 
					break;
				}
				case '2':{
					new ActionModal({
						children : ModalFriends,
						theme : 'white',
						options : this.options
					}); 
					break;
				}
				case '3':{
					new ActionModal({
						children : ModalVideo
					}); 
					break;
				}
				case '4':{
					if (globalSliderPhotos.length) {
						let options = {
							id :  this.options.parent.options.id,
							mobile : this.options.parent.options.data.mobile || false
						}
						require(['modal/ModalGallery'], function(ModalGallery){ 
							if (  typeof(modalGallery) !== 'undefined' ) {
							    modalGallery.unmount();
							}
							modalGallery = factory.create(ModalGallery, options);
							modalGallery.mount(document.body);
						});
					}
					break;
				}
				case '5':{
					new ActionModal({
						children : ModalMusic,
						theme: 'white'
					}); 
					break;
				}
			}

		}
	}

	return Navigation;
});  
