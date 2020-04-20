define(['base/component', 'server/json', 'css!component/navigation/navigation.min'], function (Component, json) {
	'use strict';

	let avatar = json.avatar.photo;

	class Navigation extends Component {
	    render() {
	        return `
	            <div class="content-link content_default">
	              <a href="#" class="link-element">
	                <div class="link-element__img"><img src="img/icons/system/fav.png" alt="Поклонники" title="Поклонники"></div>
	                <span class="link-element__title">Поклонники</span>
	              </a>
	              <a href="#" class="link-element">
	                <div class="link-element__img"><img src="img/icons/system/int.png" alt="Интересное" title="Интересное"></div>
	                <span class="link-element__title">Интересное</span>
	              </a>
	              <a href="#" class="link-element">
	                <div class="link-element__img"><img src="img/icons/system/friends.png" alt="Друзья товарищи" title="Друзья товарищи"></div>
	                <span class="link-element__title">Друзья товарищи</span>
	              </a>
	              <a href="#" class="link-element">
	                <div class="link-element__img"><img src="img/icons/system/video.png" alt="Видосы" title="Видосы"></div>
	                <span class="link-element__title">Видосы</span>
	              </a>
	              <a href="#" class="link-element">
	                <div class="link-element__img"><img src="img/icons/system/photo.png" alt="Фотки" title="Фотки"></div>
	                <span class="link-element__title">Фотки</span>
	              </a>
	              <a href="#" class="link-element">
	                <div class="link-element__img"><img src="img/icons/system/music.png" alt="Музыка" title="Музыка"></div>
	                <span class="link-element__title">Музыка</span>
	              </a>
	            </div>`;
	    }
	}



	return Navigation;
});  
