// eslint-disable-next-line no-undef
define(['base/component', 'css!component/wall/wall'], function (Component) {
    'use strict';

    class ModalCreatePost extends Component{

        render(options) {
            return '<div>В разработке)))</div>';
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