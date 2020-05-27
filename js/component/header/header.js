define(['base/component', "base/helpers", 'css!component/header/header'], function (Component) {
	'use strict';

	class Header extends Component {
	    render(options) {	    	
	    	this.options = options;
	    	this.data = options.data;
	    	this.theme_night = this.data.theme_night || 'false';
	    	this.mirror =  this.data.mirror || 'false';
	    	
    		if (options.computed_data.photo_ref) {
    			this.avatar = globalUrlServer + options.computed_data.photo_ref;
    		}else{
    			this.avatar = 'img/avatar/avatar_default.png';
    		}

	        return `
		        <header class="MainPage__header header">
		            <div class="header__left">
		              ${this.options.id !== user_id ? `
			           	  <div class="header__home" title="Вернуться на свою страницу">
			           	  	<svg class="header__home_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;"><polygon points="204,471.75 204,318.75 306,318.75 306,471.75 433.5,471.75 433.5,267.75 510,267.75 255,38.25 0,267.75 76.5,267.75 76.5,471.75 "/></svg>
			           	  </div>
			           	  ` : ''}
		              <span class="header__status"></span>
		            </div>
			   		<div class="header__centre"></div>
		            <div class="header__right">
			            ${this.options.id === user_id ? '<div class="header__edit" data-name="edit">Редактировать</div>' : ''}
			              <div class="header__photo">
			                <img class="header__img modalPhoto" src="${this.avatar}" alt="${options.data.name}" title="${options.data.name}">
			              </div>
			              ${this.options.id === user_id ? `
				              <div class="header-menu">
				              	<img class="header-menu_icon" src="img/icons/svg/dots.svg" alt="Меню" title="Меню">
								<div class="header-menu__list">
								  <div class="header-menu__item header-menu_logout">Выход</div>
								  <div class="header-menu__item header-menu_theme" night="${this.theme_night}">${this.theme_night === 'false' ? 'Ночной режим' : 'Обычный режим'}</div>
								  ${this.options.mobile === true ? '' : `<div class="header-menu__item header-menu_changePosition" position="${this.mirror}">Поменять расположение</div>`}
								</div>	
				              </div>` : '<div class="header__user"></div>'} 
			        </div>
		        </header>
		      `;
	    }

	    afterMount() {
	    	this.getContainer().querySelector('.header__status').innerText = this.renderStatus(this.options.computed_data.last_activity);
	    	if (this.options.id === user_id) {
				this._logout = this.getContainer().querySelector('.header-menu_logout');
				this._theme = this.getContainer().querySelector('.header-menu_theme');
				this._changePositon = this.getContainer().querySelector('.header-menu_changePosition');
				this.subscribeTo(this._logout, 'click', this.logout.bind(this));
				this.subscribeTo(this._theme, 'click', this.theme.bind(this));
		        this.clickHandler = this.clickOverMenu.bind(this);
		        if (this.options.mobile !== true) {
		        	this.subscribeTo(this._changePositon, 'click', this.changePositon.bind(this));
		        }
	    	}else{
	    		this.determineUser();
	    	}
			this.subscribeTo(this.getContainer(), 'click', this.clickController.bind(this));
	    }

	    renderStatus(last_activity){
			if (this.options.id === user_id) {
	    		return 'В сети';
	    	}
	      	//перевод даты в формат в unix
	      	last_activity = Date.parse(last_activity);
	      	last_activity = last_activity.toString().slice(0, -3);

	      	//дата UNIX сейчас
	      	let time = Date.now();
	      	let currentTimeZone = new Date().getTimezoneOffset();
	      	time = time.toString().slice(0, -3);
	      	

	      	//Разница в секунадах
	      	let dtime = time - last_activity + currentTimeZone*60 + 1;

	      	if (dtime < 300) {
	      		return 'В сети';
	      	}

	      	dtime -= 300;

	      	if (dtime < 60) {
	      	  return 'Был(а) '+dtime+' секунд назад';
	      	}

	      	if (dtime >= 60 && dtime < 3600) {
	      	  dtime = Math.trunc(dtime/60);
	      	  return 'Был(а) '+dtime+' минут назад';
	      	}

	      	if (dtime >= 3600 && dtime < 86400){
	      	  dtime = Math.trunc(dtime/60/60);

	      	  if (dtime == 1 || dtime == 21) {
	      	    return 'Был(а) '+dtime+' час назад';
	      	  }
	      	  if (dtime == 2 || dtime == 3 || dtime == 4 || dtime == 22 || dtime == 24)  {
	      	    return 'Был(а) '+dtime+' часа назад';
	      	  }
	      	  return 'Был(а) '+dtime+' часов назад';
	      	}

	      	// если больше 24 часов назад, то выводим время последняго визита
	      	let date = new Date(last_activity*1000);

	      	let minute = date.getMinutes();
	      	minute = minute.toString();
	      	if (minute.length == 1) {
	      	  minute = '0' + minute;
	      	}

	      	let day = date.getDate();
	      	day = day.toString();
	      	if (day.length == 1) {
	      	  day = '0'+day;
	      	}

	      	let month = date.getMonth() + 1; 
	      	month = month.toString();
	      	if (month.length == 1) {
	      	  month = '0'+month;
	      	}

	      	date = day + '.' + month + '.' + date.getFullYear() + ' '+date.getHours()+':'+minute;
	      	return 'Был(а) в сети: '+date;
	    }

	    determineUser(){
	    	let headerUser = this.getContainer().querySelector('.header__user');
	    	if (userParams.connect) {
	    		if (userParams.connect.myFriends) {
	    			for (let user of userParams.connect.myFriends){
	    				if (Number(user.user_from) === this.options.id || Number(user.user_to) === this.options.id) {
	    					return this.determineUserIcon('delete', 'Удалить из друзей', 1, 'minus');
	    				}
	    			}
	    		}
	    		if (userParams.connect.myRequests) {
	    			for (let user of userParams.connect.myRequests){
	    				if (Number(user.user_from) === this.options.id || Number(user.user_to) === this.options.id) {
	    					return this.determineUserIcon('delete', 'Удалить из подписек', 2, 'minus');
	    				}
	    			}
	    			
	    		}
	    		if (userParams.connect.mySubscribers) {
	    			for (let user of userParams.connect.mySubscribers){
	    				if (Number(user.user_from) === this.options.id || Number(user.user_to) === this.options.id) {
	    					return this.determineUserIcon('add', 'Добавить подписчика в друзья', 3, 'plus');
	    				}
	    			}
	    		}
	    		return this.determineUserIcon('add', 'Добавить в друзья', 4, 'plus');
	    	}else{
	    		return this.determineUserIcon('add', 'Добавить в друзья', 4, 'plus');
	    	}
	    }

	    determineUserIcon(action, title, titleNumber, icon){
	    	let headerUser = this.getContainer().querySelector('.header__user');
	    	headerUser.title = title;
	    	headerUser.setAttribute('action', action);
	    	headerUser.setAttribute('titleNumber', titleNumber);
	    	if (icon === 'plus') {
	    		headerUser.innerHTML = '<svg style="enable-background:new 0 0 15 15;" class="header__user_svg" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="M7.5,0C3.364,0,0,3.364,0,7.5S3.364,15,7.5,15S15,11.636,15,7.5S11.636,0,7.5,0z M7.5,14C3.916,14,1,11.084,1,7.5  S3.916,1,7.5,1S14,3.916,14,7.5S11.084,14,7.5,14z"/><polygon points="8,3.5 7,3.5 7,7 3.5,7 3.5,8 7,8 7,11.5 8,11.5 8,8 11.5,8 11.5,7 8,7 "/></svg>';
	    	}else if (icon === 'minus'){
	    		headerUser.innerHTML = '<svg enable-background="new 0 0 256 256" class="header__user_svg" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M178.666,134.4H77.331c-3.534,0-6.4-2.866-6.4-6.4s2.866-6.4,6.4-6.4h101.335c3.533,0,6.399,2.866,6.399,6.4  S182.199,134.4,178.666,134.4z M256,128C256,57.42,198.58,0,128,0C57.42,0,0,57.42,0,128c0,70.58,57.42,128,128,128  C198.58,256,256,198.58,256,128z M243.199,128c0,63.521-51.678,115.2-115.199,115.2c-63.522,0-115.2-51.679-115.2-115.2  C12.8,64.478,64.478,12.8,128,12.8C191.521,12.8,243.199,64.478,243.199,128z"/></svg>';
	    	}
	    }



	    //переключение Редактировать/Сохранить
	    clickController(event){
	        let element = event.target;
	        if (element.classList.contains('header__edit')) {
	            let name = element.getAttribute("data-name");
	            if (name === 'edit') {
	                this.onEditData(element);
	            }else if(name === 'save'){
	                this.onSaveData(element);
	            }
	        }else if ( element.classList.contains('modalPhoto') ) {
		    	require(['modal/ActionModal', 'modal/ModalPhoto'], function(ActionModal, ModalPhoto){ 
	        		new ActionModal({
	        		    children : ModalPhoto,
	        		    src : element.getAttribute('src'),
	        		    title : element.getAttribute('title'),
	        		    alt : element.getAttribute('title') || element.parentElement.getAttribute('title') || ""
	        		});
	        	});
	            
	        }else if (element.classList.contains('header-menu_icon')) {
	        	this.showMenu();
	        }else if (element.closest('.header__home')) {
	        	this.goHome();
	        }else if (element.closest('.header__user')) {
	        	if (element.closest('.header__user').getAttribute('action') === 'add') {
	        		this.addFriend(element.closest('.header__user').getAttribute('titleNumber'));
	        	}else if (element.closest('.header__user').getAttribute('action') === 'delete') {
	        		this.deleteFriend(element.closest('.header__user').getAttribute('titleNumber'));
	        	}
	        }
	    }

	    addFriend(lastTitle){
	    	let urlencoded = new URLSearchParams();
	    	urlencoded.append("user", this.options.id);
	    	urlencoded.append("link_type", "friend");
	    	fetch(globalUrlServer + '/user_link/create', {
	    	  method: 'POST',
	    	  mode: 'cors',
	    	    headers: {"Content-Type": "application/x-www-form-urlencoded"},
	    	    body: urlencoded,
	    	    "credentials" : "include"
	    	})
	    	.then(response => {
	    		if (response.ok) {
	    			return response.json();
	    		}else{
	    			alert('Не удалось добавить в друзья');
	    		}
	    	})
	    	.then(result => {
	    		this.changeUser('add', lastTitle);
	    	})
	    	.catch(error => console.log('error', error));
	    }

	    deleteFriend(lastTitle){
	    	let urlencoded = new URLSearchParams();
	    	urlencoded.append("user", this.options.id);

	    	fetch(globalUrlServer + '/user_link/delete', {
	    	  method: 'POST',
	    	  mode: 'cors',
	    	    headers: {"Content-Type": "application/x-www-form-urlencoded"},
	    	    body: urlencoded,
	    	    "credentials" : "include"
	    	})
	    	.then(response => {
	    		if (response.ok) {
	    			this.changeUser('delete', lastTitle);
	    		}else{
	    			alert('Не удалось удалить из друзей');
	    		}
	    	})
	    	.catch(error => console.log('error', error));
	    }

	    changeUser(lastAction, lastTitle){
	    	let text = ''
	    	let newTitle = '';
	    	let newtitleNumber = '';
	    	let action = ''
	    	let svg = '';
	    	if (Number(lastTitle) === 1) {
	    		text = 'Пользователь добавлен в подписчики';
	    		newTitle = 'Добавить подписчика в друзья';
	    		newtitleNumber = 3;
	    	}else if (Number(lastTitle) === 2) {
	    		text = 'Вы удалили подписку на пользователя';
	    		newTitle = 'Добавить в друзья';
	    		newtitleNumber = 4;
	    	}else if (Number(lastTitle) === 3) {
	    		text = 'Пользователь добавлен к вам в друзья';
	    		newTitle = 'Удалить из друзей';
	    		newtitleNumber = 1;
	    	}else if (Number(lastTitle) === 4) {
	    		text = 'Вы подписались на пользователя';
	    		newTitle = 'Удалить из подписек';
	    		newtitleNumber = 2;
	    	}

	    	if (lastAction === 'delete') {
	    		action = 'add';
	    		svg = 'plus';
	    	}else if (lastAction === 'add') {
	    		action = 'delete';
	    		svg = 'minus';
	    	}


	    	this.determineUserIcon(action, newTitle, newtitleNumber, svg);
	    	require(['modal/ActionModal', 'modal/ModalWarning'], function(ActionModal, ModalWarning){ 
        		new ActionModal({
        			theme : 'white',
        			style : `top:30%; height:auto; max-width:90%; width: 500px; background:transparent;`,
	                text : text,
	                children : ModalWarning,
	                canselButton : 'Закрыть'
	            });
        	});
	    }
	    /**
	       * Изменяет блок content-data для редактирования
	       * @param {element} кнопка Редактировать/Сохранить
	      */
	    onEditData(element){
	    	require(['jquery', 'emoji', 'emojiIcons'], function(){ 
	    		$('.emojis-wysiwyg').emojiarea({wysiwyg: true, button: '.aboutMe__emojiButton'});
	    	});
	    	/*;*/
	        element.innerText = 'Сохранить';
	        element.setAttribute('data-name', 'save');
			//textarea

			let name = document.querySelector('.content-data__name');
				name.style.overflow = 'auto';
				name.setAttribute('contenteditable', 'true');
				name.classList.add('content-data-params__active');

	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        let emojiButton = document.querySelector('.aboutMe__emojiButton');
	        aboutMe.classList.add('content_data__aboutMe_active');
	        if ( !aboutMe.innerHTML ) {
	            aboutMe.innerHTML = '<br>';
	        }
	        emojiButton.style.display = 'block';

	        //Приводим поля Contenteditable в состоянии textaera
	       	this.addEventContenteditable(name);
	       	this.addEventContenteditable(aboutMe);

	        /*aboutMe.style.overflow = 'auto';*/
	        aboutMe.setAttribute('contenteditable', 'true');
	        aboutMe.classList.add('content-data-params__active');

	        let date = document.querySelector('.content-data-params_birthday');
	        date.classList.add('content-data-params_birthdayEdit');
	        // поля input
	        let params = document.querySelectorAll('.content-data-params__input');
	        params.forEach((el) => {
	           el.classList.add('content-data-params__active');
	           el.removeAttribute('disabled');
	        });
	    }

	    //Приводит поля Contenteditable в состоянии textaera
	    addEventContenteditable(element){
	    	element.addEventListener('click', this.setCursorPosition);
	    	['dragenter', 'dragover', 'dragleave', 'drop', 'paste'].forEach(eventName => {
  				element.addEventListener(eventName, this.preventDefaults, false);
			})
	    	element.addEventListener('paste', this.pasteInContenteditable.bind(this));
	    }

	    removeEventContenteditable(element){
	    	element.removeEventListener('click', this.setCursorPosition);
	    	['dragenter', 'dragover', 'dragleave', 'drop', 'paste'].forEach(eventName => {

  				element.removeEventListener(eventName, this.preventDefaults, false);
			})
	    	element.removeEventListener('paste', this.pasteInContenteditable.bind(this));
	    }

	    preventDefaults(event){
	      event.preventDefault();
	      event.stopPropagation();
	    }

	    //Приводит в нормальный вид при вставке изображения
	    pasteInContenteditable(event){
	    	let pastedData = event.clipboardData.getData('text/plain');
	    	this.insertTextAtCursor(pastedData);
	    }

	    //Вставляет текст где курсор
	    insertTextAtCursor(text) {
	        if (window.getSelection) {
	            let sel = window.getSelection();
	            if (sel.getRangeAt && sel.rangeCount) {
	                let range = sel.getRangeAt(0);
	                range.deleteContents();
	                range.insertNode( document.createTextNode(text) );
	            }
	        } else if (document.selection && document.selection.createRange) {
	            document.selection.createRange().text = text;
	        }
	    }

	    /**
	       * установка курсора при клике в блоке contenteditable = "true" при пустом контенте
	       * @param {event} событие для установки курсора
	      */
	    setCursorPosition(event){
	        if ( !event.target.innerHTML ) {
	            event.target.innerHTML = '<br>';
	        }
	        return false;
	    }

	    /**
	       * Сохранение новых данных в блоке content-data
	       * @param {element} элемент с классом content-data
	      */
	    onSaveData(element){
	        // Дата рождения
	        let date = document.querySelector('.content-data-params__date');
	        let dateValue = date.value;
	        let newDate = renderBirthday(dateValue);
	        let symbol = renderHoroscope(dateValue);
	        if (newDate === 'error' || symbol === 'error') {
	            alert('Неверно указана дата рождения');
	            return false;
			}
			//name
			let name = document.querySelector('.content-data__name');
			let updateName = '';
			updateName = renderTextNormal(name.innerText);
			if (!updateName.trim()) {
				alert('Введите имя и фамилию');
				return;
			}

            name.innerText = updateName;
			name.title = updateName;
			
	        // about
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        let aboutMeText = document.querySelector('.aboutMe__textarea');
	        let updateText = renderTextNormal(aboutMeText.value);
	       	        
	        let emojiButton = document.querySelector('.aboutMe__emojiButton');
	        emojiButton.style.display = 'none';
	        aboutMe.innerHTML = renderEmoji(updateText);
	        aboutMeText.value = updateText;
	        aboutMe.title = renderTextNormal(deleteEmojiInTitle(updateText));

	        this.removeEventContenteditable(name);
	       	this.removeEventContenteditable(aboutMe);

	        //отправляем на сервер
			let params = document.querySelectorAll('.content-data-params__input');	
			params.forEach((el) => {
	        	el.value = el.value.trim();
			});
	        this.data = {
				name : updateName,
	        	birth_date : dateValue,
	        	city : params[0].value || 'скрыто',
	        	education : params[2].value || 'скрыто',
	        	family_state : params[1].value || 'скрыто',
	        	job : params[3].value || 'скрыто',
	        	about_self : updateText,
	        	theme_night : this.theme_night,
	        	mirror : this.mirror
	        }
			this.upload();
	        this.renderSaveData(element,newDate,symbol,params);
	    }


	    upload(){
	    	fetch(globalUrlServer + '/user/update', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body : JSON.stringify(this.data),
                credentials: 'include'
            })
            .then(response => {
            	if ( !response.ok ) {
                    alert('Не получилось загрузить данные');
                }
            })
            .catch(error => {
            	alert('Не получилось загрузить данные');
                console.log('error', error);
            }); 
	    }

	    /**
	       * Отображает новые данные в блоке content-data
	       * @param {elemet} кнопка Редактировать/Сохранить
	       * @param {newDate} дата рождения
	       * @param {symbol} знак зодиака
	      */
	    renderSaveData(element,newDate,symbol, params){
	        element.innerText = 'Редактировать';
			element.setAttribute('data-name', 'edit');
			let name = document.querySelector('.content-data__name');
				name.scrollTop = 0;
				name.style.overflow = 'hidden';
				name.classList.remove('content-data-params__active');
				name.removeAttribute('contenteditable');
	        //textarea
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        aboutMe.scrollTop = 0;
	        aboutMe.classList.remove('content-data-params__active');
	        aboutMe.classList.remove('content_data__aboutMe_active');
	        aboutMe.removeAttribute('contenteditable');
	        //date
	        document.querySelector('.content-data-params__birthday').innerText = newDate;
	        let horoscope = document.querySelector('.content-data-params__horoscope');
	        horoscope.setAttribute('src', 'img/icons/horoscope/'+symbol[0]+'.png');
	        horoscope.setAttribute('alt', symbol[1]);
	        horoscope.setAttribute('title', symbol[1]);

	        let date = document.querySelector('.content-data-params_birthday');
	        date.classList.remove('content-data-params_birthdayEdit');
	        // поля input
	        params.forEach((el) => {
	        	if (!el.value) {
	        		el.value = 'Скрыто';
	        	}
	            el.title = el.value;    
	            el.classList.remove('content-data-params__active');
	            el.setAttribute('disabled', 'disabled');
	        });
	    }

	    //Показывает или скрывает кнопку меню(выхода)
	   	showMenu(){
	   		if (!this.getContainer().querySelector('.header-menu__list').classList.contains('header-menu__list_active')) {
	   			this.getContainer().querySelector('.header-menu__list').classList.add('header-menu__list_active');
	   			document.addEventListener('mousedown', this.clickHandler);
	   		}else{
	   			this.getContainer().querySelector('.header-menu__list').classList.remove('header-menu__list_active');
	   		}
	   		
	   	} 

	   	//Клик за пределами меню
	   	clickOverMenu(event){
	   		if (!event.target.closest('.header-menu__list')) {
	   			this.hideMenu();
	   		}
	   	}

	   	//Выход меню
	   	hideMenu(){
	   		this.getContainer().querySelector('.header-menu__list').classList.remove('header-menu__list_active');
	   		document.removeEventListener('mousedown', this.clickHandler);
	   	}

	   	theme(){
	   		if (this._theme.getAttribute('night') === 'false') {
	   			document.querySelector('body').style.background = '#35363a';
	   			document.querySelectorAll('.content_default').forEach(block => {
	   				block.style.background = '#595a5c';
	   				block.style.color = '#bfbfbf';
	   			});  
	   			document.querySelector('.content-data__name').style.color = '#bfbfbf'; 
	   			document.querySelector('.content_data__aboutMe').style.color = '#bfbfbf';
	   			document.querySelector('.content-data-params__date').classList.add('content-data-params__date_night');
	   			document.querySelectorAll('.content-data-params__input').forEach(block => block.style.color = '#bfbfbf');   
	   			document.querySelectorAll('.link-element__title').forEach(block => block.style.color = '#bfbfbf'); 
	   			userParams.theme_night = 'true';
	   			this._theme.innerText = 'Обычный режим';
	   			this._theme.setAttribute('night', 'true'); 
	   			this.data.theme_night = 'true';
	   			this.upload();
	   		}else{
	   			this.exitNightTheme();
	   			userParams.theme_night = 'false';
	   			this.data.theme_night = 'false';
	   			this.upload();
	   		}
	   		this.hideMenu();
	   	}

	   	exitNightTheme(){
	   		document.querySelector('body').style.background = '';
	   		document.querySelectorAll('.content_default').forEach(block => {
	   			block.style.background = '';
	   			block.style.color = '';
	   		});   
	   		document.querySelector('.content-data__name').style.color = ''; 
	   		document.querySelector('.content_data__aboutMe').style.color = '';
	   		document.querySelector('.content-data-params__date').classList.remove('content-data-params__date_night');
	   		document.querySelectorAll('.content-data-params__input').forEach(block => block.style.color = '');   
	   		document.querySelectorAll('.link-element__title').forEach(block => block.style.color = '');
	   		this._theme.innerText = 'Ночной режим';
	   		this._theme.setAttribute('night', 'false'); 

	   	}

	   	changePositon(){
	   		if (!document.querySelector('.MainPageMobile')) {
	   			if (this._changePositon.getAttribute('position') === 'false') {
	   				document.querySelector('.Content').classList.add('content_left');
	   				this._changePositon.setAttribute('position', 'true');
	   				userParams.mirror = 'true';
	   				this.data.mirror = 'true';
	   				this.upload();
	   			}else{
	   				this.positionDefault();
	   				this.data.mirror = 'false';
	   				userParams.mirror = 'false';
	   				this.upload();
	   			}
	   			this.hideMenu();
	   		}
	   	}

	   	positionDefault(){
	   		document.querySelector('.Content').classList.remove('content_left');
	   		this._changePositon.setAttribute('position', 'false');
	   	}

	   	//Вернуться на домашнюю страницу
	   	goHome(){
	   		fetch("https://tensor-school.herokuapp.com/user/current", {
	   			credentials: 'include'
	   		})
	   		.then(response => {
	   			if ( response.ok ) {
	   			    return response.json();  
	   			}else{
	   				page.unmount();
					if (document.body.innerHtml) {
	   					document.body.innerHtml = '';
	   				}
	   				require(["page/Authorization"], function(Authorization){
	   					page = factory.create(Authorization, {});
	   					page.mount(document.body);
	   				});
	   			  	return response.error();
	   			}
	   		})
	   		.then(result => {
	   			page.unmount();
				if (document.body.innerHtml) {
	   				document.body.innerHtml = '';
	   			}
	   			if ( window.innerWidth > 800 ) {
	   				require(["page/profile"], function (Profile) {
	   					page = factory.create(Profile, result);
	   					page.mount(document.body);
	   				});
	   			} else {
	   				require(["page/ProfileMobile"], function(profileMobile){
	   					page = factory.create(profileMobile, result);
	   					page.mount(document.body);
	   				});
	   			}
	   		})
	   		.catch(error => console.log('error', error));
	   	}

	   	//выход
		logout() {
			fetch('https://tensor-school.herokuapp.com/user/logout', {
				'method' : 'GET',
				credentials: 'include'
			}).then(response => {
				if (response.status == '200') {
					this.hideMenu();
					userParams = {};
					if (this._theme.getAttribute('night') === 'true') {
						this.exitNightTheme();
					}
					page.unmount();
					globalSliderPhotos = [];
					require(["page/Authorization"], function(authorization){
						page = factory.create(authorization, {});
						page.mount(document.body);
					});
				}
			})
			.catch(error => console.log('error', error));
		}
	}

	return Header;
});
