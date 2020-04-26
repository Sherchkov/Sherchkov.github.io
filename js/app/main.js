fetch("https://tensor-school.herokuapp.com/user/current", {
	credentials: 'include'
})
.then(response => {
	if ( response.ok ) {
	    return response.json();  
	}else{
		require(["page/Authorization"], function(Authorization){
			page = factory.create(Authorization, {});
			page.mount(document.body);
		});
	  	return response.error();
	}
})
.then(result => {
	user_id = result.id;
	if ( window.innerWidth > 800 ) {
		require(["page/profile"], function (Profile) {
			page = factory.create(Profile, {});
			page.mount(document.body);
		});
	} else {
		require(["page/ProfileMobile"], function(profileMobile){
			page = factory.create(profileMobile, {});
			page.mount(document.body);
		});
	}
})
.catch(error => console.log('error', error));
