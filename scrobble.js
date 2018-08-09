function welcomeFn() {
  var userName = document.getElementById("userName").value;
  if (userName == "") {
    UIkit.notification({message: '<span uk-icon=\'icon: warning\'></span> Error! Enter a Last.fm user name.', status: 'danger'});
  }
  else {
    UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Visualising your data now. Scroll down if on a mobile device.', status: 'primary'});
  }
  $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getinfo&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
    var html = '';
    var lastfmUser = json.user.name;
    var totalScrobbles = json.user.playcount;
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
    var convdataTime = month + ' ' + day + ', ' + year + '!';

    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(scrobbledSince*1000);
    var secondDate = new Date();
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    console.log(imgSrc);
    var songsPerDay = (totalScrobbles/diffDays).toFixed();
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&nowplaying=true&api_key=6e616452b7c762a15256272ddb774c56&user=" + userName + "&format=json", function(json) {
      var nowplaying = json.recenttracks.track[0]['name'];
      var lastplayedImg = json.recenttracks.track[0]['image'][2]['#text'];
      var lastartistname = json.recenttracks.track[0]['artist']['#text'];
      var lastalbumname = json.recenttracks.track[0]['album']['#text'];
      console.log(lastplayedImg);
      document.getElementById("recentTracks").innerHTML = "Your last played song is : " + nowplaying + " by : " + lastartistname + " from the Album : " + lastalbumname;
      document.getElementById('lastplayed').src = lastplayedImg;
    });

    document.getElementById("welcome").innerHTML = "Hi" + " " + lastfmUser;
    document.getElementById("totalScrobbles").innerHTML = "You have scrobbled a total of" + " " + totalScrobbles + " songs since joining Last.fm on " + convdataTime + " It means " + diffDays + " days have elapsed since then! Oh, it also means that you have scrolled " + songsPerDay + " songs per day! Keep it up.";
    document.getElementById('image').src = imgSrc;
  });
}
