// eslint-disable-next-line no-undef
define(['base/component', 'component/action/elemOfFriends', 'css!component/modal/ModalFriend'], function (Component, ElemOfFriends) {
	'use strict';
	
	var tensor = new URL ('https://tensor-school.herokuapp.com/');
	
    class ModalFriends extends Component{
		constructor(options){
		super();
		this.options = options.options;
		this.friends = {
			myRequests : [],
			myFriends : [],
			mySubscribers : []
			};
		this.users = [];
		}
    
		render() {
			return `
			<div class="modal-friends">
				<p class="modal-friends_textInfo">Происходит загрузка данных, пожалуйста подождите...</p>
				<div class="modal-friends_friends">
					<div class="modal-friends_title">Мои друзья</div>
					<div class="modal-friends_list" id="friends"></div>
				</div>
				<div class="modal-friends_subscribers">
					<div class="modal-friends_title">Мои подписчики</div>
					<div class="modal-friends_list" id="subscribers"></div>
				</div>
				<div class="modal-friends_requests">
					<div class="modal-friends_title">Мои исходящие заявки</div>
					<div class="modal-friends_list" id="requests"></div>
				</div>
				<div class="modal-friends_allUsers">
					<div class="modal-friends_title">Все пользователи</div>
					<div class="modal-friends_list" id="users"></div>
				</div>
			</div>
			`;
		}

		beforeMount(){
			this.getListOfFriends();
		}
    
		afterMount(){
			document.querySelector('.modal-content').classList.add('modal-content_big');

			this.pasteFriends(this.friends.myFriends, 'friends');
			this.pasteFriends(this.friends.myRequests, 'requests');
			this.pasteFriends(this.friends.mySubscribers, 'subscribers');
			this.pasteFriends(this.users, 'users');
		}

		getListOfFriends(){
			let getFriends = new URL ('/user_link/list', tensor);
			let getAllUsers = new URL ('/message/addressee_list', tensor);

			let loadAllUsers = fetch(getAllUsers,{
				method : 'GET',
				mode: 'cors',
				credentials: 'include'
			}).then(response => response.json())
			.then(result => this.putAllUsers(result.messages));

			let loadFriend = fetch(getFriends,{
				method : 'GET',
				mode: 'cors',
				credentials: 'include'
			})
			.then(response => response.json())
			.then(friends => this.choiceTypeOfLinks(friends.user_links))
			.then(dataOfFriend => this.getFormatFriends(dataOfFriend))
			.catch(error => console.log('error', error));

			Promise.all([loadAllUsers, loadFriend])
			.then(() => {
				if (this.isMount){
					this._afterMount();
				}
				let textInfo = document.querySelector('.modal-friends_textInfo');
				textInfo.remove();
			});
		}

		putAllUsers(data){
			[...data].forEach(oneObject => {
				this.users.unshift(oneObject);
			});
			return true;
		}

		choiceTypeOfLinks(links) {
			let data = {
				outgoingRequests : [],
				subscribers : []
			};
			
			[...links].forEach(link => {
				let idOfLink = parseInt(link.user_from, 10);

				if (idOfLink === this.options.id){
					data.outgoingRequests.unshift(link);
				}
				else {
					data.subscribers.unshift(link);
				}
			});

			return data;
		}

		getFormatFriends(data){
			let subscribers = [...data.subscribers];
			[...data.outgoingRequests].forEach(request => {
				let isConsist = false;

				for (let subscriber of subscribers) {
					if (!isConsist){
						if (subscriber.user_from === request.user_to) {
							isConsist = true;
							subscriber.isUse = true;
						}
					}	
				}

				if (isConsist){
					this.friends.myFriends.unshift(request);
				}
				else {
					this.friends.myRequests.unshift(request);
				}
			});

			for (let subscriber of subscribers){
				if (subscriber.isUse === undefined){
					this.friends.mySubscribers.unshift(subscriber);
				}
			}

			return true;
		}

		async pasteFriends(data, typeOfLinks){
			for (let friend of data){
				let dataAboutUser;
				let elemForPast;

				if (typeOfLinks !== 'users'){
					let id = '';
					if (typeOfLinks !== 'subscribers'){
						id = friend.user_to;
					}
					else {
						id = friend.user_from;
					}
					dataAboutUser = this.getDataAboutUser(id);
					// eslint-disable-next-line no-undef
					elemForPast = factory.create(ElemOfFriends, {data : await dataAboutUser, options : this.options});
				}
				else {
					dataAboutUser = friend;
					// eslint-disable-next-line no-undef
					elemForPast = factory.create(ElemOfFriends, {data : dataAboutUser, options : this.options});
				}
				
				

				let path = document.getElementById(typeOfLinks);
				await elemForPast.mount(path);
			}
		}

		getDataAboutUser(user){
			return new Promise(function(resolve) {
				let getUser = new URL (`/user/read/${user}`, tensor);
			
				fetch(getUser, {
					method : 'GET',
					mode: 'cors',
					credentials: 'include'
				}).then(response => response.json())
				.then(result => resolve(result))
				.catch(() => this.getDataAboutUser(user));
			});
		}    
    }
    
    return ModalFriends;
});