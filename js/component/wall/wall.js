// eslint-disable-next-line no-undef
define(['base/component', 'server/json', 'component/wall/post', 'css!component/wall/wall'], function (Component, json, Post) {
	'use strict';

	class Wall extends Component {
		constructor() {
			super();
			this.wall = json.wall;
			this.useCSS = {
				postHeader : 'post-data_header',
				postButton : 'post-data_header__button',
				postTitle : 'post-data_header__title',
				contentWall :'content-wall', 
				contentDefault :'content_default'
				};
			}

		render() {
			let posts = '';
			
			for (let post of this.wall) {
				let postObj = new Post(post);
				posts = postObj.render() + posts;
			}

			return `
				<div class="${this.useCSS.contentWall} ${this.useCSS.contentDefault}">
					<div class="${this.useCSS.postHeader}">
						<span class="${this.useCSS.postTitle}">Мои записи</span>
						<span class="${this.useCSS.postButton}">добавить</span>
					</div>
					${posts}
				</div>`;
		}

		afterMount() {
            console.log('hi');
			this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
		}

		chooseAction(event){
			if (event.target.classList.contains('post-data_header__button')) {
				this.createPost();
			} else if (event.target.classList.contains('post-img__picture')) {
				this.openPost();
			} else if (event.target.alt === 'Удалить') {
				this.deletePost();
			}
		}

		createPost(){
			event.stopPropagation();
		}

		openPost(){
			event.stopPropagation();
		}

		deletePost(){
			event.stopPropagation();

			let postForDelete = event.target;

			while (postForDelete.className !== 'post') {
				postForDelete = postForDelete.parentElement;
			}
			postForDelete.remove();
			postForDelete = null;
		}

	}

	return Wall;
});  
