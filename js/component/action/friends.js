// eslint-disable-next-line no-undef
define(function() {
    /*Формирование списка друзей*/
    let tensor = new URL ('https://tensor-school.herokuapp.com/');
    /*let renderFriends = '';

    friendsList();*/

   /* let renderFriends = '<p>hi</p>';*/

    function renderFriends(){
        let getFriends = new URL ('/user_link/list', tensor);
        fetch(getFriends,{
            method : 'GET',
            mode: 'cors',
            credentials: 'include'
        }).then(response =>
            response.json()
        )
        .then(friends => {
            renderFriendsList(friends);
        })
        .catch(error => console.log('error', error));
    }

    function renderFriendsList(data){
        /*renderFriends = data.user_links[0].id;*/
        console.log(data);
        let frList = document.getElementsByClassName('modal-friends_list');
        frList.innerHTML = data.user_links[0].id;
    }
    

    return renderFriends;
});


