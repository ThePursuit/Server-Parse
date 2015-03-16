

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
 * @param {String : playerID}
 * @return {Game : game} Returns a new game
 * @return {Player : player} Returns a player for the caller to use
 */
Parse.Cloud.define("createGame", function(request, response) {

    var Game = Parse.Object.extend("Game");
    var game = new Game();
    var gameID = makeid();

    game.set("gameID", gameID);
    game.save();

    createState(game, function(){
        alert("createGame: Added STATE to GAME successfully");
    });
    createPlayer(request.params.playerID, game, function(){
        alert("createGame: Added PLAYER to GAME successfully");
    });
    response.success(game);
});

function createState(game, callback) {
    var State = Parse.Object.extend("State");
    var state  = new State();

    state.set("startTime", null);
    state.set("isPlaying", false);
    state.save({
        success: function(state){
            alert("createState: Add STATE relation to GAME.")
            var relation = game.relation("state");
            relation.add(state);
            game.save({
                success: function(){
                    alert("createState: Saved GAME successfully, call function executed")
                    callback();
                },
                error: function(){
                    alert("createState: Failed to save GAME.")
                }
            });
        },
        error: function(error){
            alert("createState: State save error. " + error)
        }
    });
}

function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    var isUniqueID = false;

    do {
        for( var i = 0; i < 4; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        var gameQuery = new Parse.Query("Game");
        gameQuery.equalTo("gameID", text);
        gameQuery.count({
            success: function(result){
                if(result == 0 || result == null)
                    isUniqueID = true;
            }
        });
    }
    while(!isUniqueID);

    return text;
}

/**
* Join a created game with given gameID
*
* @method joinGame
* @param {String : gameID} A id to identify game to join. 
* @return {Game : game} Returns a created game.
* @return {Player : player} Returns a player for the caller to use
*/
Parse.Cloud.define("joinGame", function(request, response) {
  response.success("Game joined, id:");
});

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
