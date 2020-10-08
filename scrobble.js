// Function to display song information.
function welcomeFn() {
  var userName = document.getElementById("userName").value;
  if (userName == "") {
    UIkit.notification({
      message:
        "<span uk-icon='icon: warning'></span> Error! Enter a Last.fm user name.",
      status: "danger",
    });
  } else {
    UIkit.notification({
      message:
        "<span uk-icon='icon: check'></span> Visualising your data now. Scroll down if on a mobile device.",
      status: "primary",
    });
  }

  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.getinfo&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      var lastfmUser = json.user.realname;
      var totalScrobbles = "<b>" + json.user.playcount + "</b>";
      var totalScrobblesNum = json.user.playcount;
      var scrobbledSince = json.user.registered.unixtime;
      var imgSrc = json.user.image[2]["#text"];

      // Months array
      var months_arr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      // Convert timestamp to milliseconds
      var date = new Date(scrobbledSince * 1000);
      // Year
      var year = date.getFullYear();
      // Month
      var month = months_arr[date.getMonth()];
      // Day
      var day = date.getDate();
      // Display date time in MM-dd-yyyy h:m:s format
      var convdataTime = "<b>" + month + " " + day + ", " + year + "</b>" + "!";
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var firstDate = new Date(scrobbledSince * 1000);
      var secondDate = new Date();
      var diffDays =
        "<b>" +
        Math.round(
          Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
        ) +
        "</b>";
      var diffDaysNum = Math.round(
        Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
      );
      var songsPerDay =
        "<b>" + (totalScrobblesNum / diffDaysNum).toFixed() + "</b>";
      $.getJSON(
        "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&api_key=6e616452b7c762a15256272ddb774c56&user=" +
          userName +
          "&format=json",
        function (json) {
          var nowplaying = json.recenttracks.track[1]["name"];
          var lastplayedSongTime = json.recenttracks.track[1]["date"]["#text"];
          var lastplayedSongURL = json.recenttracks.track[1]["url"];
          var lastplayedImg = json.recenttracks.track[1]["image"][2]["#text"];
          var lastartistname = json.recenttracks.track[1]["artist"]["#text"];
          var lastalbumname =
            "<b>" + json.recenttracks.track[1]["album"]["#text"] + "</b>";
          document.getElementById("welcome").innerHTML =
            "Hi" + " " + lastfmUser;
          document.getElementById("totalScrobbles").innerHTML =
            "You have heard a total of" +
            " " +
            totalScrobbles +
            " songs since joining Last.fm on " +
            convdataTime +
            " It means " +
            diffDays +
            " days have elapsed since then! Oh, it also means that you have listened to " +
            songsPerDay +
            " songs per day! Keep it up.";
          document.getElementById("image").src = imgSrc;

          $.getJSON(
            "https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" +
              userName +
              "&format=json",
            function (json) {
              var html = "";
              var mostPlayedTrack = json.toptracks.track[0]["name"];
              var mostPlayedTrackArtist =
                json.toptracks.track[0]["artist"].name;
              var mostPlayedTrackImg =
                json.toptracks.track[0]["image"][2]["#text"];
              var mostPlayedTrackRanking =
                json.toptracks.track[0]["@attr"].rank;
              $.each(json.toptracks.track, function (i, item) {
                html +=
                  "<li>" +
                  "<b>" +
                  item.name +
                  "</b>" +
                  " - " +
                  "Play count : " +
                  item.playcount +
                  "</li>";
              });
              document.getElementById("toptentracksLabel").innerHTML =
                "Your Top 10 Most Played Songs: -";
              document.getElementById("toptentrackscard").hidden = false;
              document.getElementById(
                "mostplayedtrackimage"
              ).src = mostPlayedTrackImg;
              document.getElementById(
                "mostplayedsongtitle"
              ).innerHTML = mostPlayedTrack;
              document.getElementById("mostplayedsongartist").innerHTML =
                "by " + "<i>" + mostPlayedTrackArtist + "</i>";
              document.getElementById("mostplayedsongrank").innerHTML =
                "Ranking : # " + mostPlayedTrackRanking;
              $("#toptentracks").empty();
              $("#toptentracks").append(html);

              $.getJSON(
                "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" +
                  userName +
                  "&format=json",
                function (json) {
                  var html = "";
                  var mostPlayedArtist = json.topartists.artist[0]["name"];
                  var mostPlayedArtistImg =
                    json.topartists.artist[0]["image"][2]["#text"];
                  var mostPlayedArtistRanking =
                    json.topartists.artist[0]["@attr"].rank;
                  $.each(json.topartists.artist, function (i, item) {
                    html +=
                      "<li>" +
                      "<b>" +
                      item.name +
                      "</b>" +
                      " - " +
                      "Play count : " +
                      item.playcount +
                      "</li>";
                  });
                  document.getElementById("toptenArtistsLabel").innerHTML =
                    "Your Top 10 Most Played Artists: -";
                  document.getElementById("toptenartistscard").hidden = false;
                  document.getElementById(
                    "mostplayedartistimage"
                  ).src = mostPlayedArtistImg;
                  document.getElementById(
                    "mostplayedartist"
                  ).innerHTML = mostPlayedArtist;
                  document.getElementById("mostplayedartistrank").innerHTML =
                    "Ranking : # " + mostPlayedArtistRanking;
                  $("#toptenartists").empty();
                  $("#toptenartists").append(html);

                  $.getJSON(
                    "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" +
                      userName +
                      "&format=json",
                    function (json) {
                      var html = "";
                      var mostPlayedAlbum = json.topalbums.album[0]["name"];
                      var mostPlayedAlbumArtist =
                        json.topalbums.album[0]["artist"].name;
                      var mostPlayedAlbumImg =
                        json.topalbums.album[0]["image"][2]["#text"];
                      var mostPlayedAlbumRanking =
                        json.topalbums.album[0]["@attr"].rank;
                      $.each(json.topalbums.album, function (i, item) {
                        html +=
                          "<li>" +
                          "<b>" +
                          item.name +
                          "</b>" +
                          " - " +
                          "Play count : " +
                          item.playcount +
                          "</li>";
                      });
                      document.getElementById("toptenAlbumsLabel").innerHTML =
                        "Your Top 10 Most Played Albums: -";
                      document.getElementById(
                        "toptenalbumscard"
                      ).hidden = false;
                      document.getElementById(
                        "mostplayedalbumimage"
                      ).src = mostPlayedAlbumImg;
                      document.getElementById(
                        "mostplayedalbum"
                      ).innerHTML = mostPlayedAlbum;
                      document.getElementById(
                        "mostplayedalbumartist"
                      ).innerHTML =
                        "by " + "<i>" + mostPlayedAlbumArtist + "</i>";
                      document.getElementById("mostplayedalbumrank").innerHTML =
                        "Ranking : # " + mostPlayedAlbumRanking;
                      $("#toptenalbums").empty();
                      $("#toptenalbums").append(html);
                    }
                  );
                }
              );
            }
          );
          var musicIcon = '<i class="fas fa-compact-disc fa-spin"></i>';
          document.getElementById("recentTracks").innerHTML =
            musicIcon +
            " " +
            "Your last played song is : " +
            "<b>" +
            nowplaying +
            "</b>" +
            " by : " +
            "<b>" +
            lastartistname +
            "</b>" +
            " from the Album : " +
            lastalbumname;
          // $("#songVideo").attr("src","https://www.youtube-nocookie.com/embed/YE7VzlLtp-4");
          // document.getElementById('songVideo').src = "https://www.youtube-nocookie.com/embed?" + nowplaying + " " + lastartistname ;
          document.getElementById("lastplayed").src = lastplayedImg;
          document.getElementById("lastplayedsongdetails").hidden = false;
          document.getElementById("lastplayedsongtitle").innerHTML = nowplaying;
          document.getElementById("lastplayedsongtime").innerHTML =
            "Played on : " + lastplayedSongTime;
          document.getElementById("lastplayedsongdescription").innerHTML =
            "Artist : " +
            "<b>" +
            lastartistname +
            "</b>" +
            " Album : " +
            lastalbumname +
            ". To read more about the song, click the link below.";
          document.getElementById(
            "lastplayedsonglink"
          ).href = lastplayedSongURL;
          var encodedArtist = encodeURIComponent(lastartistname);
          var encodedTrackTitle = encodeURIComponent(nowplaying);
          var trackInfoURL =
            "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=6e616452b7c762a15256272ddb774c56" +
            "&username=" +
            userName +
            "&artist=" +
            encodedArtist +
            "&track=" +
            encodedTrackTitle +
            "&format=json";
          //var encodedURL = encodeURI(trackInfoURL);
          $.getJSON(trackInfoURL, function (json) {
            var trackUserPlayCount = json.track.userplaycount;
            var trackGlobalPlayCount = json.track.playcount;
            var trackListeners = json.track.listeners;
            var trackListenership = trackUserPlayCount / trackGlobalPlayCount;
            document.getElementById("trackuserplaycount").innerHTML =
              "You have played this song " +
              "<b>" +
              trackUserPlayCount +
              "</b>" +
              " times! " +
              "<b>" +
              trackListeners +
              "</b>" +
              " other listeners have also played this song." +
              " Your listenership is " +
              "<b>" +
              trackListenership.toFixed(4) +
              "</b>" +
              " based on the global play-count of " +
              "<b>" +
              trackGlobalPlayCount +
              "</b>" +
              ".";
          });
        }
      );
    }
  );
}

