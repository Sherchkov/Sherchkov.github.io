define(['base/component', 'server/json', 'css!component/wall/wall.min'], function (Component, json) {
	'use strict';

	let wall = json.wall;

	class Wall extends Component {
	    render() {
	        let posts = '';

	        //требуется функция для определения даты написания поста

	        for (let i = 0; i < wall.length; i++){
	            let post = wall[i];
	            let images = '';
	            if (post.img.length) {
	                for (let j = 0; j < post.img.length; j++){
	                    images += `<img src="${post.img[j]}" alt="картинка" class="post-img__picture">`;
	                }
	            }
	            let rubbish = (post.dalete) ? '<div class="post-data__delete" title="удалить пост"><img src="img/icons/svg/rubbish.svg" alt="Удалить"></div>' : '';
	            
	            posts += ` 
	                <div class="post">
	                  <div class="post-data">
	                    <a href="${post.href}" class="post-data__link" target="_blank">
	                      <img src="${post.avatar}" alt="${post.name}" class="post-data__img">
	                    </a>
	                    <a href="#" target="_blank" class="post-data__name">${ post.family + post.name }</a>
	                    <span class="post-data__date">${post.date}</span>
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
