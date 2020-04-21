if ( window.innerWidth > 800 ) {
	define(["page/profile"], function(Profile){
		const profile = factory.create(Profile, {});
	    profile.mount(document.body);
	});
}else{
	define(["page/ProfileMobile"], function(profileMobile){
		const profile = factory.create(profileMobile, {});
	    profile.mount(document.body);
	});
}
