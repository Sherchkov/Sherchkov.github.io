// eslint-disable-next-line no-undef
define(['base/component', 'server/json', 'component/wall/post', 'css!component/wall/wall'], function (Component, json, Post) {
	'use strict';
	var tensor = new URL ('https://tensor-school.herokuapp.com/');

	class Wall extends Component {
		constructor(options) {
			super();
			this.options = options;
			this.user_id = options.id;
			this.current_id = options.id;
			this.wall = [];
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

		beforeMount(){
			let updateData = new Promise ((resolve,reject) => {
				let getPost = new URL (`/message/list/${this.current_id}`, tensor);
				fetch(getPost, {
					method : 'GET',
					mode: 'cors',
					credentials: 'include'
				}).then(response => response.json())
				.then(result => this.handleData(result.messages))
				.then(()=> resolve())
				.catch(error => reject(console.log(error)));
			}); 
			
			updateData.then(() => {
				if (this.isMount){
					this._afterMount();
				}
			});
		}

		afterMount() {	
			let buttonCreate = document.querySelector('.post-data_header__button');
			this.subscribeTo(buttonCreate, 'click', this.createPost.bind(this));

			this.createAllPost();
		}

		createPost(){
			event.stopPropagation();
			let opt = this.options;
			// eslint-disable-next-line no-undef
			require(['modal/ActionModal', 'modal/ModalCreatePost'], function(ActionModal, ModalCreatePost){
				new ActionModal({
					children : ModalCreatePost,
					theme: 'white',
					id: opt.id
				});  
			});
		}

		createAllPost(){
			for (let post of this.wall) {
				// eslint-disable-next-line no-undef
				let postForMount = factory.create(Post, post);
				let path = document.getElementById(this.id);
				postForMount.mount(path);
			}
		}

		uploadAllPosts(){
			let getPost = new URL (`/message/list/${this.current_id}`, tensor);
            fetch(getPost, {
                method : 'GET',
				mode: 'cors',
                credentials: 'include'
			}).then(response => response.json())
			.then(result => this.handleData(result.messages))
			.catch(error => console.log(error));	
		}

		handleData(data){
			[...data].forEach(
				elem => {
					let preAuthor = this.replace(elem.author, '\'', '"');
					elem.author = JSON.parse(preAuthor);
					let someData = this.getDateAndPhoto(elem.image);
					let isDelete = elem.author.id === this.user_id || elem.author.id === this.current_id? true : false;
					console.log(elem);
					this.wall.unshift(
						this.makeObjectPost(
							elem.id,
							'#',
							elem.author.data.data.name,
							elem.author.computed_data.photo_ref,
							someData.date,
							elem.message,
							someData.img,
							isDelete
						)
					);
				}
			);
			return true ;
		}
		
		replace(str, elemForPeplace, newElem){
			let newStr = '';
			for (let char = 0; char < str.length; char++){
				if (str[char] !== elemForPeplace){
					newStr += str[char];
				}
				else {
					newStr += newElem;
				}
			}
			return newStr;
		}

		makeObjectPost(idOfPost, src, name, avatar, date, text, img, isDelete){
			return{
				'id' : idOfPost,
				'href' : src,
				'name' : name,
				'avatar' : avatar,
				'date' : date,
				'text' : text,
				'img' : img,
				'delete' : isDelete
			};
		}

		getDateAndPhoto(inputStr){
			let date = '';
			let imgs = [];
			let virgules = [];

			for (let char = 0; char < inputStr.length; char++){
				if (inputStr[char] === ','){
					virgules.push(char);
				}
			}

			if (virgules.length === 0) {
				return {
					'date' : inputStr,
					'img' : []
				};
			}
			else {
				for (let position = 0; position < virgules.length; position++){
					if (position === 0){
						date = inputStr.substring(0, virgules[position]);
						imgs.push( inputStr.substring( virgules[position] + 1, virgules[position + 1] ) );
					}
					else if(position + 1 !== virgules.length){
						imgs.push( inputStr.substring( virgules[position] + 1, virgules[position + 1] ) );
					}
					else {
						imgs.push( inputStr.substring( virgules[position] + 1 ) );
					}
				}
				return {
					'date' : date,
					'img' : imgs
				};
			}

		}

		getAllUsers(){
			let getPosts = new URL ('/message/addressee_list', tensor);
            fetch(getPosts, {
                method : 'GET',
				mode: 'cors',
                credentials: 'include'
			}).then(response => response.json())
			.then(result => console.log(result))
			.catch(error => console.log(error));
		}
	}

	return Wall;
});  
