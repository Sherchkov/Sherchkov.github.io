define(["base/component", "component/auth/auth"], function(Component, formAuthorization){
    class Authorization extends Component {
        render() {
            let form = new formAuthorization();
            return `<div class="wrapper">
                ${form}
            </div>`;
        }
    }
    return Authorization;
});
