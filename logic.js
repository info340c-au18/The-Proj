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

// Calls API and retrieves information on the Top Songs right now: 
function fetchTrackList() {
    let apiKey = "3b7073a687cc95da319e6dff74046fac";
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

// Retrieves specific information (song name, artost name, url to song, album image) on each song: 
function getTracks(data) {
    let trackArr = data['tracks']['track'];

    // Skip to a unique artist:
    var temp = "";
    var count = 0;
    var uniqueArtists = [];

    // Gets the top 50 popular songs (extra may be used for adding on later features):
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

// Injects all the gathered information on each song, creates html elements and styles, and injects into the DOM.
function injectTopSongs(singleSong) {
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
    var textEl = $('<h2 class="song-name"></h2>');
    textEl.text(singleSong.songName);
    textEl.css({ 'background-color': 'white', 'opacity': '.92', 'padding': '5px', 'position': 'absolute', 'top': '50%', 'left': '50%', 'transform': 'translate(-50%, -50%)' });

    songEl.append(textEl);
    songEl.append(imgEl);
    songEl.css({ 'display': 'inline-block', "height": "100%", "margin-right": "5px", "background-repeat": "no-repeat", "background-size": "cover" });
    songEl.addClass("respoSongEl");

    $(".topSongsCont").append(songEl);
}

// Calls API and retrieves information on the Top Artists right now: 
function fetchArtists() {
    let apiKey = "3b7073a687cc95da319e6dff74046fac";
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

// Helper: Takes in a number, converts to string, and adds commas for big numbers: 
function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// Retrieves specific information (image url, artist name, number of listeners) on each Artist: 
function getArtists(data) {
    let artistArr = data['artists']['artist'];
    var olElem = $('<ol> </ol>');

    var xCoords = [];
    var yCoords = [];

    // Gets only 6 Artists: 
    for (var i = 0; i < 6; i++) {
        // Create Image Tag: 
        let artistMdImgLink = artistArr[i]['image'][1]['#text'];
        var imgElStr = "<img class='artist-pic' src='" + artistMdImgLink + "'>";

        // artist name and number of listeners:
        let artistName = artistArr[i].name;
        var numListeners = artistArr[i].listeners;
        numListeners = numberWithCommas(numListeners);
        var textStr = "<strong>Name of Artist:</strong> " + artistName + " <br> <strong># of Listeners:</strong> " + numListeners;

        var pContainerEl = $('<p class="artist-bio">' + imgElStr + textStr + '</p>');
        var liEl = $('<li class="artist-li">' + '</li>');
        liEl.append(pContainerEl);
        olElem.append(liEl);

        xCoords.push(artistName);
        yCoords.push(numListeners);
    }


    // Prepares data / settings for plot:
    var data = [
        {
            x: xCoords,
            y: yCoords,
            type: 'bar',
            marker: {
                color: '#ff3333',
            }
        }
    ];

    // Creates a layout to plot:
    var layout = {
        title: 'Top Artists Right Now:',
        font: {
            family: 'Raleway, sans-serif'
        },
        showlegend: false,
        xaxis: {
            tickangle: -45
        },
        yaxis: {
            zeroline: false,
            gridwidth: 2
        },
        bargap: 0.05
    };

    // Adds plot with the settings (layout, data) to DOM:
    Plotly.newPlot('plotDiv', data, layout);

    // Adds to the DOM: 
    olElem.addClass('artist-cont');
    $('.topArtistsCont').append(olElem);

}