google.charts.load("current", { packages: ["corechart"] });
function drawChart() {
  var userName = document.getElementById("userName").value;
  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&limit=20&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Song Title");
      data.addColumn("number", "Play Count");
      for (var i = 0; i < json.toptracks.track.length; i++) {
        data.addRow([
          json.toptracks.track[i].name,
          parseInt(json.toptracks.track[i].playcount),
        ]);
        var options = {
          title: "Most Played Tracks. (Hover mouse to see the title.)",
          hAxis: { textPosition: "none" },
          chartArea: { width: "85%", height: "78%" },
          legend: { position: "bottom" },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("mostplayedtracks")
        );
        chart.draw(data, options);
      }
      document.getElementById("top20tracksLabel").innerHTML =
        "And here are your Top 20 Most Played Songs: -";
    }
  );

  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=20&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Artist");
      data.addColumn("number", "Play Count");
      for (var i = 0; i < json.topartists.artist.length; i++) {
        data.addRow([
          json.topartists.artist[i].name,
          parseInt(json.topartists.artist[i].playcount),
        ]);
        var options = {
          title: "Most Heard Artists. (Hover mouse to see the title.)",
          chartArea: { width: "85%", height: "78%" },
          legend: "bottom",
          hAxis: { textPosition: "none" },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("mostplayedartists")
        );
        chart.draw(data, options);
      }
      document.getElementById("top20artistsLabel").innerHTML =
        "And here are your Top 20 Most Heard Artists: -";
    }
  );

  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=20&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Album");
      data.addColumn("number", "Play Count");
      for (var i = 0; i < json.topalbums.album.length; i++) {
        data.addRow([
          json.topalbums.album[i].name,
          parseInt(json.topalbums.album[i].playcount),
        ]);
        var options = {
          title: "Most Heard Albums. (Hover mouse to see the title.)",
          chartArea: { width: "85%", height: "78%" },
          legend: "bottom",
          hAxis: { textPosition: "none" },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("mostplayedalbums")
        );
        chart.draw(data, options);
      }
      document.getElementById("top20albumsLabel").innerHTML =
        "And here are your Top 20 Most Heard Albums: -";
    }
  );

  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.gettoptags&limit=5&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Tags/Genre");
      data.addColumn("number", "Count");
      for (var i = 0; i < json.toptags.tag.length; i++) {
        data.addRow([
          json.toptags.tag[i].name,
          parseInt(json.toptags.tag[i].count),
        ]);
        var options = {
          title: "Top Tags/Genre. (Hover mouse to see the title.)",
          chartArea: { width: "85%", height: "95%" },
          pieSliceText: "label",
          legend: "none",
          pieHole: 0.4,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("toptags")
        );
        chart.draw(data, options);
      }
      document.getElementById("toptagsLabel").innerHTML =
        "Your Top Tags/Genre: -";
    }
  );
}

