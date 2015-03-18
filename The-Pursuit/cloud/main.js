

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
        //not sure how Query.count works but hopefully this works as intended
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
 * Set the rules for a given game.
 *
 * @method setRules
 * @param {String : gameID} A id to identify game to join.
 * @param {Int : radius} the radius of the game area
 * @param {Int : catchRadius} the radius of the accepted catch radius
 * @param {Int : duration} the duration of the game
 * @param {Int : maxPlayers} maximum number of players
 * @return {Game : game} Returns the game with the new rules.
 */
 Parse.Cloud.define("setRules", function(request, response) {

    var gameQuery = new Parse.Query("Game");

    gameQuery.equalTo("gameID", request.params.gameID);
    gameQuery.first({
        success: function(game) {
            setRules(
                game,
                request.params.radius,
                request.params.catchRadius,
                request.params.duration,
                request.params.maxPlayers,
                function(){
                    alert("setRules: Added RULES to GAME successfully")
                }
            );
            response.success(game);
        },
        error: function() {
            response.error("setRules: Game does not exist");
        }
    });
});

function setRules(game, radius, catchRadius, duration, maxPlayers, callback) {
    var Rules = Parse.Object.extend("Rules");
    var rules  = new Rules();

    rules.set("radius", radius);
    rules.set("catchRadius", catchRadius);
    rules.set("duration", duration);
    rules.set("maxPlayers", maxPlayers);
    rules.save({
        success: function(rules){
            alert("setRules: Adding RULES relation to GAME.");
            var relation = game.relation("rules");
            relation.add(rules);
            game.save({
                success: function(){
                    alert("setRules: Saved GAME object successfully");
                    callback();
                },
                error: function(){
                    alert("setRules: Failed to save GAME");
                }
            });
        },
        error: function(){
            alert("setRules: Failed to save RULES");
        }
    });
}


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

/**
* Try to catch prey, if player is to far a way, a time penalty
* is issued. Otherwise prey is caught and gameState is updated.
*
* @method tryCatch
* @param {Player: player} Player to update state with
* @return {Game} Returns updated GameState
*/
Parse.Cloud.define("tryCatch", function(request, response) {
  response.success("Trying to catch prey");
});
