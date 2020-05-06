define(['base/component', 'component/header/header', 'component/information/informationMobile', 'component/gallery/gallery', 'component/wall/wall', 'component/navigation/navigation', 'component/messages/messages'], function(Component, Header, InformationMobile, Gallery, Wall, Navigation, Messages){
	class Profile extends Component {
	    render(options) {
	    	options.mobile = true;
	        return `
	            <div class="MainPage MainPageMobile">
	                <!-- header -->
	                ${this.childrens.create(Header, {})}
                	<!-- Блок с данными о пользователе -->
                	${this.childrens.create(InformationMobile, options)}
                	<!-- Навигация -->
			${this.childrens.create(Navigation, {})}
                	<!-- Галлерея -->
                	${this.childrens.create(Gallery, {})}
                	<!-- Сообщения -->
			${this.childrens.create(Messages, {mobile:true})}
                	<!-- Стена -->
                 	${this.childrens.create(Wall, {})}
	            </div>
	        `;
	    }
	}
	return Profile;
})
