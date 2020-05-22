// eslint-disable-next-line no-undef
define(['base/component', 'css!component/wall/wall'], function (Component) {
	'use strict';
	var tensor = new URL ('https://tensor-school.herokuapp.com/');

	class Post extends Component{
        constructor(data) {
            super();
			this.post = data.post;
			this.post_id = data.post.id;
			this.options = data.opt;
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
				postImgs : 'post-img'
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
			} else {
				litera = 'а';
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
			let seconds = {
				oneMinute : 60,
				oneHour : 3600
			};

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
				return `<img src="${new URL (this.post.avatar, tensor)}" alt="${this.post.name}" class="${this.useCSS.postAva}">`;
			}
			else {
				return `<p class="${this.useCSS.postCap}" title="Неизвестный пользователь"></p>`;
			}
			
		}

        render() {
            let images = '';
            let date = '';
            let rubbish = '';
			let fullPost ='';
			let remade = '';

            if (this.post.img.length !== 0){
                for (let image of this.post.img) {
                    images += `<img src="${new URL (image, tensor)}" alt="Картинка записи" class="${this.useCSS.postImage}">`;
                }
            }

            if (this.post.delete) {
                rubbish = '<p class="post__button" title="Удалить">Удалить</p>';
			}

			if (this.post.change){
				remade = '<p class="post__button">Изменить</p>';
			}
			
			let comments = '<p class="post__button">Комментировать</p>';
			let avatar = this._getAvatar();

            date = this._defineDate(this.post.date);

            fullPost = ` 
                <div class="${this.useCSS.post}" data-id="${this.post_id}">
                    <div class="${this.useCSS.postData}">
                        <a id="${this.post.href}" class="${this.useCSS.postLink}">
                            ${avatar}
                        </a>
                        <a id="${this.post.href}" class="${this.useCSS.postMaker}">${this.post.name}</a>
                        <span class="${this.useCSS.postDate}">${date}</span>
                    </div>
                    <div class="${this.useCSS.postText}">${this.post.text}</div>
                    <div class="${this.useCSS.postImgs}">
                        ${images}
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
			this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));

		}
		
		chooseAction(event){
			if (event.target.classList.contains('post-img__picture')) {
				this.openPost();
			} else if (event.target.classList.contains('post-text')) {
				this.openPost();
			} else if (event.target.classList.contains('post-data__img')) {
				this.uploadFriend();
			} else if (event.target.classList.contains('post-data__name')) {
				this.uploadFriend();
			} else if (event.target.title === 'Удалить') {
				this.deletePost();
			}
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
				.then(() => result.postForDelete.remove())
				.catch(error => console.log('error', error));

			});
           
		}

	}
	
	return Post;
});  