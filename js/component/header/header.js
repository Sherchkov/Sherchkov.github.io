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
			              </div>` : ''} 
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
	        }
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
	        aboutMe.title = updateText;

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
            	console.log("response", response);
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
	   				require(["page/Authorization"], function(Authorization){
	   					page = factory.create(Authorization, {});
	   					page.mount(document.body);
	   				});
	   			  	return response.error();
	   			}
	   		})
	   		.then(result => {
	   			page.unmount();
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
