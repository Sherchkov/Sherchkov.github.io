// eslint-disable-next-line no-undef
define (['jquery'], function(){

    function audioPlayer() {
        let currentSong = 0;
        $('.audioPlayer')[0].src = $('.playlist li a')[0];
        $('.playlist li a').click(function (event) {
            event.preventDefault();
            $('.audioPlayer')[0].src = this;
            $('.audioPlayer')[0].play();
            $('.playlist li').removeClass('playlist__current-song');
            currentSong = $(this).parent().index();
            $(this).parent().addClass('playlist__current-song');
        });

        $('.audioPlayer')[0].addEventListener('ended', function () {
            currentSong++;
            if(currentSong == $('.playlist li a').length){
                currentSong = 0;
            }
            $('.playlist li').removeClass('playlist__current-song');
            $('.playlist li:eq(' + currentSong + ')').addClass('playlist__current-song');
            $('.audioPlayer')[0].src = $('.playlist li a')[currentSong].href;
            $('.audioPlayer')[0].play();
        });

        $('.audioPlayer')[0].addEventListener('loadeddata', () => {
            if (!document.querySelector('.MainPageMobile')) {
               if (!musicHeader) {
                   require(['component/action/player', 'server/json', 'component/player/player'], function(AudioPlayer, json){ 
                       musicHeader = new AudioPlayer(json.music, document.querySelector('#audioHeader'))
                       musicHeader.setPosition(currentSong);
                       musicHeader.setStartTitle();
                   });
               }else{
                   musicHeader.setPosition(currentSong);
                   musicHeader.setStartTitle();
               } 
            }
        });
    }
    
    return audioPlayer;
});
