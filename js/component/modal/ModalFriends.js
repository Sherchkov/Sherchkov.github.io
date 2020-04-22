define(['base/component'], function (Component) {
	'use strict';

	class ModalFriends extends Component{
	    render(options) {

	        return ` 
	           <div class="modal-video">
	             <div style="color: white">Друзья</div>
	           </div> 
	        `;
	    }
	}
	
	return ModalFriends;
});  