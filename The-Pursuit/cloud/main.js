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

  var Game = Parse.Object.extend("Game");
  var game = new Game();

  game.set("state", createState());
  game.save();

  response.success(game, prey);
});

function createState() {
  var State = Parse.Object.extend("State");
  var state  = new State();

  var Player = Parse.Object.extend("Player");
  var player  = new Player();
  player.set("isPrey", false);

  state.add("players", player);
  state.set("isPlaying", false);
  
  return state;
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
