(function() {

  var MainPage = function() {
    var self = this;
    var playerId = null;

    self.setPlayerId = function(id) {
      playerId = id;
 
    };
    
    self.setScores = function(scores) {

      var orderedScores = [];
      for(var playerid in scores) {
        orderedScores.push({
          playerid: playerid,
          name: scores[playerid].name,
          value: scores[playerid].score
        });
      }     

      orderedScores.sort(function(x, y) {
        return x.value > y.value ? -1 : 1;
      });    

      var scores = $('<ul></ul>');

      for(var x = 0; x < orderedScores.length; x++) {
        var value = orderedScores[x];

        var text = value.name;
        text += ' : ';
        text += value.value;

        var item = $('<li/>').text(text);

         if(value.playerid === playerId)
            item.addClass('current-player');

        scores.append(item);
      }

      $('#scores').html(scores);      
    };

  };

  $(document).ready(function() {
    GlobalViewModel = new MainPage();
  });
})();
