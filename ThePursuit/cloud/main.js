// Modified metod from exemple
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello, " + request.params.name + "!");
});
    
/**
 * Saves the callers location and returns the state of the
 * game.
 *
 * @method updateGame
 * @param {String : playerObjID} Player's objectID to update state with
 * @param {String : gameID} Game to update state with
 * @param {String : longitude} Longitude to set player's location
 * @param {String : latitude} Latitude to set player's location
 * @return {Game : game} Returns updated GameState
 */
Parse.Cloud.define("updateGame", function(request, response) {
   
    var gameQuery = new Parse.Query("Game");
   
    gameQuery.equalTo("gameID",request.params.gameID);
    gameQuery.first({
        success: function(game){
            var playerQuery = new Parse.Query("Player");
            playerQuery.get(request.params.playerObjID, {
                success: function(player){
                    var location = new Parse.GeoPoint(request.params.latitude, request.params.longitude);
   
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
 * @return {Map<String, ParseObject> jsonObject} Returns a JSON/Map containing 
 * a newly created Game and Player (connected and related to the Game), as values in the Map.
 * The keys are "game" and "player".
 */
Parse.Cloud.define("createGame", function(request, response) {
    
    var Game = Parse.Object.extend("Game");
    var game = new Game();
    var player = createPlayer();
    var gameID = makeid();
    game.set("gameID", gameID);
    player.set("isCreator", true);
    player.save({
        success: function(player){
            var relation = game.relation("players");
            relation.add(player);
  
            game.save({
              success: function() {
  
                createState(game, function() {
                  alert("createGame: Added STATE to GAME successfully");
                  var jsonObject = {
                    "player": player,
                    "game": game
                  };
                  response.success(jsonObject);
                });    
  
              }, error: function(error){
                alert("createGame: Game response error. " + error)
              }
            });
  
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
   
    rules.set("areaRadius", radius);
    rules.set("catchRadius", catchRadius);
    rules.set("durationTime", duration);
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
 * Join a created game with given gameID and objectID of the Player
 *
 * @method joinGame
 * @param {String : gameID} An id to identify game to join.
 * @param {String : playerObjID} An objectID to identify the player.
 * @return {Game : game} Returns an updated game with relations to player within the game.
 */
Parse.Cloud.define("joinGame", function(request, response){
    
    var gameQuery = new Parse.Query("Game");
    var playerQuery = new Parse.Query("Player");
    gameQuery.equalTo("gameID", request.params.gameID);
    gameQuery.first({
        success: function(game){
  
            playerQuery.get(request.params.playerObjID, {
                success: function(player){
                    alert("joinGame: Found Player with Object ID: " + player.id);
  
                    player.save({
                        success: function(player){
                            var relation = game.relation("players");
                            relation.add(player);
                            alert("joinGame: Saved Player object successfully");
  
                            game.save({
                                success: function(){
                                    alert("joinGame: Saved GAME object, call function executed");
                                    response.success(game);
                                },
                                error: function(){
                                    alert("joinGame: Failed to save GAME object");
                                }
                            });
  
                        }
                    });
  
                },
  
                error: function(){
                    alert("joinGame: Failed to retrieve player");   
                }
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
  
    var player  = createPlayer();
   
    player.save({
        success: function(player){
            response.success(player);
            alert("createPlayer: Successfully returned Player object with objectID: " + player.id)
        },
        error: function(){
            alert("createPlayer: Failed to create player");
        }
    });
  
});
  
/**
 *@return {Player : player} Returns a newly created Player object.
 */
function createPlayer(){
    var Player = Parse.Object.extend("Player");
    var player  = new Player();
    var location = new Parse.GeoPoint(0,0);
    
    player.set("playerID", makeid());
    player.set("playerColor", null);
    player.set("isReady", false);
    player.set("isPrey", false);
    player.set("location", location);
  
    return player;
}
 
/**
 * Start a certain game.
 *
 * @method startGame
 * @param {Game : game} A game to be started
 * @return {Game : game} Returns the started game.
 */
Parse.Cloud.define("startGame", function(request, response){
  
    var gameQuery = new Parse.Query("Game");
    gameQuery.equalTo("gameID", request.params.gameID);
    gameQuery.first({
        success: function(game){
            var startTime = new Date();
            var stateRelation = game.relation("state");
        var rulesRelation = game.relation("rules");
        var playerRelation = game.relation("players");
 
        playerRelation.query().find({
            success: function(players){
                var player = players[Math.floor(Math.random() * players.length)];
                player.set("isPrey", true);
                player.save();
            },
            error: function(){
                alert("startGame: Player query error");
            }
        });
             
            stateRelation.query().first({
                success: function(state){
                    state.set("isPlaying", true);
                    state.set("startTime", startTime);
                    state.save();
              
                    rulesRelation.query().first({
                        success: function(rules){
                            state.set("endTime", new Date(startTime.getTime() + rules.get("durationTime")*1000*60));
                            state.save();
                            response.success(game);
                        },
                        error: function(){
                            alert("startGame: Rules not found");
                        }
                    });
                },
                error: function(){
                    alert("startGame: State not found.");
                }
            });
        },
        error: function(){
            alert("startGame: No such game.");
        }
    });
});
 
/**
* Try to catch prey, if player is to far a way, a time penalty
* is issued. Otherwise prey is caught and gameState is updated.
*
* @method tryCatch
* @param {Game : game} The current game
* @param {Player : player} Player to update state with
* @return {Game : game} Returns updated GameState
*/
Parse.Cloud.define("tryCatch", function(request, response) {
  
    var gameQuery = new Parse.Query("Game");
    gameQuery.equalTo("gameID", request.params.gameID);
    gameQuery.first({
        success: function(game){
            var playerQuery = new Parse.Query("Player");
 
            playerQuery.get(request.params.playerObjID, {
                success: function(player){
                    var playerRelation = game.relation("players");
                    var rulesRelation = game.relation("rules");
                    var stateRelation = game.relation("state");
                    var playLoc = new Parse.GeoPoint(player.get("location"));
                    var preyLoc;
                    var catchRadius;
                    playerRelation.query().find({
                        success: function(players){
                            for(var i = 0; i < players.length; i++){
                                if(players[i].get("isPrey") == true){
                                    preyLoc = new Parse.GeoPoint(players[i].get("location"));
                                    break;
                                }
                            }
                            rulesRelation.query().first({
                                success: function(rules){
                                    catchRadius = rules.get("catchRadius");
                                     
                                    if(preyLoc.kilometersTo(playLoc) * 1000 <= catchRadius){
          
                                        stateRelation.query().first({
                                            success: function(state){
                                                state.set("isPlaying", false);
                                                state.save({
                                                    success: function(){
                                                        alert("tryCatch: Prey successfully captured");
                                                        response.success(game);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else{
                                        response.error("Prey out of reach");
                                    }
                                }
                            });
                        },
                        error: function(){
                            alert("tryCatch: players not found");
                        }
                    });
                },
                error: function(){
                    alert("tryCatch: Failed to find player");
                }
            });
        },
        error: function(){
            alert("tryCatch: No such GAME");
        }
    });
});