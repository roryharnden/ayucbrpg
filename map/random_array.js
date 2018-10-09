var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);




function shuffle() {

  width = 4;

  var top = [11, 12, 18, 19, 20, 24, 26, 28, 30, 33, 34, 37, 39, 42, 43, 52];
  var right = [3, 10, 11, 17, 23, 24, 25, 28, 29, 30, 33, 34, 51];
  var bottom = [2, 3, 9, 10, 11, 15, 17, 19, 21, 24, 25, 28, 30, 33, 34, 43];
  var left = [4, 10, 11, 12, 18, 24, 25, 26, 28, 29, 30, 31, 34, 35, 52];
  var allSets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];

  var currentCard = 0;

  landTop = allSets.filter(function(item) {
    return top.indexOf(item) === -1;
  });
  landRight = allSets.filter(function(item) {
    return right.indexOf(item) === -1;
  });
  landBottom = allSets.filter(function(item) {
    return bottom.indexOf(item) === -1;
  });
  landLeft = allSets.filter(function(item) {
    return left.indexOf(item) === -1;
  });

  var dir = "images/map_";
  var skewAmount = 5;
  var waterRight = 2;
  var waterBottom = 2;
  // console.log("waterRight = " + waterRight);
  var tiles = [];

  // Get all the div elements with the item class into a collection
  var divs = document.querySelectorAll("div.item");

  // Convert the collection into an array so that we can loop with .forEach
  var divArray = Array.prototype.slice.call(divs);

  //Loop over the array...
  divArray.forEach(function(div) {


    aboveCard = currentCard - width;
    // console.log("aboveCard is " + aboveCard);
    if (aboveCard >= 0) {
      console.log(tiles[aboveCard]);
      aboveCardNumber = tiles[aboveCard];
      if (bottom.indexOf(aboveCardNumber) !== -1) {
        console.log("Found water on bottom");
        waterBottom = 1;
      } else {
        waterBottom = 0;
      }
    }


    if (waterRight == 2) {
      // console.log("Next tile to be any");
      var children = allSets;
    } else if (waterRight == 1) {
      if (waterBottom == 0) {
        var children = left.filter(value => -1 !== landTop.indexOf(value));
        console.log("Children = " + children);
      } else if (waterBottom == 1) {
        var children = left.filter(value => -1 !== top.indexOf(value));
        console.log("Children = " + children);
      } else {
        var children = left;
        console.log("Children = " + children);
      }
    } else {
      // console.log("Next tile to not have water on the left");
      if (waterBottom == 0) {
        var children = landLeft.filter(value => -1 !== landTop.indexOf(value));
        console.log("Children = " + children);
      } else if (waterBottom == 1) {
        var children = landLeft.filter(value => -1 !== top.indexOf(value));
        console.log("Children = " + children);
      } else {
        var children = landLeft;
        console.log("Children = " + children);
      }
    }


    var randomBG = children[Math.floor(Math.random() * children.length)]
    tiles.push(randomBG);

    if (right.indexOf(randomBG) >= 0) {
      waterRight = 1;
      // console.log("Found water on right");
    } else {
      waterRight = 0;
      // console.log("Did not find water on right");
    }

    div.style.backgroundImage = "url(" + dir + randomBG + ".jpg)";

    currentCard++;
    // console.log(tiles[currentCard -]);


  })

  // console.log("Tiles: " + tiles);



};
shuffle();
