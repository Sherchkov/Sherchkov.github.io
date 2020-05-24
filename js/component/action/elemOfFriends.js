// eslint-disable-next-line no-undef
define(['base/component', 'css!component/modal/ModalFriend'], function (Component) {
    'use strict';
    var tensor = new URL ('https://tensor-school.herokuapp.com/');
    class ElemOfFriends extends Component{
        constructor(params){
            super();
            this.data = params.data;
            this.options = params.options;
        }

        render(){
            let img = this.getImage();
            let name = this.getName();

            return `
                <div class="modal-friends_card">
                    ${img}
                    ${name}
                </div>
            `;
        }

        afterMount(){
            this.subscribeTo(this.getContainer(), 'click', this.uploadFriend.bind(this));
        }

        getImage(){
            let img;
            if (this.data.computed_data.photo_ref !== null){
                img = new URL (this.data.computed_data.photo_ref, tensor);
                return `<img src=${img} alt="${this.data.data.name}" class="card_photo"/>`;
            }
            else{
                return `<div class="cap" title="Отсутствует аватар ${this.data.data.name}"></div>`;
            }
        }

        getName(){
            if (this.data.data.name !== undefined){
                return `<p class="card_title" title="${this.data.data.name}">${this.data.data.name}</p>`;
            }
            else{
                return '<p class="card_title" title="Неизвестный пользователь">Неизвестный пользователь</p>';
            }
        }

        uploadFriend(){
            let getUser = new URL (`/user/read/${this.data.id}`, tensor);	
            
				fetch(getUser, {
					method : 'GET',
					mode: 'cors',
					credentials: 'include'
				}).then(response => response.json())
                .then(result => { 
                    this.close();    
                    modal.unmount(); 
                    page.unmount();
                    if ( window.innerWidth > 800 ) {
                        // eslint-disable-next-line no-undef
                        require(['page/profile'], function (Profile) {
                            // eslint-disable-next-line no-undef
                            page = factory.create(Profile, result);
                            page.mount(document.body);
                        });
                    } else {
                        // eslint-disable-next-line no-undef
                        require(['page/ProfileMobile'], function(profileMobile){
                            // eslint-disable-next-line no-undef
                            page = factory.create(profileMobile, result);
                            page.mount(document.body);
                        });
                    }
                })
				.catch(() => this.uploadFriend());
        }

        close() {
            let event = new Event('click');
            document.querySelector('.modal').dispatchEvent(event);
        }
    }
    return ElemOfFriends;
});