function fetchNumber() {
  var userName = document.getElementById("userName").value;
  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      $.getJSON(
        "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&api_key=6e616452b7c762a15256272ddb774c56&user=" +
          userName +
          "&format=json",
        function (json) {
          $.getJSON(
            "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&api_key=6e616452b7c762a15256272ddb774c56&user=" +
              userName +
              "&format=json",
            function (json) {
              var numUniqueAlbums = json.topalbums["@attr"].total;
              document.getElementById("numuniquealbums").innerHTML =
                "Albums : " + numUniqueAlbums;
            }
          );
          var numUniqueArtists = json.topartists["@attr"].total;
          document.getElementById("numuniqueartists").innerHTML =
            "Artists : " + numUniqueArtists + " ";
        }
      );
      var numUniqueTracks = json.toptracks["@attr"].total;
      document.getElementById("numunique").innerHTML =
        "In case you want to know how many distinct Tracks/Artists/Albums you have listened to, here the data is.";
      document.getElementById("numuniquetracks").innerHTML =
        "Tracks :  " + numUniqueTracks + " ";
    }
  );
}

function scrobblesDaily() {
  var userName = document.getElementById("userName").value;
  var date = new Date().setUTCHours(0, 0, 0, 0);
  var fromDate = date / 1000;
  var newFromDate = fromDate - 86400;
  var URL =
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&api_key=6e616452b7c762a15256272ddb774c56";
  $.getJSON(
    URL + "&user=" + userName + "&from=" + fromDate + "&format=json",
    function (json) {
      var todaysScrobbles = "<b>" + json.recenttracks["@attr"].total + "</b>";
      document.getElementById("todaysscrobbles").innerHTML =
        "You have listened to " + todaysScrobbles + " songs today.";
    }
  );
}

