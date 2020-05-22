define(['css!component/player/player'], function(){
	if (!document.querySelector('.MainPageMobile')) {
		document.querySelector('.header .header__centre').innerHTML = ` 
			<div class="audio" id="audioHeader">
			  <audio class="audio__default"></audio>
			  <div class="audioPlayerHeader">
			    <div class="audio__icon audio__left" title="Предыдущая">
			      <svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
			    </div>
			    <div class="audio__icon audio__play audio__start" title="Начать">
			      <svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
			    </div>
			    <div class="audio__icon audio__right" title="Следующая">
			      <svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
			    </div>
			    <div class="audio-track">
			      <div class="audio-track-top">
			        <div class="audio-track__title"></div>
			        <div class="audio-track__time"></div>
			      </div>
			      <div class="audio-track-slider">
			        <div class="audio-track-slider__line">
			          <div class="audio-track-slider__currentLine"></div>
			          <div class="audio-track__hover"></div>
			          <div class="audio-track-slider__item"></div>
			        </div>
			      </div>
			    </div>
			    <div class="audio__icon audio__volume" title="Выключить звук">
			      <svg xmlns="http://www.w3.org/2000/svg" class="audio__icon_svg" viewBox="0 0 459 459"style="enable-background:new 0 0 459 459;"xml:space="preserve"><path d="M0,153v153h102l127.5,127.5v-408L102,153H0z M344.25,229.5c0-45.9-25.5-84.15-63.75-102v204C318.75,313.65,344.25,275.4,344.25,229.5z M280.5,5.1v53.55C354.45,81.6,408,147.899,408,229.5S354.45,377.4,280.5,400.35V453.9C382.5,430.949,459,339.15,459,229.5C459,119.85,382.5,28.049,280.5,5.1z"/></svg>
			    </div>
			    <div class="audio-volume">
			      <div class="audio-volume-slider__line">
			        <div class="audio-volume-slider__currentLine"></div>
			        <div class="audio-volume__hover"></div>
			        <div class="audio-volume-slider__item"></div>
			      </div>
			    </div>
			    <div class="audio__icon audio__repat" title="повторять">
			      <svg class="audio__icon_svg" style="enable-background:new 0 0 15.405 14.707;" version="1.1" viewBox="0 0 15.405 14.707" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M5.061,8L1.914,4.854h9.793c1.378,0,2.5,1.122,2.5,2.5h1c0-1.93-1.57-3.5-3.5-3.5H1.914l3.146-3.146L4.354,0L0,4.354  l4.354,4.354L5.061,8z"/><path d="M11.061,6l-0.708,0.706l3.14,3.147H3.707c-1.378,0-2.5-1.122-2.5-2.5h-1c0,1.93,1.57,3.5,3.5,3.5h9.786L10.353,14  l0.708,0.706l4.344-4.353L11.061,6z"/></svg>
			    </div>
			  </div>  
			</div>
		`;
	}
});