define(['base/component'], function (Component) {
	'use strict';

	class ModalPhoto extends Component{
	    render(options) {

	        return ` 
	           <div class="modal-photo">
	             <img class="modal-photo__img" src="${options.src}" alt="${options.alt}" title="${options.title}">
	           </div> 
	        `;
	    }
	}
	
	return ModalPhoto;
});  