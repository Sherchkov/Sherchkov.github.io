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
            if (!musicHeader) {
                require(['Component/action/player', 'server/json', 'Component/player/player'], function(AudioPlayer, json){ 
                    musicHeader = new AudioPlayer(json.music, document.querySelector('#audioHeader'))
                    musicHeader.setPosition(currentSong);
                    musicHeader.setStartTitle();
                });
            }else{
                musicHeader.setPosition(currentSong);
                musicHeader.setStartTitle();
            }
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
            if (!musicHeader) {
                require(['Component/action/player', 'server/json', 'Component/player/player'], function(AudioPlayer, json){ 
                    musicHeader = new AudioPlayer(json.music, document.querySelector('#audioHeader'))
                    musicHeader.setPosition(currentSong);
                    musicHeader.setStartTitle();
                });
            }else{
                musicHeader.setPosition(currentSong);
                musicHeader.setStartTitle();
            }
        });
    }
    
    return audioPlayer;
});
