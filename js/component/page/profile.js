define(['base/component', 'component/header/header', 'component/information/information', 'component/gallery/gallery', 'component/wall/wall', 'component/avatar/avatar', 'component/navigation/navigation', 'component/messages/messages'], function(Component, Header, Information, Gallery, Wall, Avatar, Navigation, Messages){
	class Profile extends Component {
	    render(options) {
	    	this.options = options;
	    	document.title = options.data.name;
	    	if (this.options.id === user_id) {
	    		userParams.theme_night = this.options.data.theme_night || 'false';
	    		userParams.mirror = this.options.data.mirror || 'false';
	    	}
	        return `
	            <div class="MainPage">
	                <!-- header -->
	                ${this.childrens.create(Header, options)}
	                <div class="MainPage__Content Content ${(userParams.mirror === 'true' || (user_id === this.options.id && options.data.mirror === 'true') ) ? 'content_left' : ''}">
	                    <div class="Content__body con-body">
	                     	<!-- Блок с данными о пользователе -->
	                     	${this.childrens.create(Information, options)}
	                     	<!-- Галлерея -->
	                     	${this.childrens.create(Gallery, options)}
	                     	<!-- Стена -->
	                      	${this.childrens.create(Wall, options)}
	                    </div>
	                    <div class="Content__side-bar side-bar">
	                     	<!-- Профиль -->
	                     	${this.childrens.create(Avatar, options)}
	                     	<!-- Навигация -->
	                     	${this.childrens.create(Navigation, options)}
	                     	<!-- Сообщения -->
							<!--${this.childrens.create(Messages, {})}-->
	                    </div>
	                </div>
	            </div>
	        `;
	    }

	    afterMount(){
	    	if (userParams.theme_night === 'true' || (user_id === this.options.id && this.options.data.theme_night === 'true')) {
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
	    	}
	    }
	}
	return Profile;
})
