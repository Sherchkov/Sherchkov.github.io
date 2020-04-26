define(["base/component", "component/auth/auth"], function(Component, formAuthorization){
	'use strict';
    class Authorization extends Component {
        render() {
            return `
	            <div class="PageStart">
	                ${this.childrens.create(formAuthorization, {})}
	            </div>
	        `;
        }
    }
    return Authorization;
});
