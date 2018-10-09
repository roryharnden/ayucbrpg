var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);




function shuffle() {

  var top = [11, 12, 18, 19, 20, 24, 26]; //, 28, 30, 33, 34, 37, 39, 42, 43, 52
  var right = [3, 10, 11, 17, 23, 24, 25];
  var bottom = [2, 3, 9, 10, 11, 15, 17, 19, 21, 24, 25];
  var left = [4, 10, 11, 12, 18, 24, 25, 26];
  var landLeft = [1, 2, 3, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 27];

  var imgCount = 54 / 2;
  var dir = "images/map_";
  var skewAmount = 5;
  var waterRight = 2;
  console.log("waterRight = " + waterRight);
  var tiles = [];

  // Get all the div elements with the item class into a collection
  var divs = document.querySelectorAll("div.item");

  // Convert the collection into an array so that we can loop with .forEach
  var divArray = Array.prototype.slice.call(divs);

  //Loop over the array...
  divArray.forEach(function(div) {

    if (waterRight == 2) {
      console.log("Next tile to be any");
      var children = top.concat(right, bottom, left);
      console.log("waterRight = " + waterRight);
    } else if (waterRight == 1) {
      console.log("Next tile to have water on the left");
      var children = left;
      console.log("waterRight = " + waterRight);
    } else {
      console.log("Next tile to not have water on the left");
      // var children = top.concat(right, bottom);
      var children = landLeft;
      console.log("waterRight = " + waterRight);
    }
    console.log(children);

    var randomBG = children[Math.floor(Math.random() * children.length)]
    tiles.push(randomBG);

    if (right.indexOf(randomBG) >= 0) {
      waterRight = 1;
      console.log("Found water on right");
    } else {
      waterRight = 0;
      console.log("Did not find water on right");
    }

    div.style.backgroundImage = "url(" + dir + randomBG + ".jpg)";

  })

  console.log("Tiles: " + tiles);



};
shuffle();
