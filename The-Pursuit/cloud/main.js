

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


/**
 * Join a created game with given gameID
 *
 * @method joinGame
 * @param {String : gameID} A id to identify game to join.
 * @param {String : playerID} A id to identify the player.
 * @return {Game : game} Returns a created game.
 * //@return {Player : player} Returns a player for the caller to use
 */
Parse.Cloud.define("joinGame", function(request, response){

    var gameQuery = new Parse.Query("Game");
    gameQuery.equalTo("gameID", request.params.gameID);
    gameQuery.first({
        success: function(game){
            createPlayer(request.params.playerID, game, function(){
                alert("joinGame: Added PLAYER to GAME successfully, return GAME object");
                response.success(game);
            });
        },
        error: function(){
            response.error("joinGame: No game with that gameID found");
        }
    });
});

function createPlayer(playerID, game, callback) {

    var Player = Parse.Object.extend("Player");
    var player  = new Player();
    var location = new Parse.GeoPoint(0,0);

    //TODO: Check if playerID is already in use

    player.set("playerID", playerID);
    player.set("playerColor", null);
    player.set("isReady", false);
    player.set("isPrey", false);
    player.set("location", location);

    player.save({
        success: function(player){
            alert("createPlayer: Add PLAYER-relation to GAME");
            var relation = game.relation("players");
            relation.add(player);

            game.save({
                success: function(){
                    alert("createPlayer: Saved GAME object, call function executed");
                    callback();
                },
                error: function(){
                    alert("createPlayer: Failed to save GAME object")
                }
            });
        },
        error: function(){
            alert("createPlayer: Failed to add PLAYER-relation to GAME");
        }
    });
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
