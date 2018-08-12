function welcomeFn() {
  var userName = document.getElementById("userName").value;
  if (userName == "") {
    UIkit.notification({message: '<span uk-icon=\'icon: warning\'></span> Error! Enter a Last.fm user name.', status: 'danger'});
  }
  else {
    UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Visualising your data now. Scroll down if on a mobile device.', status: 'primary'});
  }

  $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getinfo&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
    var lastfmUser = json.user.name;
    var totalScrobbles = '<b>' + json.user.playcount + '</b>';
    var totalScrobblesNum = json.user.playcount;
    var scrobbledSince = json.user.registered.unixtime;
    var imgSrc = json.user.image[2]['#text'];

    // Months array
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // Convert timestamp to milliseconds
    var date = new Date(scrobbledSince*1000);
    // Year
    var year = date.getFullYear();
    // Month
    var month = months_arr[date.getMonth()];
    // Day
    var day = date.getDate();
    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = '<b>' + month + ' ' + day + ', ' + year + '</b>' + '!';
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(scrobbledSince*1000);
    var secondDate = new Date();
    var diffDays = '<b>' + Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay))) + '</b>';
    var diffDaysNum = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    var songsPerDay = '<b>' + (totalScrobblesNum/diffDaysNum).toFixed() + '</b>';

    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&nowplaying=true&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
      var nowplaying = '<b>'+json.recenttracks.track[0]['name']+'</b>';
      var lastplayedImg = json.recenttracks.track[0]['image'][2]['#text'];
      var lastartistname = '<b>'+json.recenttracks.track[0]['artist']['#text']+'</b>';
      var lastalbumname = '<b>'+json.recenttracks.track[0]['album']['#text']+'</b>';

      $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
        var html = '';
        $.each(json.toptracks.track, function(i, item) {
          html += "<li>" + "<b>" + item.name + "</b>" + " - " + "Play count : " + item.playcount + "</li>";
        });

        document.getElementById("toptentracksLabel").innerHTML = "Your Top 10 Most Played Songs: -"
        $('#toptentracks').append(html);

        $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
          var html = '';
          $.each(json.topartists.artist, function(i, item) {
            html += "<li>" + "<b>" + item.name + "</b>" + " - " + "Play count : " + item.playcount + "</li>";
          });
          document.getElementById("toptenArtistsLabel").innerHTML = "Your Top 10 Most Played Artists: -"
          $('#toptenartists').append(html);

          $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=10&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
            var html = '';
            $.each(json.topalbums.album, function(i, item) {
              html += "<li>" + "<b>" + item.name + "</b>" + " - " + "Play count : " + item.playcount + "</li>";
            });
            document.getElementById("toptenAlbumsLabel").innerHTML = "Your Top 10 Most Played Albums: -"
            $('#toptenalbums').append(html);
          });
        });
      });

      document.getElementById("recentTracks").innerHTML = "Your last played song is : " + nowplaying + " by : " + lastartistname + " from the Album : " + lastalbumname;
      document.getElementById('lastplayed').src = lastplayedImg;
    });
    document.getElementById("welcome").innerHTML = "Hi" + " " + lastfmUser;
    document.getElementById("totalScrobbles").innerHTML = "You have heard a total of" + " " + totalScrobbles + " songs since joining Last.fm on " + convdataTime + " It means " + diffDays + " days have elapsed since then! Oh, it also means that you have listened to " + songsPerDay + " songs per day! Keep it up.";
    document.getElementById('image').src = imgSrc;
  });
}

google.charts.load('current', {'packages':['corechart']});
function drawChart() {
  var userName = document.getElementById("userName").value;
  $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&limit=20&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Song Title');
    data.addColumn('number', 'Play Count');
    for(var i = 0; i < json.toptracks.track.length; i++) {
      data.addRow([json.toptracks.track[i].name, parseInt(json.toptracks.track[i].playcount)]);
      var options = {
        title: "Most Played Tracks. (Hover mouse to see the title.)",
        hAxis: {textPosition: 'none'},
        chartArea: {width: '93%', height: '78%'},
        legend: {position: 'bottom'},
      };
      var chart = new google.visualization.ColumnChart(document.getElementById('mostplayedtracks'));
      chart.draw(data, options);
    }
    document.getElementById("top20tracksLabel").innerHTML = "And here are your Top 20 Most Played Songs: -"
  });

  $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&limit=20&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Artist');
    data.addColumn('number', 'Play Count');
    for(var i = 0; i < json.topartists.artist.length; i++) {
      data.addRow([json.topartists.artist[i].name, parseInt(json.topartists.artist[i].playcount)]);
      var options = {
        title: "Most Heard Artists. (Hover mouse to see the title.)",
        legend: 'bottom',
        chartArea: {width: '93%', height: '78%'},
        hAxis: { textPosition: 'none' },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById('mostplayedartists'));
      chart.draw(data, options);
    }
    document.getElementById("top20artistsLabel").innerHTML = "And here are your Top 20 Most Heard Artists: -"
  });

  $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&limit=20&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Album');
    data.addColumn('number', 'Play Count');
    for(var i = 0; i < json.topalbums.album.length; i++) {
      data.addRow([json.topalbums.album[i].name, parseInt(json.topalbums.album[i].playcount)]);
      var options = {
        title: "Most Heard Albums. (Hover mouse to see the title.)",
        legend: 'bottom',
        chartArea: {width: '93%', height: '78%'},
        hAxis: { textPosition: 'none' },
      };
      var chart = new google.visualization.ColumnChart(document.getElementById('mostplayedalbums'));
      chart.draw(data, options);
    }
    document.getElementById("top20albumsLabel").innerHTML = "And here are your Top 20 Most Heard Albums: -"
  });

}
