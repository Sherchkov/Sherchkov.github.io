define(["base/component", "base/helpers", "css!component/auth/style.css"], function (Component) {
    class auth extends Component {
      render() {
          return `<div class="auth">
                <div class="auth__main">Авторизация</div>
                <div class="auth__login">
                    <form>
                        <p>
                            <img src="img/login.jpg" class="auth__login_view">
                            <input type="text" size="20" placeholder="login" name="login" pattern="^[a-zA-Z]+$">
                        </p>
                        <p>
                            <img src="img/block.jpg" class="auth__password_view">
                            <input type="password" size="20" name="password" placeholder="password">
                        </p>
                    </form>
                </div>
                <div class="auth__button">
                    <button>Войти</button>
                    <button>Зарегистрироваться</button>
                </div>
            </div>`;
      }
    }
    return auth;
});
