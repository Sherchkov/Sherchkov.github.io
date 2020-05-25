// eslint-disable-next-line no-undef
define(['base/component', 'css!component/wall/wall'], function (Component) {
    'use strict';
    var tensor = new URL ('https://tensor-school.herokuapp.com/');

    class Comment extends Component{
        constructor(data){
            super();
            this.comment = data.comment;
            this.useCSS = {
				postImage : 'post-img__picture',
				buttonDelete : 'post-data__delete',
				comment : 'comment',
				postData : 'post-data',
				commentLink : 'comment-data__link',
				postAva : 'post-data__img',
				postCap : 'post-data__cap',
				postMaker : 'post-data__name',
				postDate : 'post-data__date',
				commentText : 'comment-text',
				postImgs : 'post-img_grid'
				};
        }

        render(){
            let date = '';
            let rubbish = '';

            if (this.comment.delete) {
                rubbish = '<p class="comment__button" title="Удалить комментарий">Удалить</p>';
            }
            
            let avatar = this._getAvatar();
            date = this._defineDate(this.comment.date);

            let fullComment = ` 
                <div class="${this.useCSS.comment}" data-id="${this.comment.id}">
                    <div class="${this.useCSS.postData}">
                        <a id="${this.comment.href}" class="${this.useCSS.commentLink}">
                            ${avatar}
                        </a>
                        <a id="${this.comment.href}" class="${this.useCSS.postMaker}" title="Имя автора комментария">${this.comment.name}</a>
                        <span class="${this.useCSS.postDate}">${date}</span>
                        <p class="${this.useCSS.commentText}">${this.comment.text}</p>
                        ${rubbish}
                    </div>
                </div>
            `;

            return fullComment;
        }

        afterMount(){
			this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
			this.checkSize();
        }

        chooseAction(event){
            if (event.target.title === 'Удалить комментарий') {
                this.deleteComment();
            } else if (event.target.title === 'Показать полностью комментарий') {
				this.showAll();
			} else if (event.target.title === 'Скрыть комментарий') {
				this.hideAll();
			} else if (event.target.title === 'Фото автора комментария') {
				this.uploadFriend();
			} else if (event.target.title === 'Имя автора комментария') {
				this.uploadFriend();
			}
		}

		showAll(){
			let elem = document.getElementById(`${this.id}`);
			let needElem = elem.querySelector('.comment-text_short');
			let button = elem.querySelector('.comment-data_button');
			needElem.classList.remove('comment-text_short');
			
			let shortTextButton = document.createElement('p');
			shortTextButton.innerText = 'Скрыть комментарий';
			shortTextButton.title = 'Скрыть комментарий';
			shortTextButton.className = 'comment-data_button';
			needElem.after(shortTextButton);
			button.remove();
		}

		uploadFriend(){
            let getUser = new URL (`/user/read/${this.comment.href}`, tensor);	
            
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

		hideAll(){
			let elem = document.getElementById(`${this.id}`);
			let needElem = elem.querySelector('.comment-text');
			let button = elem.querySelector('.comment-data_button');
			needElem.classList.add('comment-text_short');

			let fullTextButton = document.createElement('p');
			fullTextButton.innerText = 'Показать полностью комментарий';
			fullTextButton.title = 'Показать полностью комментарий';
			fullTextButton.className = 'comment-data_button';
			needElem.after(fullTextButton);
			button.remove();
		}


		checkSize(){
			let elem = document.getElementById(`${this.id}`);
			let needElem = elem.querySelector(	`.${this.useCSS.commentText}`);
		
			if (needElem.offsetHeight > 15){
				needElem.classList.add('comment-text_short');
				let fullTextButton = document.createElement('p');
				fullTextButton.innerText = 'Показать полностью комментарий';
				fullTextButton.title = 'Показать полностью комментарий';
				fullTextButton.className = 'comment-data_button';
				needElem.after(fullTextButton);
			}
		}
		
		deleteComment(){
			let idOfElem = this.comment.id;
			let urlencodedComment = new URLSearchParams();
			urlencodedComment.append('message_id', idOfElem );
			let deleteComment = new URL ('/message/delete', tensor);

			fetch(deleteComment, {
				method : 'POST',                
				mode : 'cors',
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'},
				body : urlencodedComment,
				credentials : 'include'
			})
			.then(() => this.updating())
			.catch(() => alert('Не удалось удалить комментарий, попробуйте еще раз'));
		}

		updating() {
            if (!this.isUpdate){
                let updatingEvent = new Event('update');
                document.querySelector('.content-wall').dispatchEvent(updatingEvent);
                this.isUpdate = true;
            }
        }

        _getAvatar(){
			if (this.comment.avatar !== 'undefined'){
				return `<img src="${new URL (this.comment.avatar, tensor)}" title="Фото автора комментария" alt="${this.comment.name}" class="${this.useCSS.postAva}">`;
			}
			else {
				return `<p class="${this.useCSS.postCap}" title="Фото автора комментария"></p>`;
			}
			
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

    }
    return Comment;
});