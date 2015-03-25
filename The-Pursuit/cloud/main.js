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

    var gameQuery = new Parse.Query("Game");

    gameQuery.equalTo("gameID",request.params.gameID);
    gameQuery.first({
        success: function(game){
            var playerQuery = new Parse.Query(game);
            playerQuery.equalTo("players", request.params.playerID);
            playerQuery.first({
                success: function(player){
                    var location = new Parse.GeoPoint(request.params.longitude, request.params.latitude);

                    player.set("location", location);
                    player.save({
                        success: function(){
                            alert("updateGame: Successfully saved location to player, returning updated GameState")
                            response.success(game);
                        },
                        error: function(){
                            alert("updateGame: Failed to save PLAYER")
                        }
                    });
                },
                error: function(error){
                    response.error("updateGame: no such player. " + error);
                }
            });
        },
        error: function(error){
            response.error("updateGame: no such game. " + error);
        }
    });
});
 
/**
 * Creates a new game with caller as a player.
 *
 * @method createGame
 * @return {Game : game} Returns a new game
 */
Parse.Cloud.define("createGame", function(request, response) {
 
    var Game = Parse.Object.extend("Game");
    var game = new Game();
    var gameID = makeid();
    game.set("gameID", gameID);
     
    game.save({
      success: function() {
        createState(game, function() {
          alert("createGame: Added STATE to GAME successfully");

          createPlayer(game, function(){
                alert("createGame: Added PLAYER to GAME successfully, return GAME object");
                response.success(game);
            });

        });    
      }, error: function error(error){
      	alert("createGame: Game response error. " + error)
      }
  });
 
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
 
    // do {
        for( var i = 0; i < 4; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
 
    //     var gameQuery = new Parse.Query("Game");
 
    //     gameQuery.equalTo("gameID", text);
    //     //not sure how Query.count works but hopefully this works as intended
    //     gameQuery.count({
    //         success: function(result){
    //             if(result == 0 || result == null)
    //                 isUniqueID = true;
    //         }
    //     });
    // }
    // while(!isUniqueID);
 
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
                function() {
                    alert("setRules: Added RULES to GAME successfully");
                    response.success(game);
                }
            );
            
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
  
/**
 * Join a created game with given gameID
 *
 * @method joinGame
 * @param {String : gameID} A id to identify game to join.
 * @return {Game : game} Returns a created game.
 */
Parse.Cloud.define("joinGame", function(request, response){
 
    var gameQuery = new Parse.Query("Game");
    gameQuery.equalTo("gameID", request.params.gameID);
    gameQuery.first({
        success: function(game){
            createPlayer(game, function(){
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
 * Create a player
 *
 * @method createPlayer
 * @return {Player : player} Returns a player.
 */
Parse.Cloud.define("createPlayer", function(request, response){

    var Player = Parse.Object.extend("Player");
    var player  = new Player();
    var location = new Parse.GeoPoint(0,0);

    //TODO: Check if playerID is already in use

    player.set("playerID", make);
    player.set("playerColor", null);
    player.set("isReady", false);
    player.set("isPrey", false);
    player.set("location", location);

    player.save({
        success: function(player){
            response.success(player);
        },
        error: function(){
            alert("createPlayer: Failed to create player");
        }
    });
});

function createPlayer(game, callback) {
 
    var Player = Parse.Object.extend("Player");
    var player  = new Player();
    var location = new Parse.GeoPoint(0,0);
 
    //TODO: Check if playerID is already in use
    
    var id = makeid();
    player.set("playerID", id);
    
    //player.set("playerID", playerID);
    player.set("gameID", game.get("gameID"));
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