google.charts.load("current", { packages: ["gauge"] });
function uniqueTracks() {
  var userName = document.getElementById("userName").value;
  var apiURL =
    "https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" +
    userName +
    "&format=json";
  var apiURLGlobal =
    "https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=6e616452b7c762a15256272ddb774c56&limit=10&format=json";

  var request = new XMLHttpRequest();
  var requestGlobal = new XMLHttpRequest();
  request.open("GET", apiURL);
  requestGlobal.open("GET", apiURLGlobal);
  request.responseType = "json";
  requestGlobal.responseType = "json";
  var toptracksArray = [];
  var toptracksArrayGlobal = [];
  request.onload = function () {
    for (var i = 0; i < 10; i++) {
      var response = request.response.toptracks.track[i]["name"];
      toptracksArray.push(response);
    }
  };
  request.send();
  requestGlobal.onload = function () {
    for (var i = 0; i < 10; i++) {
      var response = requestGlobal.response.tracks.track[i]["name"];
      toptracksArrayGlobal.push(response);
    }
    var diff = $(toptracksArrayGlobal).not(toptracksArray).get();
    document.getElementById("trackuniqueness").innerHTML = "Unique-O-Meter";
    document.getElementById("diff").innerHTML =
      "Your listening taste uniqueness quotient is " +
      "<b>" +
      diff.length * 10 +
      "</b>" +
      ". It means " +
      (10 - diff.length) +
      " of your top 10 tracks match the global top 10!";
    var data = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["Uniqueness", diff.length * 10],
    ]);

    var options = {
      redFrom: 90,
      redTo: 100,
      yellowFrom: 75,
      yellowTo: 90,
      minorTicks: 5,
    };
    var chart = new google.visualization.Gauge(
      document.getElementById("uniquetracksguage")
    );
    chart.draw(data, options);
  };
  requestGlobal.send();
}

