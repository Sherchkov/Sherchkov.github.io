// eslint-disable-next-line no-undef
define(['base/component', 'server/json', 'component/wall/post', 'css!component/wall/wall'], function (Component, json, Post) {
	'use strict';
	var tensor = new URL ('https://tensor-school.herokuapp.com/');

	class Wall extends Component {
		constructor(options) {
			super();
			this.options = options;
			this.user_id = options.id;
			this.current_id;
			this.wall = [];
			this.useCSS = {
				postHeader : 'post-data_header',
				postButton : 'post-data_header__button',
				postTitle : 'post-data_header__title',
				contentWall :'content-wall', 
				contentDefault :'content_default'
				};
			this.updating = false;
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
			this.updateData();
		}

		afterMount() {	
			let buttonCreate = document.querySelector('.post-data_header__button');
			this.subscribeTo(buttonCreate, 'click', this.createPost.bind(this));
			this.subscribeTo(this.getContainer(), 'update', this.update.bind(this));
			this.createAllPost();

			if (this.options.id === this.current_id){
				document.querySelector(`.${this.useCSS.postTitle}`).innerHTML = 'Мои записи';
			}
			else {
				document.querySelector(`.${this.useCSS.postTitle}`).innerHTML = 'Записи Пользователя';
			}
			this.autoUpdating(60);
		}

		createPost(){
			event.stopPropagation();
			let opt = this.options;
			let curr = this.current_id;
			// eslint-disable-next-line no-undef
			require(['modal/ActionModal', 'modal/ModalCreatePost'], function(ActionModal, ModalCreatePost){
				new ActionModal({
					children : ModalCreatePost,
					theme: 'white',
					id: curr,
					curr_id : opt.id
				});  
			});
		}

		autoUpdating(timeInSeconds){
			setInterval(() => {
				this.update();
			}, 1000 * timeInSeconds);
		}

		update(){
			if (!this.updating) {
				this.updateData();
				this.updating = true;
			}
		}

		updateData(){

			let updateCurrentUser = new Promise ((resolve,reject) => {
				let getUser = new URL ('/user/current', tensor);
				fetch(getUser, {
					method : 'GET',
					mode: 'cors',
					credentials: 'include'
				}).then(response => response.json())
				.then(result => {this.current_id = result.id;return true;})
				.then(()=> resolve())
				.catch(error => reject(console.log(error)));
			}); 

			let updateData = new Promise ((resolve,reject) => {
				let getPost = new URL (`/message/list/${this.user_id}`, tensor);
				fetch(getPost, {
					method : 'GET',
					mode: 'cors',
					credentials: 'include'
				}).then(response => response.json())
				.then(result => this.handleData(result.messages))
				.then(()=> resolve())
				.catch(error => reject(console.log(error)));
			}); 

			Promise.all([updateData, updateCurrentUser])
			.then(() => {
				if (this.isMount){
					this._afterMount();
				}
			});
		}

		createAllPost(){
			if (this.updating){
				let oldPosts = document.querySelectorAll('.post');
				[...oldPosts].forEach(oldPost => {oldPost.remove();});
				this.updating = false;
			}

			for (let post of this.wall) {
				// eslint-disable-next-line no-undef
				let postForMount = factory.create(Post, {opt : this.options, post : post});
				let path = document.getElementById(this.id);
				postForMount.mount(path);
			}
		}

		handleData(data){
			this.wall = [];
			for (let elem of data){
				let preAuthor = this.replace(elem.author, '\'', '"');
				let replaceNone = this.replaceStr(preAuthor, 'None', 'undefined');
				elem.author = JSON.parse(replaceNone);
				let someData = this.getDateAndPhoto(elem.image);
				let isDelete;
				let isChange;
				if (this.current_id === this.user_id || elem.author.id === this.current_id){
					isDelete = true;
				} else {
					isDelete = false;
				} 

				if (elem.author.id === this.current_id){
					isChange = true;
				} else {
					isChange = false;
				} 
				this.wall.unshift(
					this.makeObjectPost(
						elem.id,
						elem.author.id,
						elem.author.data.name,
						elem.author.computed_data.photo_ref,
						someData.date,
						elem.message,
						someData.img,
						isDelete,
						isChange
					)
				);
			}
			
			return true ;
		}

		replaceStr(inputStr, strForReplace, newStr){
			let str = '';
	
			if (inputStr.includes(strForReplace)){
				let start = inputStr.indexOf(strForReplace);
				let end = start + strForReplace.length;
				str = inputStr.slice(0, start) + `"${newStr}"` + inputStr.substring(end);			
			}
			else{
				str = inputStr;
			}

			return str;
		}
		
		replace(str, elemForReplace, newElem){
			let newStr = '';
			for (let char = 0; char < str.length; char++){
				if (str[char] !== elemForReplace){
					newStr += str[char];
				}
				else {
					newStr += newElem;
				}
			}
			return newStr;
		}

		makeObjectPost(idOfPost, src, name, avatar, date, text, img, isDelete, isChange){
			return{
				'id' : idOfPost,
				'href' : src,
				'name' : name,
				'avatar' : avatar,
				'date' : date,
				'text' : text,
				'img' : img,
				'delete' : isDelete,
				'change' : isChange
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
