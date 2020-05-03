// eslint-disable-next-line no-undef
define(['base/component', 'css!component/modal/ModalCreatePost'], function (Component) {
    'use strict';

    class ModalCreatePost extends Component{

        render() {
            return `<div class='createrPost'>
                        <p class='createrPost__text createrPost__header'>Создание записи</p>
                        <textarea class='createrPost__fieldForText' placeholder="Введите текст записи"></textarea>
                        <p class='createrPost__text'>Вы можете перенести сюда фото</p>
                        <div class='createrPost__fieldForImg'></div>
                        <div class='unvisibleField'>
                            <input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)">
                        </div>
                        <div class='createrPost__text createrPost__buttons'>
                            <p class='createrPost__buttonUnvisibleField'>Или загрузить через проводник</p>
                            <p class='createrPost__buttonCreate'>Сохранить</p>
                        </div>
                    </div>`;
        }

        afterMount() {
            
            document.querySelector('.modal-content').classList.add('modal-content_big');
            this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));

            let elementForDrop = document.querySelector('.createrPost__fieldForImg');
            let arrayOfEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
            arrayOfEvents.forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.preventDefaults));
            ['dragenter', 'dragover'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.makeBigField));
            ['dragover', 'drop'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.setCopyFiles));
            ['dragleave', 'drop'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.makeLittleField));
            document.querySelector('input[id=fileElem]').onchange = this.fromAddButtton.bind(this);
            this.subscribeTo(elementForDrop, 'drop', this.handleDrop.bind(this));
            
        }

        //выбор навешиваемой функции
        chooseAction(event){
			if (event.target.classList.contains('createrPost__buttonCreate')) {
				this.createPost();
			} else if (event.target.classList.contains('createrPost__buttonUnvisibleField')) {
				this.openField();
			} 
        }

        //обработчик скидывания
        async handleDrop(){
            var dt = event.dataTransfer;
            let files = await dt.files;
            console.log(files);
            /*for (let file of files) {
                this.uploadFile();
            }*/
            this.handleFiles(files);
        }

        //
        fromAddButtton(){
            let dt = event.srcElement;
            let files = dt.files;
            this.handleFiles(files);
        }

        //выполнение для каждого файла загрузки
        handleFiles(files) {
            ([...files]).forEach(file => this.uploadFile(file));
        }

        //загрузка
        uploadFile(file){
            console.log('Загрузка' + file);
        }

        //увеличение поля при наведение на него и обведение жирным
        makeBigField() {
            
            let field = document.querySelector('.createrPost__fieldForImg');
            field.style['min-height'] = '150px';
            field.style.border = 'dashed';
        }

        //уменьшение поля при сбрасывании файла или переноса
        makeLittleField() {
            let field = document.querySelector('.createrPost__fieldForImg');
            field.style['min-height'] = '30px';
            field.style.border = 'dashed thin';
        }

        //задание копирования файлов
        setCopyFiles(){
            event.dataTransfer.dropEffect = 'copy';
        }
        //функционал для Drag'n'Drops 
        preventDefaults() {
            event.preventDefault();
            event.stopPropagation();
        }

        //Открытие скрытого поля при нажатии
        openField(){
            document.querySelector('.unvisibleField').style.display = 'block';
        }

        //Сохрание данных по нажатию (в разработке)
        createPost(){
            event.stopPropagation();
            let text = document.querySelector('.createrPost__fieldForText').value;
            console.log(text);
            this.Close();
        }
        //Вызов события закрытия кнопки окна
        Close() {
            let event = new Event('click');
            document.querySelector('.modal').dispatchEvent(event);
        }
        
    }
	return ModalCreatePost;
});  