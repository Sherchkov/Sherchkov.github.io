// eslint-disable-next-line no-undef
define(['base/component','component/wall/comment', 'css!component/wall/wall'], function (Component, Comment) {
	'use strict';
	var tensor = new URL ('https://tensor-school.herokuapp.com/');

	class Post extends Component{
        constructor(data) {
            super();
			this.post = data.post;
			this.post_id = data.post.id;
			this.options = data.opt;
			this.thisUserid = this.options.id;
			this.myid = data.myid;
			this.isComment = false;
			this.comments = data.comments;
            this.useCSS = {
				postImage : 'post-img__picture',
				buttonDelete : 'post-data__delete',
				post : 'post',
				postData : 'post-data',
				postLink : 'post-data__link',
				postAva : 'post-data__img',
				postCap : 'post-data__cap',
				postMaker : 'post-data__name',
				postDate : 'post-data__date',
				postText : 'post-text',
				postImgs : 'post-img_grid'
				};
        }
        _getRoundSeconds(dateNow, dateCreate) {
			return Math.floor((dateNow - dateCreate)/1000);
		}

		_getMinutes(dateNow, dateCreate) {
			let countOfMinutes = dateNow.getMinutes() - dateCreate.getMinutes();
			let oneHour = 60;
						
			if (dateNow.getMinutes() >= dateCreate.getMinutes()) {
				return countOfMinutes;
			} else {
				return countOfMinutes + oneHour;
			}
			
		}

		_getHours(dateNow, dateCreate) {
			let countOfHours = dateNow.getHours() - dateCreate.getHours();
			let oneDay = 24; 
			
			if (dateNow.getHours() >= dateCreate.getHours()){
				return countOfHours;
			} else {
				return countOfHours + oneDay;
			}
			
		}

		_isLess(timeFromCreating, timeForCompare) {
			return timeFromCreating <= timeForCompare? true : false;
		}

		_isFewDaysAgo(dateNow, dateCreate) {
			return ((dateNow.getDate() - dateCreate.getDate() < 2) &&
					dateNow.getMonth() === dateCreate.getMonth() && 
					dateNow.getFullYear() === dateCreate.getFullYear())? true : false;
		}

		_isAttendElement (element, massive) {
			for (let elementOfMassive of massive) {
				if (element === elementOfMassive) {
					return true;
				} 
			}
			return false;
		}

		_getLitera(number) {
			let literaY = [1, 21, 31, 41, 51];
			let literaU = [2, 3, 4, 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54];

			if (this._isAttendElement(number, literaY)) {
				return 'у';
			} else if (this._isAttendElement(number, literaU)) {
				return 'ы';
			} else {
				return '';
			}
		}

		_getStringForSeconds(timeFromCreatingInSeconds) {
				
			let litera = this._getLitera(timeFromCreatingInSeconds);	
			return `${timeFromCreatingInSeconds} секунд${litera} назад`;
		}

		_getStringForMinutes(dateNow, dateCreate){
			let timeInMinutes = this._getMinutes(dateNow, dateCreate);
			let litera = this._getLitera(timeInMinutes);

			return `${timeInMinutes} минут${litera} назад`;
		}

		_getStringForHours(dateNow, dateCreate){
			let countOfHours = this._getHours(dateNow, dateCreate);
			let litera = '';

			if (countOfHours === 1) {
				litera = '';
			} else if (countOfHours < 5){
				litera = 'а';
			} else {
				litera = 'ов';
			}

			return `${countOfHours} час${litera} назад`;
		}

		_getStringForFewDay(dateNow, dateCreate){
			let day = '';
			let minutes = dateCreate.getMinutes();
			if (dateNow.getDate() === dateCreate.getDate()) {
				day = 'Сегодня'; 
			} else {
				day = 'Вчера';
			}
			minutes = this._addNullForShortNum(minutes);
			return `${day} в ${dateCreate.getHours()}:${minutes}`;
		}

		_addNullForShortNum(number) {
			if (number < 10) {
				number.toString();
				number = '0' + number;
			}
			return number;
		}

		_getOtherCases(dateCreate) {
			let month = {
				0 : 'янв',
				1 : 'фев',
				2 : 'мар',
				3 : 'апр',
				4 : 'май',
				5 : 'июн',
				6 : 'июл',
				7 : 'авг',
				8 : 'сен',
				9 : 'окт',
				10 : 'нояб',
				11 :'дек'
			};
			let minutes = dateCreate.getMinutes();
			
			minutes = this._addNullForShortNum(minutes);
			return `${dateCreate.getDate()} ${month[dateCreate.getMonth()]} ${dateCreate.getFullYear()} в ${dateCreate.getHours()}:${minutes}`;
		}

		_defineDate(date) {
			let dateCreate = new Date (date);
			let dateNow = new Date ();
			let UTC = dateNow.getTimezoneOffset();
			let minutesUTC = UTC % 60;
			let hoursUTC = UTC / 60 - minutesUTC;
			let seconds = {
				oneMinute : 60,
				oneHour : 3600
			};
			
			let hoursOfCreate = dateCreate.getHours();
			let minutesOfCreate = dateCreate.getMinutes();
			hoursOfCreate -= hoursUTC;
			minutesOfCreate -= minutesUTC;
			dateCreate.setHours(hoursOfCreate);
			dateCreate.setMinutes(minutesOfCreate);

			let timeFromCreatingInSeconds = this._getRoundSeconds(dateNow, dateCreate);

			if (this._isLess(timeFromCreatingInSeconds, seconds.oneMinute)) {
				return this._getStringForSeconds(timeFromCreatingInSeconds);
			} else if (this._isLess(timeFromCreatingInSeconds, seconds.oneHour)) {
				return this._getStringForMinutes(dateNow, dateCreate);
			} else if (this._isLess(timeFromCreatingInSeconds, 3*seconds.oneHour)) {
				return this._getStringForHours(dateNow, dateCreate);
			} else if (this._isFewDaysAgo(dateNow, dateCreate)) {
				return this._getStringForFewDay(dateNow, dateCreate);
			} else {
				return this._getOtherCases(dateCreate);
			}
		}

		_getAvatar(){
			if (this.post.avatar !== 'undefined'){
				return `<img src="${new URL (this.post.avatar, tensor)}" title="Фото автора поста" alt="${this.post.name}" class="${this.useCSS.postAva}">`;
			}
			else {
				return `<p class="${this.useCSS.postCap}" title="Фото автора поста"></p>`;
			}
			
		}

		_getClassCSSForImgs(count){
			let number = parseInt(count, 10);
			switch (this.post.img.length) {
				case 1:
					return 'post-img__onePicture';

				case 2:
					return 'post-img__twoPicture';

				case 3:
					if (number === 0){
						return 'post-img__threePictureBig';
					}
					else{
						return 'post-img__threePictureSmall';
					}

				case 4:
					return 'post-img__fourPicture';

				case 5:
					if (number < 2){
						return 'post-img__fivePictureBig';
					}
					else{
						return 'post-img__fivePictureSmall';
					}

				case 6:
					if (number === 0){
						return 'post-img__sixPictureBig';
					}
					else if(number < 3){
						return 'post-img__sixPictureMedium';
					}
					else{
						return 'post-img__sixPictureSmall';
					}

				case 7:
					if (number === 0){
						return 'post-img__sevenPictureBig';
					}
					else{
						return 'post-img__sevenPictureSmall';
					}

				case 8:
					return 'post-img__eihgtPicture';
				
				case 9:
					if (number < 3){
						return 'post-img__ninePictureBig';
					}
					else{
						return 'post-img__ninePictureSmall';
					}

				case 10:
					if (/*number < 5 && number % 2 === 0 || number >= 5 && number % 2 === 1*/number < 3 || number> 6){
						return 'post-img__tenPictureSmall';
					}
					else if (number < 4 || number > 5) {
						return 'post-img__tenPictureBig';
					}
					else {
						return 'post-img__tenPictureMedium';
					}
				default:
					return this.useCSS.postImage;
			}
		}

        render() {
            let images = '';
            let date = '';
            let rubbish = '';
			let fullPost ='';
			let remade = '';
			let comments = '';

            if (this.post.img.length !== 0){
                for (let image in this.post.img) {
                    images += `<img src="${new URL (this.post.img[image], tensor)}" alt="Картинка записи" class="${this._getClassCSSForImgs(image)}  ${this.useCSS.postImage}">`;
                }
            }

            if (this.post.delete) {
                rubbish = '<p class="post__button" title="Удалить">Удалить</p>';
			}

			if (this.post.change){
				remade = '<p class="post__button" title="Изменить">Изменить</p>';
			}
			if (this.post.comment){
				comments = '<p class="post__button" title="Комментировать">Комментировать</p>';
			}
			
			let avatar = this._getAvatar();

            date = this._defineDate(this.post.date);

            fullPost = ` 
                <div class="${this.useCSS.post}" data-id="${this.post_id}">
                    <div class="${this.useCSS.postData}">
                        <a id="${this.post.href}" class="${this.useCSS.postLink}">
                            ${avatar}
                        </a>
                        <a id="${this.post.href}" class="${this.useCSS.postMaker}" title="Имя автора поста">${this.post.name}</a>
                        <span class="${this.useCSS.postDate}">${date}</span>
                    </div>
                    <p class="${this.useCSS.postText}">${this.post.text}</p>
                    <div class="${this.useCSS.postImgs}">
                        ${images}
					</div>
					<div class="post__comments-for-post">
					</div>
					<div class="post__block-create-comment">
					</div>
					<div class="post__block-buttons">
						${comments}
						${remade}
						${rubbish}
					</div>
                </div>
            `;
        return fullPost;
		}
		
		afterMount() {
			if (this.post.text !== ''){
				let elem = document.getElementById(`${this.id}`);
				let needElem = elem.querySelector(	`.${this.useCSS.postText}`);
				if (needElem.offsetHeight > 70){
					needElem.classList.add('post-text_short');
					let fullTextButton = document.createElement('p');
					fullTextButton.innerText = 'Показать полностью';
					fullTextButton.title = 'Показать полностью';
					fullTextButton.className = 'post-data__button';
					needElem.after(fullTextButton);
				}
			}

			this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
			this.renderComments();
		}
		
		chooseAction(event){
			if (event.target.classList.contains('post-img__picture')) {
				this.openPost();
			} else if (event.target.classList.contains('post-text')) {
				this.openPost();
			} else if (event.target.title === 'Фото автора поста') {
				this.uploadFriend();
			} else if (event.target.title === 'Имя автора поста') {
				this.uploadFriend();
			} else if (event.target.title === 'Удалить') {
				this.deletePost();
			} else if (event.target.title === 'Показать полностью') {
				this.showAll();
			} else if (event.target.title === 'Скрыть') {
				this.hideAll();
			} else if (event.target.title === 'Комментировать') {
				this.showCommentBlock();
			} else if (event.target.title === 'Отмена') {
				this.hideCommentBlock();
			} else if (event.target.title === 'Сохранить') {
				this.createComment();
			} else if (event.target.title === 'Изменить') {
				this.changePost();
			}
		}

		changePost(){
			let dataAboutPost = this.post;
			let idmy = this.myid;
			let currentId = this.thisUserid;
			// eslint-disable-next-line no-undef
			require(['modal/ActionModal', 'modal/ModalChangePost'], function(ActionModal, ModalChangePost){
				new ActionModal({
					children : ModalChangePost,
					theme: 'white',
					post : dataAboutPost,
					myid : idmy,
					currid : currentId 
				});  
			});
		}

		renderComments() {
			if (this.post_id in this.comments){
				for (let comment in this.comments[this.post_id]){
					let elem = document.getElementById(`${this.id}`);
					let pathForComment = elem.querySelector('.post__comments-for-post');
					// eslint-disable-next-line no-undef
					let commentForMount = factory.create(Comment, {comment : this.comments[this.post_id][comment]});

					commentForMount.mount(pathForComment);
				}
			}
		}

		createComment(){
			let elem = document.getElementById(`${this.id}`);
			let textOfField = elem.querySelector('.comment_field').value;
			if (textOfField.length !== 0){
				let handleText = this.replace(textOfField, '\n', '</br>');
				let textObject = {
					type : 'comment',
					idPost : this.post_id,
					text : handleText
				};

				let textForSend = JSON.stringify(textObject);

				let date = this.createDate();
				
				let urlencoded = new URLSearchParams();
                urlencoded.append('author', this.myid);
                urlencoded.append('addressee', this.thisUserid);
                urlencoded.append('message', textForSend);
                urlencoded.append('image', date);
				let createComment = new URL ('/message/create', tensor);

				fetch(createComment, {
                    method : 'POST',                
                    mode: 'cors',
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
                    body: urlencoded,
                    credentials: 'include'
				}).then(() => this.hideCommentBlock())
				.then(() => this.updating())
                .catch(error => console.log('error', error));
			} else {
				this.hideCommentBlock();
			}
		}

		createDate(){
            let now = new Date();
            let month = now.getMonth() + 1 < 10? '0' + (now.getMonth() + 1).toString() : (now.getMonth() + 1 ).toString();
            let day = now.getDate() < 10? '0' + now.getDate().toString():now.getDate().toString();
            let hours = now.getUTCHours() < 10? '0' + now.getUTCHours().toString():now.getUTCHours().toString();
            let minutes = now.getUTCMinutes() < 10? '0' + now.getUTCMinutes().toString():now.getUTCMinutes().toString();
            let seconds = now.getSeconds() < 10? '0' + now.getSeconds().toString():now.getSeconds().toString();

            return `${now.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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

		hideCommentBlock(){
			let elem = document.getElementById(`${this.id}`);
			let block = elem.querySelector('.post__block-create-comment');
			block.innerHTML = '';
			this.isComment = false;
		}

		showCommentBlock(){
			if (!this.isComment){
				this.isComment = true;
				let elem = document.getElementById(`${this.id}`);
				let block = elem.querySelector('.post__block-create-comment');
			
				let textarea = document.createElement('textarea');
				textarea.placeholder = 'Введите комментарий';
				textarea.className = 'comment_field';
				block.append(textarea);

				let buttonSave = document.createElement('p');
				buttonSave.innerText = 'Сохранить';
				buttonSave.title = 'Сохранить';
				buttonSave.className = 'comment_button';
				
				let buttonCancel = document.createElement('p');
				buttonCancel.innerText = 'Отмена';
				buttonCancel.title = 'Отмена';
				buttonCancel.className = 'comment_button';
				
				let blockButtons = document.createElement('div');
				blockButtons.className = 'comment_buttons';
				blockButtons.appendChild(buttonSave);
				blockButtons.appendChild(buttonCancel);
				block.append(blockButtons);
			} else {
				let elem = document.getElementById(`${this.id}`);
				let block = elem.querySelector('.post__block-create-comment');
				block.innerHTML = '';
				this.isComment = false;
			}
		}

		showAll(){
			let elem = document.getElementById(`${this.id}`);
			let needElem = elem.querySelector('.post-text_short');
			let button = elem.querySelector('.post-data__button');
			needElem.style.height = 'auto';

			let shortTextButton = document.createElement('p');
			shortTextButton.innerText = 'Скрыть';
			shortTextButton.title = 'Скрыть';
			shortTextButton.className = 'post-data__button';
			needElem.after(shortTextButton);
			button.remove();
		}

		hideAll(){
			let elem = document.getElementById(`${this.id}`);
			let needElem = elem.querySelector('.post-text_short');
			let button = elem.querySelector('.post-data__button');
			needElem.style.height = '74px';

			let fullTextButton = document.createElement('p');

			fullTextButton.innerText = 'Показать полностью';
			fullTextButton.title = 'Показать полностью';
			fullTextButton.className = 'post-data__button';
			needElem.after(fullTextButton);
			button.remove();
		}

		uploadFriend(){
            let getUser = new URL (`/user/read/${this.post.href}`, tensor);	
            
				fetch(getUser, {
					method : 'GET',
					mode: 'cors',
					credentials: 'include'
				}).then(response => response.json())
                .then(result => {    
                    this.options.parent.unmount();
                    if ( window.innerWidth > 800 ) {
                        // eslint-disable-next-line no-undef
                        require(['page/profile'], function (Profile) {
                            // eslint-disable-next-line no-undef
                            let page = factory.create(Profile, result);
                            page.mount(document.body);
                        });
                    } else {
                        // eslint-disable-next-line no-undef
                        require(['page/ProfileMobile'], function(profileMobile){
                            // eslint-disable-next-line no-undef
                            let page = factory.create(profileMobile, result);
                            page.mount(document.body);
                        });
                    }
                })
				.catch(() => this.uploadFriend());
        }

		openPost(){
			event.stopPropagation();
			let id = this.id;
			// eslint-disable-next-line no-undef
			require(['modal/ActionModal', 'modal/ModalOpenPost'], function(ActionModal, ModalOpenPost){
				new ActionModal({
					children : ModalOpenPost,
					theme: 'white',
					id : id
				});  
			});
		}

		deletePost(){
			event.stopPropagation();
			
			let getData = new Promise((resolve) =>{
				let postForDelete = event.target;

				while (postForDelete.className !== 'post') {
					postForDelete = postForDelete.parentElement;
				}
				let id_post = parseInt(postForDelete.dataset.id, 10);
				let urlencodedPost = new URLSearchParams();
				urlencodedPost.append('message_id', id_post);
				let deletePost = new URL ('/message/delete', tensor);
				resolve(
					{
						'id_post' : id_post,
						'urlencodedPost' : urlencodedPost,
						'deletePost' : deletePost,
						'postForDelete' : postForDelete
					}
				);
			});

			getData.then(result => {
				let images = result.postForDelete.querySelectorAll((`.${this.useCSS.postImage}`));
				let srcOfImages = [];
				for (let image = 0; image < images.length; image++) {
					let src = images[image].src;
					let position = src.lastIndexOf('/');
					let id = src.substring(position + 1);
					srcOfImages.unshift(parseInt(id, 10));
				}
				for(let image = 0; image < srcOfImages.length; image++){
					let urlencoded = new URLSearchParams();
					urlencoded.append('photo_id', srcOfImages[image]);
					let deletePhoto = new URL ('/photo/delete', tensor);
					
					fetch(deletePhoto, {
						method : 'POST',                
						mode: 'cors',
						headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
						body: urlencoded,
						credentials: 'include'
					})
					.catch(error => console.log('error', error));
										
				}
			});

			getData.then(result => {
				fetch(result.deletePost, {
					method : 'POST',                
					mode : 'cors',
					headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
					body : result.urlencodedPost,
					credentials : 'include'
				})
				.then(() => this.updating())
				.catch(error => console.log('error', error));

			});

			getData.then(result => {
				if (result.id_post in this.comments){
					for (let comment in this.comments[result.id_post]){
						let idComment = this.comments[result.id_post][comment].id;
						let urlencodedComment = new URLSearchParams();
						urlencodedComment.append('message_id', idComment );
						let deleteComment = new URL ('/message/delete', tensor);

						fetch(deleteComment, {
							method : 'POST',                
							mode : 'cors',
							headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
							body : urlencodedComment,
							credentials : 'include'
						})
						.then(() => this.updating())
						.catch(() => console.log('Не удалось удалить комментарий, попробуйте еще раз'));
					}
				}
			});
           
		}

		updating() {
            if (!this.isUpdate){
                let updatingEvent = new Event('update');
                document.querySelector('.content-wall').dispatchEvent(updatingEvent);
                this.isUpdate = true;
            }
        }
	}
	
	return Post;
});  