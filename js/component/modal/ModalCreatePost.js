// eslint-disable-next-line no-undef
define(['base/component', 'css!component/modal/ModalCreatePost'], function (Component) {
    'use strict';

    class ModalCreatePost extends Component{

        render() {
            return `<div class='createrPost'>
                        <p class='createrPost__text createrPost__header'>Создание записи</p>
                        <textarea class='createrPost__fieldForText' placeholder="Введите текст записи"></textarea>
                        <div class='createrPost__text createrPost__buttons'>
                            <p class='createrPost__buttonAdd'>Добавить фото к записи</p>
                            <p class='createrPost__buttonCreate'>Сохранить</p>
                        </div>
                    </div>`;
        }

        afterMount() {
            
            document.querySelector('.modal-content').classList.add('modal-content_big');
            this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
            
        }

        chooseAction(event){
			if (event.target.classList.contains('createrPost__buttonCreate')) {
				this.createPost();
			} else if (event.target.classList.contains('createrPost__buttonAdd')) {
				this.addFoto();
			}
        }
        
        addFoto(){
            event.stopPropagation();
        }

        createPost(){
            event.stopPropagation();
            this.Close();
        }

        Close() {
            let event = new Event('click');
            document.querySelector('.modal').dispatchEvent(event);
        }
        
    }
	return ModalCreatePost;
});  