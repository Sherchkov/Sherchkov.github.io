// eslint-disable-next-line no-undef
define(['base/component', 'server/json', 'css!component/wall/wall.min'], function (Component, json) {
	'use strict';
/*после переделки структуры удалить*/
	let wall = json.wall;

	class Wall extends Component {
		constructor() {
			super();
			this.wall = json.wall;
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
			let posts = '';
			
			for (let i = 0; i < wall.length; i++){
				let post = wall[i];
				let images = '';
				let date = '';
				if (post.img.length) {
					for (let j = 0; j < post.img.length; j++){
						images += `<img src="${post.img[j]}" alt="картинка" class="post-img__picture">`;
					}
				}
				let rubbish = (post.dalete) ? '<div class="post-data__delete" title="удалить пост"><img src="img/icons/svg/rubbish.svg" alt="Удалить"></div>' : '';
				
				date = this._defineDate(post.date);

				posts += ` 
					<div class="post">
						<div class="post-data">
							<a href="${post.href}" class="post-data__link" target="_blank">
								<img src="${post.avatar}" alt="${post.name}" class="post-data__img">
							</a>
							<a href="#" target="_blank" class="post-data__name">${ post.family + post.name }</a>
							<span class="post-data__date">${date}</span>
							${rubbish}
						</div>
						<div class="post-text">${post.text}</div>
						<div class="post-img">
							${images}
						</div>
					</div>
	            `;

			}
			

			return `
				<div class="content-wall content_default">
					${posts}
				</div>`;
		}
	}



	return Wall;
});  
