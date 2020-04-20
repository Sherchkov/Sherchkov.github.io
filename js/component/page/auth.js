define(["base/component", "component/auth/auth"], function(Component, Authorization){
    class auth extends Component {
        render() {
            return `<div class="wrapper">
                ${Authorization}
            </div>`;
        }
    }
    return auth;
});
