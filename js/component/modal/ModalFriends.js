// eslint-disable-next-line no-undef
define(['base/component', 'component/action/friends', 'server/json'], function (Component, dataFriends, json) {
	'use strict';

	class ModalFriends extends Component{
		render() {
			/*let friendsData = json.friends;*/
			/*console.log(friendsData);*/
			return ` 
	           <div class="modal-friends">
				 <div>Друзья</div>
				 <div></div>
	           </div> 
	        `;
		}

		afterMount(){
			//dataFriends();
		}
	}
	
	return ModalFriends;
});  