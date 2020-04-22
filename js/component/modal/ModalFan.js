define(['base/component'], function (Component) {
	'use strict';

	class ModalFan extends Component{
	    render(options) {

	        return ` 
	           <div class="modal-video">
	             <div style="color: white">Поклонники</div>
	           </div> 
	        `;
	    }
	}
	
	return ModalFan;
});  