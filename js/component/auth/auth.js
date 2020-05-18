define(['base/component', 'css!component/auth/auth'], function (Component) {
    'use strict';
    document.title = "Авторизация";

    class Auth extends Component {

        render() {
            return `
                <div class="join">
                    <div class="join-header">
                        <div class="join-header__signIn">
                            <button class="join__switch join-switch_signIn join__switch_bottom">Войти</button>
                        </div>
                        <div class="join-header__signUp">
                            <button class="join__switch join-switch_signUp">Зарегистрироваться</button>
                        </div>
                    </div>
                    <div class="join-container">
                        <div class="join-formEnter">
                            <div class="join-formEnter__error"></div>
                            <div class="join-form__container">
                                <span class="join-form__title">Логин<sup class="join-form__sub">*</sup></span>
                                <input class="join-form__input join-form__input_logEneter" type="text">
                                <span class="join-form__title">Пароль<sup class="join-form__sub">*</sup></span>
                                <input class="join-form__input join-form__input_passEneter" type="password">
                                <button class="join-form__send join-form__send_enter">Войти</button>
                            </div>  
                        </div>
                        <div class="join-formReg join-form_none">
                            <div class="join-formReg__error"></div>
                            <div class="join-form__container">
                                <span class="join-form__title">Логин<sup class="join-form__sub">*</sup></span>
                                <input class="join-form__input join-form__input_logReg" type="text">
                                <span class="join-form__title">Пароль<sup class="join-form__sub">*</sup></span>
                                <input class="join-form__input join-form__input_passReg" type="password">
                                <span class="join-form__title">Повторите пароль<sup class="join-form__sub">*</sup></span>
                                <input class="join-form__input join-form__input_passRepReg" type="password">
                                <span class="join-form__title">Имя</span>
                                <input class="join-form__input join-form__input_nameReg" type="text">
                                <span class="join-form__title">Фамиллия</span>
                                <input class="join-form__input join-form__input_familyReg" type="text">
                                <span class="join-form__title">Город</span>
                                <input class="join-form__input join-form__input_cityReg" type="text">
                                <span class="join-form__title">Дата рождения</span>
                                <input class="join-form__input join-form__input_birthReg" type="date">
                                <span class="join-form__title">Образование</span>
                                <input class="join-form__input join-form__input_educationReg" type="text">
                                <span class="join-form__title">Работа</span>
                                <input class="join-form__input join-form__input_jobReg" type="text">
                                <span class="join-form__title">Семейное положение</span>
                                <input class="join-form__input join-form__input_stateReg" type="text">
                                <button class="join-form__send join-form__send_reg">Зарегистрироваться</button>
                            </div>  
                        </div>
                    </div>
                </div>
            `;
        }

        afterMount() {
            this._enterTitle = this.getContainer().querySelector('.join-switch_signIn');
            this._regTitle = this.getContainer().querySelector('.join-switch_signUp');
            this._formEnter = this.getContainer().querySelector('.join-formEnter');
            this._formReg = this.getContainer().querySelector('.join-formReg');
            this._buttonEnter = this.getContainer().querySelector('.join-form__send_enter');
            this._buttonReg = this.getContainer().querySelector('.join-form__send_reg');

            this.subscribeTo(this._enterTitle, 'click', this.ShowFormEnter.bind(this));
            this.subscribeTo(this._regTitle, 'click', this.ShowFormReg.bind(this));
            this.subscribeTo(this._buttonEnter, 'click', this.Enter.bind(this));
            this.subscribeTo(this._buttonReg, 'click', this.Registration.bind(this));
        }

        ShowFormEnter(){
          this._enterTitle.classList.add('join__switch_bottom');
          this._regTitle.classList.remove('join__switch_bottom');
          this._formEnter.classList.remove('join-form_none');
          this._formReg.classList.add('join-form_none');
        }

        ShowFormReg(){
          this._regTitle.classList.add('join__switch_bottom');
          this._enterTitle.classList.remove('join__switch_bottom');
          this._formEnter.classList.add('join-form_none');
          this._formReg.classList.remove('join-form_none');
        }

        Enter(){
            let login = document.querySelector('.join-form__input_logEneter').value,
                password = document.querySelector('.join-form__input_passEneter').value,
                errorEnter = document.querySelector('.join-formEnter__error');

            errorEnter.innerText = '';

            if (!this.check(login, 'login', errorEnter) || !this.check(password, 'password', errorEnter)) {
                return;
            }
            let urlencoded = new URLSearchParams();

            urlencoded.append("login", login);
            urlencoded.append("password", password);

            let requestOptions = {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: urlencoded,
                "credentials": "include"
            };

            fetch("https://tensor-school.herokuapp.com/user/login", requestOptions)
                .then(response => {
                    if ( response.ok ) {
                        return response.json();
                    }else{
                      if (response.status === 401) {
                          errorEnter.innerText = 'Ошибка: Логин или пароль неправильно введен';
                      }else{
                          errorEnter.innerText = 'Ошибка сервера';
                      }
                      return response.error();
                    }
                })
                .then(result => {
                    user_id = result.id;
                    page.unmount();
                    if (window.innerWidth > 800) {
                        require(["page/profile"], function (Profile) {
                            page = factory.create(Profile, result);
                            page.mount(document.body);
                        });
                    } else {
                        require(["page/ProfileMobile"], function (profileMobile) {
                            page = factory.create(profileMobile, result);
                            page.mount(document.body);
                        });
                    }
                })
                .catch(error => console.log('error', error));
        }

        Registration(){
            let login = document.querySelector('.join-form__input_logReg').value,
                password = document.querySelector('.join-form__input_passReg').value,
                repeat_password = document.querySelector('.join-form__input_passRepReg').value,
                errorEnter = document.querySelector('.join-formReg__error');

            errorEnter.innerText = '';

            if (!this.check(login, 'login', errorEnter) || !this.check(password, 'password', errorEnter)) {
                window.scrollTo(pageXOffset, 0);
                return;
            }

            if (password !== repeat_password) {
                errorEnter.innerText = 'Ошибка: Пароли не совпадают';
                window.scrollTo(pageXOffset, 0);
                return false;
            }

            let name = 'Скрыто';
            if (document.querySelector('.join-form__input_nameReg').value || document.querySelector('.join-form__input_familyReg').value) {
                name = document.querySelector('.join-form__input_familyReg').value + ' ' + document.querySelector('.join-form__input_nameReg').value;
            }

            let data = {
                name : name,
                birth_date : document.querySelector('.join-form__input_birthReg').value || '0000-00-00T00:00:00',
                city : document.querySelector('.join-form__input_cityReg').value || 'Скрыто',
                family_state : document.querySelector('.join-form__input_stateReg').value || 'Скрыто',
                education : document.querySelector('.join-form__input_educationReg').value || 'Скрыто',
                job : document.querySelector('.join-form__input_jobReg').value || 'Скрыто',
                about_self : ''
            }

            let urlencoded = new URLSearchParams();
            urlencoded.append('login', login);
            urlencoded.append('password', password);

            fetch('https://tensor-school.herokuapp.com/user/create', {
                method: 'POST',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: urlencoded,
                "credentials" : "include"
            })
            .then(response => {
                if ( response.ok ) {
                    return response.json();
                }else{
                    console.log("response", response);
                    if (response.status === 400) {
                        window.scrollTo(pageXOffset, 0);
                        errorEnter.innerText = 'Ошибка: Логин или пароль введены не правильно или такой login уже зарегистрирован';
                    }else{
                        errorEnter.innerText = 'Ошибка сервера';
                    }
                    return response.error();
                }
            })
            .then(result => {
                console.log("result", result);
                user_id = result.id;
                this.updateUser(data);
                this.loadpage(data,result.id,result.computed_data.last_activity);
            })
            .catch(error => console.log('error', error));
        }


        updateUser(data){
            console.log("data", data);
            fetch('https://tensor-school.herokuapp.com/user/update', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body : JSON.stringify(data),
                credentials: 'include'
            })
            .then(response => {
            })
            .catch(error => {
                console.log('error', error);
            });
        }

        check(input, parametr,errorEnter){
            if ( parametr === 'login') {
                if ( input.length < 3 || input.length > 15 ) {
                    errorEnter.innerText = 'Ошибка: Пожалуйста, введите логин, содержащий не меньше 3 и не больше 20 символов.';
                    return false;
                }
                if ( !/^[A-z0-9]{3,15}$/i.test(input) ) {
                    errorEnter.innerText = 'Ошибка: Логин должен содержать только латинские буквы и цифры.';
                    return false;
                }
            }else if ( parametr === 'password') {
                if ( input.length < 3 || input.length > 20 ) {
                    errorEnter.innerText = 'Ошибка: Пожалуйста, введите пароль, содержащий не меньше 3 и не больше 20 символов.';
                    return false;
                }
                if ( !/^[A-z0-9.-_]{3,20}$/i.test(input) ) {
                    console.log("input", input);
                    errorEnter.innerText = 'Ошибка: Пароль должен содержать латинские буквы и цифры, а также символы .-_';
                    return false;
                }
            }else{
                return false;
            }

            return true;
        }

        loadpage(data, id, last_activity){
            let result = {
                computed_data : {
                    'last_activity' : last_activity,
                    'photo_ref' : null
                },
                data : data,
                id : id,
            }
            page.unmount();
            if ( window.innerWidth > 800 ) {
                require(["page/profile"], function (Profile) {
                    page = factory.create(Profile, result);
                    page.mount(document.body);
                });
            } else {
                require(["page/ProfileMobile"], function(profileMobile){
                    page = factory.create(profileMobile, result);
                    page.mount(document.body);
                });
            }
        }

    }
    return Auth;
});
