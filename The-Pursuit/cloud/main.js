

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
* @return {Game : game} Returns a created game.
* @return {Player : player} Returns a player for the caller to use
*/
//Returnerar just nu en lista av Players med samma gameID
Parse.Cloud.define("joinGame", function(request, response){
    var Player = Parse.Object.extend("Player");
    var player = new Player();
    /*
     Vill få in följande 5 rader kod i success eller lösa på något annat sätt.
     Detta sätt förutsätter att spelaren aldrig skriver in fel gameID.
     Det kommer isf skapas en ny spelare och nytt spel med det gameID
     som angavs. Detta nya spel med spelaren returneras sen.
     */
    //create the player who's joining the game
    player.set("gameID", request.params.gameID);
    player.set("playerID", request.params.playerID);
    player.set("isPrey", false);
    player.set("playerColor", "black");
    player.save();

    var query = new Parse.Query("Player");
    query.equalTo("gameID", request.params.gameID);
    query.find({
        success: function(results){
            response.success(results);
        },
        error: function(){
            response.error("No game with that gameID found")
        }
    });
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
