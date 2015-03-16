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

  var stateRelation = game.relation("state");
  relation.add(createState());

  game.set("gameID", makeid());
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
* @return {Game : game} Returns the game with the new rules.
*/
Parse.Cloud.define("setRules", function(request, response) {
  var query = new Parse.Query("Game");
  query.equalTo("gameID", request.params.gameID);

  query.find({
    success: function(results) {
      results.set("rules", setRules(request.radius, request.catchRadius, request.duration));
      response.success(results);
    },
    error: function() {
      response.error("Game does not exist");
    }
  });
});

function setRules(radius, catchRadius, duration) {
  var Rules = Parse.Object.extend("Rules");
  var rules  = new Rules();

  rules.set("radius", radius);
  rules.set("catchRadius", catchRadius);
  rules.set("duration", duration);

  return rules;
}

function makeid() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

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
