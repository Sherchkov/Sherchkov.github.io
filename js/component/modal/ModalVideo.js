define(['base/component'], function (Component) {
	'use strict';

	class ModalVideo extends Component{
	    render(options) {

	        return ` 
	           <div class="modal-video">
	             <div style="color: white">Видеозаписи</div>
	           </div> 
	        `;
	    }
	}
	
	return ModalVideo;
});  