define(["base/component", "component/auth/auth"], function(Component, formAuthorization){
    class Authorization extends Component {
        render() {
            return `<div class="wrapper">
                ${this.childrens.create(formAuthorization, {})}
            </div>`;
        }
    }
    return Authorization;
});
