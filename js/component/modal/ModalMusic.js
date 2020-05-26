// eslint-disable-next-line no-undef
define(['base/component', 'component/action/music', 'server/json', 'css!component/modal/ModalMusic'], function (Component, audioPlayer, json) {
	'use strict';

	class ModalMusic extends Component{
		render() {
		
			let items = json.music;
			let str = `<div class="modal-audio">
							<span class="modal-audio__title">Моя музыка</span>
							<audio src="" controls class="audioPlayer"></audio>
							<ul class="playlist">`;
			
			items.forEach((item) => {
				str += `<li><a href="${item.src}">${item.name}</a></li>`;
			});

			return str + '</ul></div>';
		}

		afterMount() {
			document.querySelector('.modal-content').classList.add('modal-content_big');
			audioPlayer();
		}
	}
	return ModalMusic;
});  
