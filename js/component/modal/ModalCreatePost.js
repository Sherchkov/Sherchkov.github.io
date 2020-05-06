// eslint-disable-next-line no-undef
define(['base/component', 'css!component/modal/ModalCreatePost'], function (Component) {
    'use strict';
    var tensor = new URL ('https://tensor-school.herokuapp.com/');

    class ModalCreatePost extends Component{
        
        idPhotosBeforeUpdate = {};
        idPhotosAfterUpdate = {};
        idPhotosWasUpdate = {};

        render() {
            return `<div class='createrPost'>
                        <p class='createrPost__text createrPost__header'>Создание записи</p>
                        <textarea class='createrPost__fieldForText' placeholder="Введите текст записи"></textarea>
                        <p class='createrPost__text'>Вы можете перенести сюда фото</p>
                        <div class='createrPost__fieldForImg'>
                            <div class='uploadingPhoto'>
                            </div>
                        </div>
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
            //навешивание на форму выбора действия
            document.querySelector('.modal-content').classList.add('modal-content_big');
            this.subscribeTo(this.getContainer(), 'click', this.chooseAction.bind(this));
            
            this.putCurrentListPhotos(this.idPhotosBeforeUpdate);
            
            //установка всех событий на элемент для drop
            let elementForDrop = document.querySelector('.createrPost__fieldForImg');
            let arrayOfEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
            arrayOfEvents.forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.preventDefaults));
            ['dragenter', 'dragover'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.makeBigField));
            ['dragover', 'drop'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.setCopyFiles));
            ['dragleave', 'drop'].forEach(eventName => this.subscribeTo(elementForDrop, eventName, this.makeLittleField));
            document.querySelector('input[id=fileElem]').onchange = this.fromAddButtton.bind(this);
            this.subscribeTo(elementForDrop, 'drop', this.handleDrop.bind(this));
            //this.clearGallery();
        }

        beforeUnmount(){
            let arrayOfEvents = ['dragenter', 'dragover', 'dragleave', 'drop', 'click'];
            arrayOfEvents.forEach(eventName => this.unsubscribeByEvent(eventName));
        }

        //положить в нужный массив список фотографий
        async putCurrentListPhotos(arrayForPut){
            let ids = await this.getListPhoto();
            this.getId(await ids, arrayForPut);
            console.log(arrayForPut);
        }

        //функция выбора навешиваемой функции
        chooseAction(event){
			if (event.target.classList.contains('createrPost__buttonCreate')) {
				this.createPost();
			} else if (event.target.classList.contains('createrPost__buttonUnvisibleField')) {
				this.openField();
			} 
        }

        //обработчик скидывания
        async handleDrop(){
            let dt = event.dataTransfer;
            let files = await dt.files;
            this.handleFiles(await files);
        }

        //передача файлов в обработку с доп кнопки
        async fromAddButtton(){
            let dt = event.srcElement;
            let files = await dt.files;
            this.handleFiles(await files);
        }

        //выполнение для каждого файла загрузки
        handleFiles(files) {
            let requests = [...files].map(file => this.uploadFile(file)); 
            
            Promise.all(requests)
            .then(() => this.getListPhoto())
            .then(() => this.putCurrentListPhotos(this.idPhotosAfterUpdate));
        }

        //загрузка
        async uploadFile(file){
            let loadPhoto = new URL ('/photo/upload', tensor);
            let response = await fetch(loadPhoto, {
                method : 'POST',
                headers: {'Content-Type': 'image/png'},
                body: file,
                credentials: 'include'
                });

            if (response.status == 201) {
                return await response;
            }

            throw new Error (response.status);         
        }

        //получение всех Id фотографий для работы с ними
        async getListPhoto(){
            // eslint-disable-next-line no-undef
            let getPhotos = new URL (`/photo/list/${user_id}`, tensor);
            let response = await fetch(getPhotos, {
                method : 'GET',
				mode: 'cors',
                credentials: 'include'
            });
            if (response.status == 200) {
                let json = await response.json();
                return await json.photos;
            }

            throw new Error (response.status); 
        }

        //добавление id к массиву
        getId(startArrayOfIds, finalArrayOfIds){
            for (let key in startArrayOfIds) {
                finalArrayOfIds[startArrayOfIds[key]['id']] = startArrayOfIds[key]['path'];
            }
        } 

        //очистка галереи (вспомогательная функция при разработке)
        clearGallery(){
            // eslint-disable-next-line no-undef
            let getPhotos = new URL (`/photo/list/${user_id}`, tensor);

            fetch(getPhotos, {
                method : 'GET',
				mode: 'cors',
                credentials: 'include'
            }).then(response => response.json())
            .then(result => result.photos) 
            .then(photos => {for (let photo of photos){
                this.deletePhoto(photo);
            }});
        }

        //удаление фото
        deletePhoto(photo){
            let urlencoded = new URLSearchParams();
            urlencoded.append('photo_id', photo.id);
            let deletePhoto = new URL ('/photo/delete', tensor);

            fetch(deletePhoto, {
                method : 'POST',                
				mode: 'cors',
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
				body: urlencoded,
                credentials: 'include'
            }).then(response => console.log(response))
            .catch(error => console.log('error', error));
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

        //отмена выполнения обработчика браузера и всплытия 
        preventDefaults() {
            event.preventDefault();
            event.stopPropagation();
        }

        //задание копирования файлов
        setCopyFiles(){
            event.dataTransfer.dropEffect = 'copy';
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
        
        //функция на стадии разработки!!!
        previewFile(file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function(){
                let img = document.createElement('img');
                img.src = reader.result;
                document.querySelector('.uploadingPhoto').appendChild(img);
            };
        }
    }
	return ModalCreatePost;
});  