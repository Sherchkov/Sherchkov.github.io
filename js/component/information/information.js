	define(['base/component', "base/helpers", 'css!component/information/information'], function (Component) {
		'use strict';
	class Information extends Component {
	    render(options) {
			this.data = options.data;
	        return `
	            <div class="content-data content_default">
	              <h1 class="content-data__name">${ this.data.name }</h1>
	                <div class="content_data__aboutMe" ondragenter="return false" ondragleave="return false" ondragover="return false" ondrop="return false" title="${this.data.about_self}">${this.data.about_self}</div>
	              <div class="content-data-params">
	                <div class="content-data-params__key">День рождения</div>
	                <div class="content-data-params__value content-data-params_birthday">
	                  <input type="date" value="${this.data.birth_date}" class="content-data-params__date">
	                  <span class="content-data-params__birthday">${ renderBirthday(this.data.birth_date) }</span>
	                  <img class="content-data-params__horoscope" src="img/icons/horoscope/aries.png" alt="Овен" title="Овен">
	                </div>
	                <div class="content-data-params__key" title="Город">Город</div>
	                <div class="content-data-params__value" title="${this.data.city}">
	                  <input class="content-data-params__input" type="text" value="${this.data.city}"  maxlength="50" disabled>
	                </div>
	                <div class="content-data-params__key" title="Семейное положение">Семейное положение</div>
	                <div class="content-data-params__value" title="${this.data.family_state}">
	                  <input class="content-data-params__input" type="text" value="${this.data.family_state}" maxlength="100" disabled>
	                </div>
	              </div>
	              <div class="content-data-details" data-switch="off">Подробнее обо мне</div>
	              <div class="content-data-params content-data-params_more">
	                <div class="content-data-params__key" title="Образование">Образование</div>
	                <div class="content-data-params__value" title="${this.data.education}">
	                  <input class="content-data-params__input" type="text" value="${this.data.education}" maxlength="100" disabled>
	                </div>
	                <div class="content-data-params__key" title="Место работы">Место работы</div>
	                <div class="content-data-params__value" title="${this.data.job}">
	                  <input class="content-data-params__input" type="text" maxlength="100" value="${this.data.job}" disabled>
	                </div>
	              </div>
	            </div>
	        `;
	    }

	    afterMount() {
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
