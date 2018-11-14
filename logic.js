'use strict';

window.onload = function () {
    $("#getSongs").click(function () {
        $("a").remove(".songEl");
        fetchTrackList();
    });

    $("#getArtists").click(function () {
        $("ol").remove(".artist-cont");
        fetchArtists();
    });


};

function fetchTrackList() {
    // console.log("it works: " + searchTerm);

    let apiKey = "3b7073a687cc95da319e6dff74046fac";
    // const URL_TEMPLATE = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" + akiKey + "&format=json";
    // const URL_TEMPLATE = "http://api.napster.com/v2.2/albums/new?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=5?genre=pop";
    const URL_TEMPLATE = "https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=3b7073a687cc95da319e6dff74046fac&format=json";

    return fetch(URL_TEMPLATE)
        .then(function (response) {
            let dataPromise = response.json();
            return dataPromise;
        })
        .then(function (data) {
            console.log(data);

            getTracks(data);

        })
}

function getTracks(data) {
    let trackArr = data['tracks']['track'];
    // console.log(trackArr);

    // Skip to a unique artist:
    var temp = "";
    var count = 0;
    var uniqueArtists = [];


    for (var i = 0; i < 50; i++) {
        let songName = trackArr[i].name;
        let artistName = trackArr[i]['artist'].name;
        let urlToPlaySong = trackArr[i].url;

        let albumLgImg = trackArr[i]['image'][2]['#text'];
        let albumXlImg = trackArr[i]['image'][3]['#text'];
        let singleSong = { songName: songName, artistName: artistName, urlToPlaySong: urlToPlaySong, albumLgImg: albumLgImg, albumXlImg: albumXlImg }

        if (!uniqueArtists.includes(singleSong.artistName)) {
            if (count != 9) {
                injectTopSongs(singleSong);
                uniqueArtists.push(singleSong.artistName);
                count++;
            }
        }
    }
}


function injectTopSongs(singleSong) {
    console.log(singleSong.artistName);

    console.log(singleSong.urlToPlaySong);

    var songEl = $('<div class="songEl"> </div>');
    var songEl = $('<a class="songEl" target="_blank"  href=' + singleSong.urlToPlaySong + '></a>');
    songEl.css("position", "relative");
    songEl.css("height", "35px");

    songEl.hover(function () {
        $(this).css({
            'opacity': '.7'
        });
    });

    songEl.hover(function () {
        $(this).css({
            'opacity': '.7'
        });
    }, function () {
        $(this).css({
            'opacity': '1'
        });
    });


    var imgEl = $('<img class="imageEl" src =' + singleSong.albumLgImg + '>');
    imgEl.css({ 'display': 'inline-block', "width": "100%", "margin-right": "5px", "background-repeat": "no-repeat", "background-size": "cover" });
    // imgEl.addClass('img-change');

    var textEl = $('<h2 class="song-name"></h2>');
    textEl.text(singleSong.songName);
    textEl.css({ 'background-color': 'white', 'opacity': '.92', 'padding': '5px', 'position': 'absolute', 'top': '50%', 'left': '50%', 'transform': 'translate(-50%, -50%)' });
    // textEl.css("font-size", "8px");

    songEl.append(textEl);
    songEl.append(imgEl);
    // songEl.append(buttonEl);
    songEl.css({ 'display': 'inline-block', "height": "100%", "margin-right": "5px", "background-repeat": "no-repeat", "background-size": "cover" });
    songEl.addClass("respoSongEl");

    // var clickDirect = $('<p>');
    // clickDirect.text("{ Click on Album Covers to open the Songs}");

    // $(".topSongsCont").append(clickDirect);


    $(".topSongsCont").append(songEl);

}

function fetchArtists() {
    let apiKey = "3b7073a687cc95da319e6dff74046fac";
    // const URL_TEMPLATE = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" + akiKey + "&format=json";
    // const URL_TEMPLATE = "http://api.napster.com/v2.2/albums/new?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=5?genre=pop";
    const URL_TEMPLATE = "https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=3b7073a687cc95da319e6dff74046fac&format=json";

    return fetch(URL_TEMPLATE)
        .then(function (response) {
            let dataPromise = response.json();
            return dataPromise;
        })
        .then(function (data) {
            getArtists(data);
        })
}

function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getArtists(data) {
    let artistArr = data['artists']['artist'];

    // console.log(artistLgImg);
    // var playCount = artistArr.playcount;

    var olElem = $('<ol> </ol>');
    for (var i = 0; i < 6; i++) {
        // Create Image Tag: 
        let artistMdImgLink = artistArr[i]['image'][1]['#text'];
        // console.log(artistMdImgLink);
        var imgElStr = "<img class='artist-pic' src='" + artistMdImgLink + "'>";
        // console.log(imgEl);

        // artist name and number of listeners:
        let artistName = artistArr[i].name;
        var numListeners = artistArr[i].listeners;
        numListeners = numberWithCommas(numListeners);
        // console.log(artistName);
        // console.log(numListeners);
        var textStr = "<strong>Name of Artist:</strong> " + artistName + " <br> <strong># of Listeners:</strong> " + numListeners;
        console.log(textStr);

        var pContainerEl = $('<p class="artist-bio">' + imgElStr + textStr + '</p>');

        var liEl = $('<li class="artist-li">' + '</li>');
        liEl.append(pContainerEl);
        // var liEl = $('<li>' + imgElStr + textStr + '</li>');




        // console.log(combStr);
        olElem.append(liEl);
    }

    olElem.addClass('artist-cont');

    $('.topArtistsCont').append(olElem);
}




