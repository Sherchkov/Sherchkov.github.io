// eslint-disable-next-line no-undef
define(['base/component', 'css!component/wall/wall'], function (Component) {
	'use strict';

	class Post extends Component{
        constructor(post) {
            super();
            this.post = post;
            this.useCSS = {
				postImage : 'post-img__picture',
				buttonDelete : 'post-data__delete',
				post : 'post',
				postData : 'post-data',
				postLink : 'post-data__link',
				postAva : 'post-data__img',
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

        render() {
            let images = '';
            let date = '';
            let rubbish = '';
            let fullPost ='';

            if (this.post.img.length !== 0){
                for (let image of this.post.img) {
                    images += `<img src="${image}" alt="Картинка записи" class="${this.useCSS.postImage}">`;
                }
            }

            if (this.post.delete) {
                rubbish = `<div class="${this.useCSS.buttonDelete}" title="Удалить запись"><img src="img/icons/svg/rubbish.svg" alt="Удалить"></div>`;
            }

            date = this._defineDate(this.post.date);

            fullPost = ` 
                <div class="${this.useCSS.post}">
                    <div class="${this.useCSS.postData}">
                        <a href="${this.post.href}" class="${this.useCSS.postLink}" target="_blank">
                            <img src="${this.post.avatar}" alt="${this.post.name}" class="${this.useCSS.postAva}">
                        </a>
                        <a href="#" target="_blank" class="${this.useCSS.postMaker}">${this.post.family} ${this.post.name}</a>
                        <span class="${this.useCSS.postDate}">${date}</span>
                        ${rubbish}
                    </div>
                    <div class="${this.useCSS.postText}">${this.post.text}</div>
                    <div class="${this.useCSS.postImgs}">
                        ${images}
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
			} else if (event.target.alt === 'Удалить') {
				this.deletePost();
			}
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

			let postForDelete = event.target;

			while (postForDelete.className !== 'post') {
				postForDelete = postForDelete.parentElement;
			}
			postForDelete.remove();
			postForDelete = null;
		}

	}
	
	return Post;
});  