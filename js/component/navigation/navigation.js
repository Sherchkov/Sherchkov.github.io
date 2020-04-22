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
		render() {
			this.items = json.gallery.images;
			this.items.push(json.header.photo);
			const links = [{
				title: 'Поклонники',
				img: 'img/icons/system/fav.png'
			},{
				title: 'Интересное',
				img: 'img/icons/system/int.png'
			},{
				title: 'Друзья товарищи',
				img: 'img/icons/system/friends.png'
			},{
				title: 'Видеозаписи',
				img: 'img/icons/system/video.png'
			},{
				title: 'Фотографии',
				img: 'img/icons/system/photo.png'
			},{
				title: 'Музыка',
				img: 'img/icons/system/music.png'
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
			console.log(element);
			switch (element.dataset.id) {
				case '0':{
					new ActionModal({
						children : ModalFan,
						//src : element.getAttribute('src'),
						//title : element.getAttribute('title'),
						//alt : element.getAttribute('title') || element.parentElement.getAttribute('title') || ""
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
						children : ModalFriends
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
					new ActionModal({
						children : ModalGallery,
						theme: 'white',
						items : this.items
					}); 
					break;
				}
				case '5':{
					new ActionModal({
						children : ModalMusic
					}); 
					break;
				}
			}

		}
	}

	return Navigation;
});  
