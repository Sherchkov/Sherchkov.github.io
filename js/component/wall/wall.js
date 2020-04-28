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
			return `
				<div class="${this.useCSS.contentWall} ${this.useCSS.contentDefault}">
					<div class="${this.useCSS.postHeader}">
						<span class="${this.useCSS.postTitle}">Мои записи</span>
						<span class="${this.useCSS.postButton}">добавить</span>
					</div>
				</div>`;
		}

		afterMount() {	
			for (let post of this.wall) {
				// eslint-disable-next-line no-undef
				let postForMount = factory.create(Post, post);
				let path = document.getElementById(this.id);
				postForMount.mount(path);
			}
		}
	}

	return Wall;
});  
