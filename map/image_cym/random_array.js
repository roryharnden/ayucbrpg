var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);


var allSets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];

var usedCards = [];



function shuffle() {


  var dir = "images/map_";
  var skewAmount = 0;

  // images are in a set depending on whether they have open water on a specific side

  var top = [14,15,16,17,18,19,20,21,22,23,24,26,33,34,35,39,54];
  var right = [1,2,5,7,14,16,18,20,22,25,34,38,46,53];
  var bottom = [3,7,11,14,16,18,20,22,25,27,34,35,39,45,46,51,53];
  var left = [14,15,16,17,18,20,22,23,25,26,36,37,38,40,46,54];

  allSets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];

  width = 3;

  usedCards = [];

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

  var currentCard = 0;


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


    allSets = allSets.filter(function(item) {
      return usedCards.indexOf(item) === -1;
    });

    // console.log(currentCard % width);
    if (currentCard % width === 0) {
      firstInRow = 1;
    } else {
      firstInRow = 0;
    }
    // console.log("firstInRow = " + firstInRow);

    aboveCard = currentCard - width;
    // console.log("aboveCard is " + aboveCard);
    if (aboveCard >= 0) {
      // console.log(tiles[aboveCard]);
      aboveCardNumber = tiles[aboveCard];
      if (bottom.indexOf(aboveCardNumber) !== -1) {
        // console.log("Found water on bottom");
        waterBottom = 1;
      } else {
        waterBottom = 0;
      }
    }


    if (firstInRow == 1) {
      // if card above does not have water at bottom
      if (waterBottom == 0) {
        var children = allSets.filter(value => -1 !== landTop.indexOf(value));
      } else if (waterBottom == 1) {
        var children = allSets.filter(value => -1 !== top.indexOf(value));
      } else {
        var children = allSets;
      }
    } else if (waterRight == 1) {
      if (waterBottom == 0) {
        var children = left.filter(value => -1 !== landTop.indexOf(value));
      } else if (waterBottom == 1) {
        var children = left.filter(value => -1 !== top.indexOf(value));
      } else {
        var children = left.filter(value => -1 !== allSets.indexOf(value));
      }
    } else {
      // console.log("Next tile to not have water on the left");
      if (waterBottom == 0) {
        var children = landLeft.filter(value => -1 !== landTop.indexOf(value));
        // console.log("Children = " + children);
      } else if (waterBottom == 1) {
        var children = landLeft.filter(value => -1 !== top.indexOf(value));
        // console.log("Children = " + children);
      } else {
        var children = landLeft.filter(value => -1 !== allSets.indexOf(value));
        // console.log("Children = " + children);
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
    div.style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount )) - (0.5 * skewAmount)) + "deg)";

    usedCards.push(randomBG);

    // intended to remove currentCard from allSets
    // for (var i in allSets) {
    //   if (allSets[i] == currentCard) {
    //     allSets.splice(i, 1);
    //     break;
    //   }
    // }

    console.log("allSets = " + allSets);
    console.log("usedCards = " + usedCards);

    currentCard++;
    // console.log(tiles[currentCard -]);


  })

  // console.log("Tiles: " + tiles);



};
shuffle();
