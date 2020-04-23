fetch("https://tensor-school.herokuapp.com/user/current", {
	credentials: 'include'
})
	.then(response => response.status)
	.then(status => {
		if (status == '200') {
			if ( window.innerWidth > 800 ) {
				require(["page/profile"], function (Profile) {
					const profile = factory.create(Profile, {});
					profile.mount(document.body);
				});
			} else {
				require(["page/ProfileMobile"], function(profileMobile){
					const profile = factory.create(profileMobile, {});
					profile.mount(document.body);
				});
			}
		}
		else {
			require(["page/Authorization"], function(authorization){
				const profile = factory.create(authorization, {});
				profile.mount(document.body);
			});
		}
	})
	.catch(error => console.log('error', error));
