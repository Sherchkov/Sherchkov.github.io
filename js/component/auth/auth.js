define(['base/component', 'css!component/auth/style.css'], function (Component) {
    'use strict';
    class Auth extends Component {
        render() {
            return `<div class="auth">
                <div class="auth__main">Авторизация</div>
                <div class="auth__login">
                    <form id="authorization">
                        <p>
                            <img src="img/icons/system/auth/login.jpg" class="auth__login_view">
                            <input type="text" size="20" placeholder="login" name="login" pattern="^[a-zA-Z]+$">
                        </p>
                        <p>
                            <img src="img/icons/system/auth/block.jpg" class="auth__password_view">
                            <input type="password" size="20" name="password" placeholder="password">
                        </p>
                    </form>
                </div>
                <div class="auth__button">
                    <button class="auth__button_enter">Войти</button>
                    <button class="auth__button_register">Зарегистрироваться</button>
                </div>
                <div class="auth__success">
                    <img src="img/icons/system/success.jpeg" class="auth__success_ok">
                </div>
            </div>`;
        }

        afterMount() {
            this._sign = this.getContainer().querySelector('.auth__button_enter');
            this.subscribeTo(this._sign, 'click', this.sign.bind(this));
            this._register = this.getContainer().querySelector('.auth__button_register');
            this.subscribeTo(this._register, 'click', this.registerPerson.bind(this));
        }

        sign() {
            const urlencoded = new URLSearchParams();

            urlencoded.append("login", document.forms["authorization"].elements["login"].value);
            urlencoded.append("password", document.forms["authorization"].elements["password"].value);

            this._success = this.getContainer().querySelector('.auth__success');

            const requestOptions = {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: urlencoded,
                "credentials": "include"
            };

            fetch("https://tensor-school.herokuapp.com/user/login", requestOptions)
                .then(response => response.text())
                .then(result => {
                    if (result == "Unauthorized") {
                        this._success.innerHTML = 'Пользователь не зарегистрирован!';
                        this._success.style.display = 'block';
                    } else {
                        this.unmount();
                        if ( window.innerWidth > 800 ) {
                            require(["page/profile"], function(Profile){
                                const profile = factory.create(Profile, {});
                                profile.mount(document.body);
                            });
                        }else{
                            require(["page/ProfileMobile"], function(profileMobile){
                                const profile = factory.create(profileMobile, {});
                                profile.mount(document.body);
                            });
                        }
                    }
                })
                .catch(error => console.log('error', error));
        }

        registerPerson() {
            const urlencoded = new URLSearchParams();

            urlencoded.append("login", document.forms["authorization"].elements["login"].value);
            urlencoded.append("password", document.forms["authorization"].elements["password"].value);

            this._success = this.getContainer().querySelector('.auth__success');

            const requestOptions = {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: urlencoded,
                "credentials" : "include"
            };

            fetch("https://tensor-school.herokuapp.com/user/create", requestOptions)
                .then(response => {
                    if (response.status == '400') {
                        this._success.innerHTML = 'Пользователь уже зарегистрирован!';
                        this._success.style.display = 'block';
                    } else {
                        this._success.innerHTML = 'Пользователь успешно зарегистрирован!';
                        this._success.style.display = 'block';
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    return Auth;
});
