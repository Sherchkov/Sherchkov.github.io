define(['base/component', 'component/header/header', 'component/information/informationMobile', 'component/gallery/gallery', 'component/wall/wall', 'component/navigation/navigation', 'component/messages/messages'], function(Component, Header, InformationMobile, Gallery, Wall, Navigation, Messages){
	class Profile extends Component {
	    render(options) {
			document.title = options.data.name;
	    	options.mobile = true;
	        return `
	            <div class="MainPage MainPageMobile">
	               <!-- header -->
	               ${this.childrens.create(Header, options)}
                	<!-- Блок с данными о пользователе -->
                	${this.childrens.create(InformationMobile, options)}
                	<!-- Навигация -->
			${this.childrens.create(Navigation, {})}
                	<!-- Галлерея -->
                	${this.childrens.create(Gallery, {})}
                	<!-- Сообщения -->
                	<!-- Стена -->
                 	${this.childrens.create(Wall, options)}
	            </div>
	        `;
	    }
	}
	return Profile;
})