google.charts.load("current", { packages: ["gauge"] });
function uniqueArtists() {
  var userName = document.getElementById("userName").value;
  var apiURL =
    "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" +
    userName +
    "&format=json";
  var apiURLGlobal =
    "https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=6e616452b7c762a15256272ddb774c56&limit=10&format=json";

  var request = new XMLHttpRequest();
  var requestGlobal = new XMLHttpRequest();
  request.open("GET", apiURL);
  requestGlobal.open("GET", apiURLGlobal);
  request.responseType = "json";
  requestGlobal.responseType = "json";
  var topartistsArray = [];
  var topartistsArrayGlobal = [];
  request.onload = function () {
    for (var i = 0; i < 10; i++) {
      var response = request.response.topartists.artist[i]["name"];
      topartistsArray.push(response);
    }
  };
  request.send();
  requestGlobal.onload = function () {
    for (var i = 0; i < 10; i++) {
      var response = requestGlobal.response.artists.artist[i]["name"];
      topartistsArrayGlobal.push(response);
    }
    var diff = $(topartistsArrayGlobal).not(topartistsArray).get();
    document.getElementById("artistuniqueness").innerHTML = "Unique-O-Meter";
    document.getElementById("artist_diff").innerHTML =
      "Your Artist/Singer uniqueness quotient is " +
      "<b>" +
      diff.length * 10 +
      "</b>" +
      ". It means " +
      (10 - diff.length) +
      " of your top 10 Artists match the global top 10!";
    var data = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["Uniqueness", diff.length * 10],
    ]);
    var options = {
      redFrom: 90,
      redTo: 100,
      yellowFrom: 75,
      yellowTo: 90,
      minorTicks: 5,
    };
    var chart = new google.visualization.Gauge(
      document.getElementById("uniqueartistsguage")
    );
    chart.draw(data, options);
  };
  requestGlobal.send();
}

function firstSong() {
  var userName = document.getElementById("userName").value;
  var findPageURL =
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&page=200000&api_key=6e616452b7c762a15256272ddb774c56";
  $.getJSON(findPageURL + "&user=" + userName + "&format=json", function (
    json
  ) {
    var totalPages = json.recenttracks["@attr"].totalPages;
    var recentTracksURL =
      "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&api_key=6e616452b7c762a15256272ddb774c56" +
      "&user=" +
      userName +
      "&page=" +
      totalPages +
      "&format=json";
    $.getJSON(recentTracksURL, function (json) {
      var firstSongVar =
        json.recenttracks.track[json.recenttracks.track.length - 1]["name"];
      var firstArtist =
        json.recenttracks.track[json.recenttracks.track.length - 1]["artist"][
          "#text"
        ];
      var firstAlbum =
        json.recenttracks.track[json.recenttracks.track.length - 1]["album"][
          "#text"
        ];
      var firstSongDate =
        json.recenttracks.track[json.recenttracks.track.length - 1]["date"][
          "#text"
        ];
      var firstSongImage =
        json.recenttracks.track[json.recenttracks.track.length - 1]["image"][2][
          "#text"
        ];
      document.getElementById("firstsongmessage").innerHTML =
        "<U>" + "Details of your first scrobbled song." + "<U>";
      document.getElementById("firstsongname").innerHTML =
        "<b>" + "Title : " + "</b>" + firstSongVar;
      document.getElementById("firstartistname").innerHTML =
        "<b>" + "Artist : " + "</b>" + firstArtist;
      document.getElementById("firstalbumname").innerHTML =
        "<b>" + "Album : " + "</b>" + firstAlbum;
      document.getElementById("firstsongdate").innerHTML =
        "<b>" + "Date : " + "</b>" + firstSongDate;
      document.getElementById("firstsongimage").src = firstSongImage;
    });
  });
}

// Information about now playing song.
function currentPlaying() {
  var userName = document.getElementById("userName").value;
  $.getJSON(
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&nowplaying=true&page=1&api_key=6e616452b7c762a15256272ddb774c56&user=" +
      userName +
      "&format=json",
    function (json) {
      var currentPlayingSong = json.recenttracks.track[0]["name"];
      var currentPlayingSongArtist =
        json.recenttracks.track[0]["artist"]["#text"];
      var currentPlayingSongAlbum =
        json.recenttracks.track[0]["album"]["#text"];
      var musicIcon = '<i class="fas fa-music fa-spin"></i>';
      document.getElementById("nowplayingsong").innerHTML =
        musicIcon +
        " " +
        "Now playing : " +
        "<b>" +
        currentPlayingSong +
        "</b>" +
        " by : " +
        "<b>" +
        currentPlayingSongArtist +
        "</b>" +
        " from the Album : " +
        "<b>" +
        currentPlayingSongAlbum +
        "</b>";
    }
  );
}
