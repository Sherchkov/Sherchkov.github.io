define(['base/component', 'component/header/header', 'component/information/information', 'component/gallery/gallery', 'component/wall/wall', 'component/avatar/avatar', 'component/navigation/navigation', 'component/messages/messages'], function(Component, Header, Information, Gallery, Wall, Avatar, Navigation, Messages){
	class Profile extends Component {
	    render(options) {
	        return `
	            <div class="MainPage">
	                <!-- header -->
	                ${this.childrens.create(Header, {})}
	                <div class="MainPage__Content Content">
	                    <div class="Content__body con-body">
	                     	<!-- Блок с данными о пользователе -->
	                     	${this.childrens.create(Information, {})}
	                     	<!-- Галлерея -->
	                     	${this.childrens.create(Gallery, {})}
	                     	<!-- Стена -->
	                      	${this.childrens.create(Wall, {})}
	                    </div>
	                    <div class="Content__side-bar side-bar">
	                     	<!-- Профиль -->
	                     	${this.childrens.create(Avatar, options)}
	                     	<!-- Навигация -->
	                     	${this.childrens.create(Navigation, {})}
	                     	<!-- Сообщения -->
	                      	${this.childrens.create(Messages, {})}
	                    </div>
	                </div>
	            </div>
	        `;
	    }
	}
	return Profile;
})
