	define(['base/component', "component/action/dataPerson", 'server/json', "base/helpers", 'css!component/information/information.min'], function (Component, dataPerson, json) {
	'use strict';

	let data = json.information;

	class Information extends Component {

	    render() {
	        let data = json.information;
	        return `
	            <div class="content-data content_default">
	              <h1 class="content-data__name">${ data.family + ' ' + data.name }</h1>
	                <div class="content_data__aboutMe" ondragenter="return false" ondragleave="return false" ondragover="return false" ondrop="return false" title="${data.about}">${data.about}</div>
	              <div class="content-data-params">
	                <div class="content-data-params__key">День рождения</div>
	                <div class="content-data-params__value content-data-params_birthday">  
	                  <input type="date" value="${data.birthday}" class="content-data-params__date">
	                  <span class="content-data-params__birthday">${ renderBirthday(data.birthday) }</span>
	                  <img class="content-data-params__horoscope" src="img/icons/horoscope/aries.png" alt="Овен" title="Овен">
	                </div>
	                <div class="content-data-params__key" title="Город">Город</div>
	                <div class="content-data-params__value" title="${data.city}">
	                  <input class="content-data-params__input" type="text" value="${data.city}"  maxlength="50" disabled>
	                </div>
	                <div class="content-data-params__key" title="Семейное положение">Семейное положение</div>
	                <div class="content-data-params__value" title="${data.family_status}">
	                  <input class="content-data-params__input" type="text" value="${data.family_status}" maxlength="100" disabled>
	                </div>
	              </div>
	              <div class="content-data-details" data-switch="off">Подробнее обо мне</div>
	              <div class="content-data-params content-data-params_more">
	                <div class="content-data-params__key" title="Образование">Образование</div>
	                <div class="content-data-params__value" title="${data.education}">
	                  <input class="content-data-params__input" type="text" value="${data.education}" maxlength="100" disabled>
	                </div>
	                <div class="content-data-params__key" title="Место работы">Место работы</div>
	                <div class="content-data-params__value" title="${data.job}">
	                  <input class="content-data-params__input" type="text" maxlength="100" value="${data.job}" disabled>
	                </div>
	              </div>
	            </div>
	        `;
	    }


	    afterMount() {
			dataPerson();
	        this.subscribeTo(this.getContainer(), 'click', this.onSwitchDetails.bind(this));
	    }
	    /**
	       * Отпределение переключателя "Подробнее обо мне"/"Скрыть подробности"
	       * @param {event} click
	      */
	    onSwitchDetails(event){
	        let element = event.target;
	        if (element.classList.contains('content-data-details')) {
	            let name = element.getAttribute("data-switch"),
	                moreParams = this.getContainer().querySelector('.content-data-params_more');
	            if (name === 'on') {
	                this.onHideDetails(element, moreParams);
	            }else if(name === 'off'){
	                this.onShowDetails(element, moreParams);
	            }

	        }
	    }

	    /**
	       * Действия при закрытии окна "Подробнее обо мне"
	       * @param {element} Кнопка: Подробнее обо мне/Скрыть подробности
	      */
	    onHideDetails(element, moreParams){
	        element.innerText = 'Подробнее обо мне';
	        element.setAttribute("data-switch", 'off');
	        moreParams.classList.remove('content-data-params_moreActive');
	    }

	    /**
	       * Действия при открытии окна "Подробнее обо мне"
	       * @param {element} Кнопка: Подробнее обо мне/Скрыть подробности
	      */
	    onShowDetails(element, moreParams){
	        element.innerText = 'Скрыть подробности';
	        element.setAttribute("data-switch", 'on');
	        moreParams.classList.add('content-data-params_moreActive');
	    }

	}



	return Information;
});
