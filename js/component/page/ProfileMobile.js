define(['base/component', 'component/header/header', 'component/information/informationMobile', 'component/gallery/gallery', 'component/wall/wall', 'component/navigation/navigation', 'component/messages/messages'], function(Component, Header, InformationMobile, Gallery, Wall, Navigation, Messages){
	class Profile extends Component {
	    render(options) {
			document.title = options.data.name;
	    	options.mobile = true;
	    	this.options = options;
	    	if (this.options.id === user_id) {
	    		userParams.theme_night = this.options.data.theme_night || 'false';
	    		userParams.mirror = this.options.data.mirror || 'false';
	    	}
	        return `
	            <div class="MainPage MainPageMobile">
	               <!-- header -->
	               ${this.childrens.create(Header, options)}
                	<!-- Блок с данными о пользователе -->
                	${this.childrens.create(InformationMobile, options)}
                	<!-- Навигация -->
			${this.childrens.create(Navigation, {})}
                	<!-- Галлерея -->
                	${this.childrens.create(Gallery, options)}
                	<!-- Сообщения -->
                	<!-- Стена -->
                 	${this.childrens.create(Wall, options)}
	            </div>
	        `;
	    }

	    afterMount(){
	    	if (userParams.theme_night === 'true' || (user_id === this.options.id && this.options.data.theme_night === 'true') {
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
