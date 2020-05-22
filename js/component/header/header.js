define(['base/component', "base/helpers", 'css!component/header/header'], function (Component) {
	'use strict';

	class Header extends Component {
	    render(options) {
	    	this.data = options.data;
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
						</div>	
		              </div> 
		            </div>
		        </header>
		      `;
	    }

	    afterMount() {
			this._logout = this.getContainer().querySelector('.header-menu_logout');
			this.subscribeTo(this._logout, 'click', this.logout.bind(this));
	        this.subscribeTo(this.getContainer(), 'click', this.onSwitchData.bind(this));
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
	        	this.getContainer().querySelector('.header-menu__list').classList.toggle('header-menu__list_active');
	        }
	    }


	    /**
	       * Изменяет блок content-data для редактирования
	       * @param {element} кнопка Редактировать/Сохранить
	      */
	    onEditData(element){
	        element.innerText = 'Сохранить';
	        element.setAttribute("data-name", 'save');
	        //textarea
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        if ( !aboutMe.innerHTML ) {
	            aboutMe.style.maxHeight = '76px';
	            aboutMe.style.padding = '5px 3px';
	            aboutMe.innerHTML = '<br>';
	        }
	        aboutMe.style.overflow = 'auto';
	        aboutMe.setAttribute("contenteditable", "true");
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
	           el.removeAttribute("disabled");
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
	        aboutMe.setAttribute("title", updateText);
	        aboutMe.removeEventListener('click', this.setCursorPosition);
	        //отправляем на сервер
	        this.upload(dateValue, updateText);
	        this.renderSaveData(element,newDate,symbol);
	    }


	    upload(date, updateText){
	    	let params = document.querySelectorAll('.content-data-params__input');
	    	let data = {
	    		birth_date : date,
	    		city : params[0].value,
	    		education : params[2].value,
	    		family_state : params[1].value,
	    		job : params[3].value,
	    		name : this.data.name,
	    		about_self : updateText
	    	}
	    	fetch(globalUrlServer + '/user/update', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body : JSON.stringify(data),
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
	    renderSaveData(element,newDate,symbol){
	        element.innerText = 'Редактировать';
	        element.setAttribute("data-name", 'edit');
	        //textarea
	        let aboutMe = document.querySelector('.content_data__aboutMe');
	        aboutMe.scrollTop = 0;
	        aboutMe.style.overflow = 'hidden';
	        aboutMe.classList.remove('content-data-params__active');
	        aboutMe.removeAttribute("contenteditable");
	        //date
	        document.querySelector('.content-data-params__birthday').innerText = newDate;
	        let horoscope = document.querySelector('.content-data-params__horoscope');
	        horoscope.setAttribute('src', 'img/icons/horoscope/'+symbol[0]+'.png');
	        horoscope.setAttribute('alt', symbol[1]);
	        horoscope.setAttribute('title', symbol[1]);

	        
	        let date = document.querySelector('.content-data-params_birthday');
	        date.classList.remove('content-data-params_birthdayEdit');
	        // поля input
	        let params = document.querySelectorAll('.content-data-params__input');
	        params.forEach((el) => {
	            el.setAttribute("title", el.value);
	            el.classList.remove('content-data-params__active');
	            el.setAttribute("disabled", "disabled");
	        });
	    }

	    //Показывает или скрывает кнопку меню(выхода)
	   	showMenu(){
	   		this.getContainer().querySelector('.header-menu__list').classList.toggle('header-menu__list_active');
	   	} 

	   	//

		logout() {
			fetch('https://tensor-school.herokuapp.com/user/logout', {
				'method' : 'GET',
				credentials: 'include'
			}).then(response => {
				if (response.status == '200') {
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
