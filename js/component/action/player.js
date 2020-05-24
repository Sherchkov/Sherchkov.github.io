define(function(){
	class AudioPlayer {
		constructor(list, audio, options = {}) {
			this.list = list;
			this.flagTimerItem = false;
			this.flagTimerClock = false;
			this.position = options.position - 1 || -1;
			this.tempCurrentTime = 0;
			this.repeat = false;
			this.abort = false;

			this.audio = audio;
			this.player = audio.querySelector('.audio__default');
			this.player.volume = 0.5;

			this.prev = audio.querySelector('.audio__left');
			this.play = audio.querySelector('.audio__play');
			this.next = audio.querySelector('.audio__right');
			this.iconVolume = audio.querySelector('.audio__volume');

			this.title = audio.querySelector('.audio-track__title');
			this.residue = audio.querySelector('.audio-track__time');

			this.trackSliderLine = options.trackSlider || audio.querySelector('.audio-track-slider__line');
			this.trackSliderItem = this.trackSliderLine.querySelector('.audio-track-slider__item');
			this.tracktitle = this.trackSliderLine.querySelector('.audio-track__hover');
			this.mouseMoveHandler = this.move.bind(this);
			this.mouseUpHandler = this.endMove.bind(this);


			this.volumeSliderLine = options.volumeSlider || audio.querySelector('.audio-volume-slider__line');
			this.volumeSliderItem = this.volumeSliderLine.querySelector('.audio-volume-slider__item');
			this.volumetitle = this.volumeSliderLine.querySelector('.audio-volume__hover');
			this.volumeMoveHandler = this.volume.bind(this);
			this.volumeUpHandler = this.endVolume.bind(this);
			
			this.titleVisible = {};
			this.titleMoveHandler = this.titleMove.bind(this);

			this.setEventListener();
		}

		setEventListener(){
			this.audio.addEventListener('click', this.clickController.bind(this));
			this.player.addEventListener('loadeddata', this.duration.bind(this), true);
			this.player.addEventListener('ended', this.endAudio.bind(this), true);
			this.player.addEventListener('error', this.errorAudio.bind(this), true);
			this.trackSliderItem.addEventListener('mousedown', this.startMove.bind(this));
			this.trackSliderLine.addEventListener('mouseenter', this.titleHover.bind(this));
			this.volumeSliderItem.addEventListener('mousedown', this.startMove.bind(this));
			this.volumeSliderLine.addEventListener('mouseenter', this.titleHover.bind(this));
		}

		defaultSetting(){
			this.flagTimerItem = false;
			this.trackSliderItem.style.left = '0px';
			this.trackSliderLine.querySelector('.audio-track-slider__currentLine').style.width = '0px'; 
		}

		clickController(event){
			let element = event.target;
			if (element.closest('.audio__left')) {
				this.prevAudio();
			}else if (element.closest('.audio__start')) {
				if (!this.list.length || this.position < 0 || this.position >= this.list.length) {
					return;
				}
				this.play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 12 12"> <path stroke-linecap="round" stroke-width="2" d="M4 2v8m4-8v8"/></svg>';
				this.play.className = 'audio__icon audio__play audio__pause';
				this.play.title = 'Остановить';   
				this.playAudio();
			}else if (element.closest('.audio__pause')) {
				this.pause();
			}else if (element.closest('.audio__right')) {
				this.nextAudio();
			}else if (element.closest('.audio__volume')) {
				if (this.iconVolume.classList.contains('audio__volume_off')) {
					this.player.muted = false;
					this.iconVolume.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 459 459"style="enable-background:new 0 0 459 459;"xml:space="preserve"><path d="M0,153v153h102l127.5,127.5v-408L102,153H0z M344.25,229.5c0-45.9-25.5-84.15-63.75-102v204C318.75,313.65,344.25,275.4,344.25,229.5z M280.5,5.1v53.55C354.45,81.6,408,147.899,408,229.5S354.45,377.4,280.5,400.35V453.9C382.5,430.949,459,339.15,459,229.5C459,119.85,382.5,28.049,280.5,5.1z"/></svg>';
					this.iconVolume.classList.remove('audio__volume_off');
					this.iconVolume.title = 'Выключить звук';
				}else{
					this.player.muted = true;
					this.iconVolume.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 461.55 461.55" style="enable-background:new 0 0 461.55 461.55;" xml:space="preserve"><path d="M345.525,229.5c0-45.9-25.5-84.15-63.75-102v56.1l63.75,63.75C345.525,239.7,345.525,234.6,345.525,229.5z M409.275,229.5c0,22.95-5.1,45.9-12.75,66.3l38.25,38.25c17.85-30.6,25.5-68.85,25.5-107.1c0-109.65-76.5-201.45-178.5-224.4V56.1C355.725,81.6,409.275,147.9,409.275,229.5z M34.425,0L1.275,33.15L121.125,153H1.275v153h102l127.5,127.5V262.65L340.425,372.3c-17.851,12.75-35.7,22.95-58.65,30.601v53.55c35.7-7.65,66.3-22.95,94.35-45.9l51,51l33.15-33.149l-229.5-229.5L34.425,0z M230.775,25.5l-53.55,53.55l53.55,53.55V25.5z"/></svg>';
					this.iconVolume.classList.add('audio__volume_off');
					this.iconVolume.title = 'Включить звук';
				}
			}else if (element.closest('.audio__repat')) {
				if (this.repeat === false) {
					this.repeat = true;
					this.audio.querySelector('.audio__repat').classList.add('audio__repat_blue');
				}else{
					this.repeat = false;
					this.audio.querySelector('.audio__repat').classList.remove('audio__repat_blue');
				}
			}else if (!element.closest('.audio-track-slider__item') && element.closest('.audio-track-slider__line')) {
				this.flagTimerItem = false;
				this.flagTimerClock = false;
				this.move(event);
				this.setDistance();
			}else if (!element.closest('.audio-volume-slider__item') && element.closest('.audio-volume-slider__line')) {
				this.volume(event);
			}	
		}

		pause(){
			this.flagTimerItem = false;
			this.flagTimerClock = false;
			this.play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
			this.play.className = 'audio__icon audio__play audio__start';
			this.play.title = 'Продолжить';
			this.player.pause();
		}

		setDistance(value){
			this.player.currentTime = value || this.tempCurrentTime;
			if (this.play.classList.contains('audio__pause')) {
				this.flagTimerItem = true;
				this.stepAudio();
				this.timer(); 
			}
		}

		duration(){
			this.trackSliderItem.setAttribute('time', Math.floor(this.player.duration));
			if (this.abort === true) {
				this.abort = false;
			}else{
				this.playAudio();
			}
			
		}

		endAudio(){
			this.flagTimerItem = false;
			this.flagTimerClock = false;
			document.removeEventListener('mousemove', this.mouseMoveHandler);
	   		document.removeEventListener('mouseup', this.mouseUpHandler);
	   		if (this.repeat) {
	   			this.position--;
	   		}
			this.nextAudio();
		}

		prevAudio(){
			this.defaultSetting();
			if (!this.check()) {
				return;
			}
			this.position--;
			if (this.position < 0) {
				this.position = this.list.length - 1;
			}
			this.player.setAttribute('src', this.list[this.position].src);
			this.play.className = 'audio__icon audio__play audio__pause';
			this.play.title = 'Остановить';
			this.play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 12 12"> <path stroke-linecap="round" stroke-width="2" d="M4 2v8m4-8v8"/></svg>';
			this.title.innerText = this.list[this.position].src.replace(/\.[^.]+$/, '').replace('mp3/', '');
		}

		playAudio(){
			this.player.play();
			this.flagTimerItem = true;
			this.flagTimerClock = true;
			this.stepAudio();
			this.timer();
		}

		nextAudio(){
			this.defaultSetting();
			if (!this.check()) {
				return;
			}
			this.position++;
			if (this.position >= this.list.length) {
				this.position = 0;
			}
			this.player.setAttribute('src', this.list[this.position].src);
			this.play.className = 'audio__icon audio__play audio__pause';
			this.play.title = 'Остановить';
			this.play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 12 12"> <path stroke-linecap="round" stroke-width="2" d="M4 2v8m4-8v8"/></svg>';
			this.title.innerText = this.list[this.position].src.replace(/\.[^.]+$/, '').replace('mp3/', '');
		}

		check(){
			if (!this.list.length) {
				this.position = -1;
				this.title.innerText = '';
				this.player.setAttribute('src', '');
				this.play.className = 'audio__icon audio__play audio__start';
				this.residue.innerText = '';
				return false;
			}
			return true;
		}
		
		timer(){
			if (this.flagTimerItem === true || this.flagTimerClock === true ) {
				setTimeout(this.stepAudio.bind(this), 1000);
			}
		}

		stepAudio(){
			if (this.flagTimerItem === true || this.flagTimerClock === true) {
				let number = this.player.currentTime;
				let second = Math.floor(number % 60).toString();
				if (second.length === 1) {
					second = '0' + second;
				}
				this.residue.innerText = Math.floor(number / 60) + ':' + second;

				if (this.flagTimerItem === true) {
					let max = this.trackSliderItem.getAttribute('time');
					let right = this.trackSliderLine.offsetWidth;

					this.trackSliderItem.style.left = number * right / max + 'px';	
					this.trackSliderLine.querySelector('.audio-track-slider__currentLine').style.width = number * right / max + 'px';
				}

				this.timer();
			}
		}

		startMove(event){
			if (event.target === this.trackSliderItem) {
				this.flagTimerItem = false;
				this.trackSliderItem.style.width = '10px';
				this.trackSliderItem.style.height = '10px';
				document.addEventListener('mousemove', this.mouseMoveHandler);
	   			document.addEventListener('mouseup', this.mouseUpHandler);
			}else if (event.target === this.volumeSliderItem) {
				this.volumeSliderItem.style.width = '10px';
				this.volumeSliderItem.style.height = '10px';
				document.addEventListener('mousemove', this.volumeMoveHandler);
	   			document.addEventListener('mouseup', this.volumeUpHandler);
			}
		}

		move(event){
			document.ondragstart = function() {
	     		return false;
	   		};

			let right = this.trackSliderLine.offsetWidth;   
			let newLeft = event.pageX - this.trackSliderLine.getBoundingClientRect().left - pageXOffset;
			let time = this.trackSliderItem.getAttribute('time');
			   
			if(newLeft < 0) {
				newLeft = 0;
			}
			if (newLeft > right) {
				newLeft = right;
			}

			this.trackSliderItem.style.left = newLeft + 'px'; 
			this.trackSliderLine.querySelector('.audio-track-slider__currentLine').style.width = newLeft + 'px';
		   	this.tempCurrentTime = newLeft / right * time;

		   	this.tracktitle.style.left = newLeft + 'px'; 
			let second = Math.floor(this.tempCurrentTime % 60).toString();
			if (second.length === 1) {
				second = '0' + second;
			}
			this.tracktitle.innerText = Math.floor(this.tempCurrentTime / 60) + ':' + second;
			this.tracktitle.style.display = 'block';
		}

		endMove(){
			if (!this.titleVisible.flag) {
				this.titleVisible.title.style.display = 'none';

			}
			this.trackSliderItem.style.width = '';
			this.trackSliderItem.style.height = '';
			document.removeEventListener('mousemove', this.mouseMoveHandler);
	   		document.removeEventListener('mouseup', this.mouseUpHandler);
	   		this.setDistance();
		}

		volume(){
			document.ondragstart = function() {
	     		return false;
	   		};
			let right = this.volumeSliderLine.offsetWidth;   
			let newLeft = event.pageX - this.volumeSliderLine.getBoundingClientRect().left - pageXOffset;
			if(newLeft < 0) {
				newLeft = 0;
			}
			if (newLeft > right) {
				newLeft = right;
			}

			let newVolume = Math.floor(newLeft * 100 / right);

			this.volumetitle.style.left = newLeft + 'px';
			this.volumetitle.innerText = newVolume + '%';
			this.volumetitle.style.display = 'block';

			this.volumeSliderItem.style.left = newLeft + 'px';   
			this.volumeSliderLine.querySelector('.audio-volume-slider__currentLine').style.width = newLeft + 'px';
		   	this.player.volume = newLeft / right; 
		}

		endVolume(){
			this.volumeSliderItem.style.width = '';
			this.volumeSliderItem.style.height = '';
			if (!this.titleVisible.flag) {
				this.titleVisible.title.style.display = 'none';
			}
			document.removeEventListener('mousemove', this.volumeMoveHandler);
	   		document.removeEventListener('mouseup', this.volumeUpHandler);
		}

		titleHover(event){
			if (event.target === this.volumeSliderLine) {
				this.titleVisible = {
					flag : true,
					line : this.volumeSliderLine,
					item : this.volumeSliderItem,
					title : this.volumetitle
				};
			}else if (event.target === this.trackSliderLine) {
				this.titleVisible = {
					flag : true,
					line : this.trackSliderLine,
					item : this.trackSliderItem,
					title : this.tracktitle
				};
			}else{
				return;
			}

			this.titleVisible.title.style.display = 'block';
			this.titleVisible.line.addEventListener('mouseleave', this.endTitleHover.bind(this));
			document.addEventListener('mousemove', this.titleMoveHandler);
		}

		titleMove(){
			document.ondragstart = function() {
	     		return false;
	   		};
			let right = this.titleVisible.line.offsetWidth;   
			let newLeft = event.pageX - this.titleVisible.line.getBoundingClientRect().left - pageXOffset;
			
			if(newLeft < 0) {
				newLeft = 0;
			}
			if (newLeft > right) {
				newLeft = right;
			}

			this.titleVisible.title.style.left = newLeft + 'px';
			if (this.titleVisible.title === this.volumetitle) {
				this.volumetitle.innerText = Math.floor(newLeft * 100 / right) + '%';
			}else if (this.titleVisible.title === this.tracktitle) {
				let time = this.trackSliderItem.getAttribute('time') || 0;
				let number = newLeft * time / right;
				let second = Math.floor(number % 60).toString();
				if (second.length === 1) {
					second = '0' + second;
				}
				this.tracktitle.innerText = Math.floor(number / 60) + ':' + second;
			}
		}

		endTitleHover(){
			this.titleVisible.flag = false;
			this.titleVisible.title.style.display = 'none';
			this.titleVisible.line.removeEventListener('mouseleave', this.endTitleHover.bind(this));
			document.removeEventListener('mousemove', this.titleMoveHandler);
		}

		errorAudio(event){
			this.nextAudio();
		}

		
		delete(id){
			for (let i = 0; i < this.list.length; i++){
				if (this.list[i].id === id) {
					if (this.position < i) {
						this.list.splice(i, 1);
					}else if (this.position === i) {
						if (this.position === this.list.length - 1) {
							this.position = -1;
						}else{
							this.position--;
						}
						this.list.splice(i, 1);
						this.nextAudio();

						
					}else{
						this.position--;
						this.list.splice(i, 1);
					}
				}
			}
		}

		addList(list){
			this.list = this.list.concat(list);
		}

		updateList(list){
			this.position = -1;
			this.list = list;
			this.nextAudio();
		}

		setPosition(number){
			this.position = number - 1;
		}

		setStartTitle(){
			this.defaultSetting();
			if (!this.check()) {
				return;
			}
			this.position++;
			if (this.position >= this.list.length) {
				this.position = 0;
			}
			this.player.setAttribute('src', this.list[this.position].src);
			this.play.className = 'audio__icon audio__play audio__start';
			this.play.title = 'Продолжить';
			this.residue.innerText = '0:00';
			this.play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>';
			this.abort = true;
			this.title.innerText = this.list[this.position].src.replace(/\.[^.]+$/, '').replace('mp3/', '');
		}		
	}
	return AudioPlayer;
});