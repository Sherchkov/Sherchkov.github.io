// eslint-disable-next-line no-undef
define(['base/component'], function (Component) {
    'use strict';

    class ModalOpenPost extends Component{

        render(options) {
            let post = document.getElementById(options.id);
            let newPost = post.cloneNode(true);
            newPost.id = this.generateId();
            this.id = newPost.id;

            //let button = newPost.querySelector('.post-data__delete');
            //button.remove();

            return `${newPost.outerHTML}`;
        }
        afterMount() {
            
            document.querySelector('.modal-content').classList.add('modal-content_big');

            document.querySelector('.modal-content_big .post').style['padding-top'] = '5px';

            let blockImgs = document.querySelector('.modal-content_big .post-img_grid');
            blockImgs.className = 'post-img_flex';
           
            let imgs = document.querySelectorAll('.modal .post-img__picture');
            for(let img of imgs) {
                img.className = 'post-img__picturePopup';
            }

            document.querySelector('.modal-content .post-img__picturePopup').style['cursor'] = 'default';
            document.querySelector('.modal-content .post-text').style['cursor'] = 'default';
        }
    }

	return ModalOpenPost;
});  
