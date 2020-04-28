// eslint-disable-next-line no-undef
define(['base/component', 'css!component/modal/ModalCreatePost'], function (Component) {
    'use strict';

    class ModalCreatePost extends Component{

        render() {
            return `<div class='createrPost'>
                        <p class='createrPost__text createrPost__header'>Создание записи</p>
                        <textarea class='createrPost__fieldForText' placeholder="Введите текст записи"></textarea>
                        <div class='createrPost__text createrPost__buttons'>
                            <p class='createrPost__buttonCrete'>Добавить фото к записи</p>
                            <p class='createrPost__buttonAdd'>Сохранить</p>
                        </div>
                    </div>`;
//             let post = document.getElementById(options.id);
//             let newPost = post.cloneNode(true);
//             newPost.id = this.generateId();
//             this.id = newPost.id;

//             let button = newPost.querySelector('.post-data__delete');
//             button.remove();

//             return `${newPost.outerHTML}`;
//         }
//         afterMount() {
            
//             document.querySelector('.modal-content').classList.add('modal-content_big');
           
//             let imgs = document.querySelectorAll('.modal .post-img__picture');
//             for(let img of imgs) {
//                 img.classList.remove('post-img__picture');
//                 img.classList.add('post-img__picturePopup');
//             }
        }
        afterMount() {
            
            document.querySelector('.modal-content').classList.add('modal-content_big');
           
        }
        
    }
	return ModalCreatePost;
});  