

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

  var Game = Parse.Object.extend("Game");
  var game = new Game();

  game.set("state", createState());
  game.set("rules", createRules());

  game.save();

  response.success(game);
});

function createState() {
    return "state";
}

function createRules() {
    return "rules";
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
