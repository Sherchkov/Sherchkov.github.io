/*Base/Component*/
define(['./Composite'], function (Composite) {

    'use strict';
    /**
     * Компонент базовый
     * на вход принимает options, которые можно только читать! 
     * имеет внутреннее состояние state, которое может менять
     * имеет 3 хука: mount, update, unmount
     * прехуки выполняются до и после хуков.
     * хуки переопределять нельзя, прехуки не имеют реализации в базе, реализуются при наследовании если необходимо
     */
    class Component {
        constructor(options) {
            this.options = {...this.getDefaultOptions(), ...options};
            this.state = {};
            this.isMount = false;
            // только для связи с DOM-ом
            this.id = this.generateId();

            // Компоновщик для сбора дерева детей
            this.childrens = factory.create(Composite, { parent: this });

            // для сбора подписок на события и автоматической отписки
            this.handlers = {};
        }


        /**
         * помещает верстку компонента в dom
         * @param {DOMElement} container контейнер в котором строиться верстка, куда поместить
         * @param {String} position insertAdjacentElement позиция куда помесить, до, в, вконец, после
         */
        mount(container, position) {
            // прехук до монтирования        
            this._beforeMount();
            // создаем новый компонент в доме
            const newComponent = document.createElement('div');
            // помещаем туда верстку
            newComponent.innerHTML = this.toString();
            // перекладываем верстку в нужный контейнер
            container.insertAdjacentElement(position || 'beforeend', newComponent.firstElementChild);
            // подчищаем за собой
            newComponent.remove();
            // меняем состояние что компонент смонтирован
            this.isMount = true;
            // прехук после монтирования
            this._afterMount()
        }

        /**
         * вызываеться при необходимости обновить компонент в верстке
         * пока не реализован, обновляться будет по изменению состояния компонента
         */
        _update() {
            this.beforeUpdate();
            this.update();
            this._afterUpdate();
        }

        update() {
        }

        /**
         * Уничтожения компонента из dom и вообще
         */
        unmount() {
            // выполняем прехуки
            this.beforeUnmount();
            // отписываемся от всех событий
            this.unsubscribeAll();
            // уничтожаем собственный контейнер
            if (this.getContainer()) {
                this.getContainer().remove();
            }
            // уничтожаем детей
            this.unmountChildren()
            // и себя у родителя, если он есть
            if (this.options.parent) {
                this.options.parent.childrens.remove(this.id);
            }
            // прехук после уничтожения
            this.afterUnmount();
        }

        // изменение состояния
        setState(newState) {
            const oldState = this.state;
            this.state = {...this.state, ...newState};
            if (this.isMount && this.needUpdate(oldState, this.state)) {
                this._update();
            }
        }

        needUpdate(oldState, newState) {
            return !_.isEqual(oldState, newState);
        }

        // прехук до монтирования
        beforeMount() {

        }

        // внутренний прехук до монтирования для передачи задач по цепочки и реализации в базе
        _beforeMount() {
            this.beforeMount();
            this.childrens.call('_beforeMount');
        }

        // прехук после монтирования
        afterMount() {

        }

        // внутренний прехук для вызова прехуков детей
        _afterMount() {
            this.afterMount();
            this.childrens.call('_afterMount');
        }

        // прехук до обновления
        beforeUpdate() {

        }

        // прехук после обновления
        afterUpdate() {

        }

        _afterUpdate() {
            this.afterUpdate();
            this.childrens.call('_afterUpdate');
        }

        // прехук до размонтирования
        beforeUnmount() {

        }

        // прехук после размонтирования
        afterUnmount() {

        }

        // размонтирование детей по цепочке вниз
        unmountChildren() {
            this.childrens.call('unmount');
        }

        // получение контейнера из дома куда смонтирован компонент
        getContainer() {
            if (this.container === undefined) {
                this.container = document.getElementById(this.id);
            }
            return this.container;
        }

        getBinding() {
            if (this.bindings === undefined) {
                const container = this.getContainer();
                let bindName;
                this.bindings = {};
                container.querySelectorAll('[bind]').forEach((el) => {
                    bindName = el.getAttribute('bind');
                    this.bindings[bindName] = el;
                });
            }
            return this.bindings;
        }

        // прехук для получения дефолтных опций компонента, реализуется при наследовании
        getDefaultOptions() {
            return {};
        }

        // view компонента, обязательно должен содержать контейнер!!!
        render() {
            return `<div></div>`;
        }

        // текстовое представление компонента, по сути его рендер
        toString() {
            // если не смонтирован, вызовим прехук
            if (!this.isMount) {
                this.beforeMount();
                this.isMount = true;
            }
            let template = this.render(this.options, this.state);
            const regexp = /<(([a-z]+)\s*([^>]*))>/m;
            // ищем контейнер компонента в верстке и доставляем ему id
            return template.replace(regexp, `<$1 id="${this.id}">`);
        }
        
        // поиск компонента среди детей по его id
        getById(id) {
            // сначала в своих
            let child = this.childrens.get(id);

            if (child) {
                return child;
            }

            this.childrens.call('getById', id);
        }

        // добавление ребенка в компонент и его монтирование
        appendChildren(component, options, container) {
            const child = factory.create(component, { parent: this, ...options });
            this.childrens.add(child);
            child.mount(container || this.getContainer());
        }

        // прдписка любого компонента или его части на событие для его автоматической отписки при уничтожении исходного компонента
        subscribeTo(target, eventName, handler) {
            const handlers = this.handlers[eventName] || [];
            // положим источник и обработчик в список события
            handlers.push({
                target,
                handler
            });
            this.handlers[eventName] = handlers;
            // подпишимся
            target.addEventListener(eventName, handler);
        }

        // отписаться от всех событий
        unsubscribeAll() {
            for (let eventName in this.handlers) {
                this.unsubscribeByEvent(eventName);
            }
        }

        // отписать всех от определенного события
        unsubscribeByEvent(eventName) {
            this.handlers[eventName].forEach(element => {
                element.target.removeEventListener(eventName, element.handler);
            });
        }
    }

    Component.prototype.generateId = function() {
        return Math.random().toString(32).slice(2);
    };

    return Component;
});