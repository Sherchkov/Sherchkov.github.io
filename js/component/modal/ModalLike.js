define(['base/component'], function (Component) {
	'use strict';

	class ModalLike extends Component{
	    render(options) {

	        return ` 
	           <div class="modal-video">
	             <div style="color: white">Понравилось</div>
	           </div> 
	        `;
	    }
	}
	
	return ModalLike;
});  