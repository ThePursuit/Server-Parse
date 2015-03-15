

// Modified metod from exemple
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello, " + request.params.name + "!");
});

/**
* Saves the callers location and returns the state of the
* game.
*
* @method updateGame
* @param {Player : player} Player to update state with
* @return {Game : game} Returns updated GameState
*/
Parse.Cloud.define("updateGame", function(request, response) {

  // Update game state	
  // TODO: Not finished
  var Hunter = Parse.Object.extend("Hunter");
  var hunter = new Hunter();
  hunter.set("long", request.params.long);
  hunter.set("lat", request.params.lat);
  hunter.save();

  // Return gameState
  // TODO: Not done
  response.success();
});

/**
* Creates a new game with caller as a player.
*
* @method createGame
* @return {Player : player} Returns a player for the caller to use
* @return {Game : game} Returns a new game
*/
Parse.Cloud.define("createGame", function(request, response) {
  response.success("Game created");
});

Parse.Cloud.define("createPlayer", function(request, response){
    var Player = Parse.Object.extend("Player");
    var player = new Player();
    player.set("gameID", "123");
    player.set("playerID", request.params.playerID);
    player.set("playerColor", request.params.playerColor);
    player.set("isPrey", false);
    player.save();
  //  response.success();
});

/**
 * Join a created game with given gameID
 *
 * @method joinGame
 * @param {String : gameID} A id to identify game to join.
 * @param {String : playerID} A id to identify the player.
 * @return {Game : game} Returns a created game with the player in the game.
 */
Parse.Cloud.define("joinGame", function(request, response){
 
    var query = new Parse.Query("Game");
    query.equalTo("gameID", request.params.gameID);
    query.first({
        success: function(object){
          createPlayer(request.params.playerID, object, function() {
            alert("Added PLAYER to GAME successfully, returns GAME object");
            response.success(object);
          });
        },
        error: function(){
            response.error("No game with that gameID found");
        }
    });

});
 
function createPlayer(playerID, object, callback) {

  var Player = Parse.Object.extend("Player");
    var player  = new Player();
  var Coordinate = Parse.Object.extend("Coordinate");
    var location = new Coordinate();

    player.set("playerID", playerID);
    player.set("playerColor", "black");
    player.set("isReady", false);
    player.set("isPrey", false);

    location.set("longitude", "0");
    location.set("latitude","0");
    //Since javascript is asynchronous, we have to make callback functions like these...
    location.save({
      success: function(location){
        alert("Add LOCATION-relation to PLAYER")
        var relation = player.relation("location");
        relation.add(location);

        player.save({
          success: function(player){
            alert("Add PLAYER-relation to GAME");
            var relation = object.relation("players");
            relation.add(player);

                object.save({
                success: function(object){
                  alert("Saved GAME object, callback function executed");
                  callback();
                },
                error: function(object, error){
                  alert("Failed to save GAME object");
                }
              });

          },
          error: function(player, error){
            alert("Failed to add PLAYER-relation to GAME");
          }
        });

      },
      error: function(location, error){
        alert("Failed to add LOCATION-relation to PLAYER")
      }
    })

}

/**
* Try to catch prey, if player is to far a way a time penealty
* is issued. Otherwise prey is catched and gameState is updated.
*
* @method tryCatch
* @param {Player: player} Player to update state with
* @return {Game} Returns updated GameState
*/
Parse.Cloud.define("tryCatch", function(request, response) {
  response.success("Trying to catch prey");
});
