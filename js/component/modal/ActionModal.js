define(['modal/Modal', 'css!component/modal/Modal.min'], function (Modal) {
	'use strict';

	class ActionModal{
	    constructor(list){

	        if (  typeof(modal) !== "undefined" ) {
	            modal.unmount();
	        }

	        modal = factory.create(Modal, {list});

	        modal.mount(document.body);
	    }
	}

	return ActionModal;
});  
