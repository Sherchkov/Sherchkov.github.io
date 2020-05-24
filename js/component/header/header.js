define(['base/component', "base/helpers", 'css!component/header/header'], function (Component) {
	'use strict';

	class Header extends Component {
	    render(options) {	    	
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
		              <span class="header__status">В сети</span>
		            </div>
			    <div class="header__centre"></div>
		            <div class="header__right">
		              <div class="header__edit" data-name="edit">Редактировать</div>
		              <div class="header__photo">
		                <img class="header__img modalPhoto" src="${this.avatar}" alt="${options.data.name}" title="${options.data.name}">
		              </div>
		              <div class="header-menu">
		              	<img class="header-menu_icon" src="img/icons/svg/dots.svg" alt="Меню" title="Меню">
						<div class="header-menu__list">
						  <div class="header-menu__item header-menu_logout">Выход</div>
						  <div class="header-menu__item header-menu_theme" night="${this.theme_night}">${this.theme_night === 'false' ? 'Ночной режим' : 'Обычный режим'}</div>
						  ${this.options.mobile === true ? '' : `<div class="header-menu__item header-menu_changePosition" position="${this.mirror}">Поменять расположение</div>`}
						</div>	
		              </div> 
		            </div>
		        </header>
		      `;
	    }

	    afterMount() {
			this._logout = this.getContainer().querySelector('.header-menu_logout');
			this._theme = this.getContainer().querySelector('.header-menu_theme');
			this._changePositon = this.getContainer().querySelector('.header-menu_changePosition');
			this.subscribeTo(this._logout, 'click', this.logout.bind(this));
			this.subscribeTo(this._theme, 'click', this.theme.bind(this));
	        this.subscribeTo(this.getContainer(), 'click', this.onSwitchData.bind(this));
	        this.clickHandler = this.clickOverMenu.bind(this);

	        if (this.options.mobile !== true) {
	        	this.subscribeTo(this._changePositon, 'click', this.changePositon.bind(this));
	        }
	    }

	    //переключение Редактировать/Сохранить
	    onSwitchData(event){
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
	            
	        }else if ( element.classList.contains('header-menu_icon') ) {
	        	this.showMenu();
	        }
	    }


	    /**
	       * Изменяет блок content-data для редактирования
	       * @param {element} кнопка Редактировать/Сохранить
	      */
	    onEditData(element){
	        element.innerText = 'Сохранить';
	        element.setAttribute('data-name', 'save');
	        //textarea
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        if ( !aboutMe.innerHTML ) {
	            aboutMe.style.maxHeight = '76px';
	            aboutMe.style.padding = '5px 3px';
	            aboutMe.innerHTML = '<br>';
	        }
	        aboutMe.style.overflow = 'auto';
	        aboutMe.setAttribute('contenteditable', 'true');
	        aboutMe.classList.add('content-data-params__active');
	        // устраняем баг пропадания курсора
	        aboutMe.addEventListener('click', this.setCursorPosition);
	        //date
	        let date = document.querySelector('.content-data-params_birthday');
	        date.classList.add('content-data-params_birthdayEdit');
	        // поля input
	        let params = document.querySelectorAll('.content-data-params__input');
	        params.forEach((el) => {
	           el.classList.add('content-data-params__active');
	           el.removeAttribute('disabled');
	        });
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
	        // about
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        let updateText = '';
	        
	        if (aboutMe.innerHTML === '') {
	            aboutMe.style.maxHeight = '0px';
	            aboutMe.style.padding = 0;
	        }else{
	            updateText = renderTextNormal(aboutMe.innerText);
	            aboutMe.innerText = updateText;
	        }
	        aboutMe.title = updateText;
	        aboutMe.removeEventListener('click', this.setCursorPosition);
	        //отправляем на сервер
	        let params = document.querySelectorAll('.content-data-params__input');
	        this.data = {
	        	birth_date : dateValue,
	        	city : params[0].value,
	        	education : params[2].value,
	        	family_state : params[1].value,
	        	job : params[3].value,
	        	name : this.data.name,
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
	        //textarea
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        aboutMe.scrollTop = 0;
	        aboutMe.style.overflow = 'hidden';
	        aboutMe.classList.remove('content-data-params__active');
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
	   			document.querySelector('.content_data__aboutMe').style.color = '#bfbfbf';
	   			document.querySelector('.content-data-params__date').classList.add('content-data-params__date_night');
	   			document.querySelectorAll('.content-data-params__input').forEach(block => block.style.color = '#bfbfbf');   
	   			document.querySelectorAll('.link-element__title').forEach(block => block.style.color = '#bfbfbf'); 
	   			this._theme.innerText = 'Обычный режим';
	   			this._theme.setAttribute('night', 'true'); 
	   			this.data.theme_night = 'true';
	   			this.upload();
	   		}else{
	   			this.exitNightTheme();
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
	   				this.data.mirror = 'true';
	   				this.upload();
	   			}else{
	   				this.positionDefault();
	   				this.data.mirror = 'false';
	   				this.upload();
	   			}
	   			this.hideMenu();
	   		}
	   	}

	   	positionDefault(){
	   		document.querySelector('.Content').classList.remove('content_left');
	   		this._changePositon.setAttribute('position', 'false');
	   	}

	   	//выход
		logout() {
			fetch('https://tensor-school.herokuapp.com/user/logout', {
				'method' : 'GET',
				credentials: 'include'
			}).then(response => {
				if (response.status == '200') {
					this.hideMenu();
					this.positionDefault();
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
