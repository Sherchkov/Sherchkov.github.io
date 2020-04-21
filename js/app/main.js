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

// define(["page/Authorization"], function(authorization){
// 	const profile = factory.create(authorization, {});
// 	profile.mount(document.body);
// });
