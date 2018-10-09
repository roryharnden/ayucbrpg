var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);

function shuffle() {


  var imgCount = 54;
  var dir = "images/map_";
  var skewAmount = 5;

  // Get all the div elements with the item class into a collection
  var divs = document.querySelectorAll("div.item");

  // Convert the collection into an array so that we can loop with .forEach
  var divArray = Array.prototype.slice.call(divs);

  //Loop over the array...
  divArray.forEach(function(div) {

      var randomNum = Math.floor(Math.random() * imgCount) + 1;
      var formattedNumber = ("0" + randomNum).slice(-2);

      div.style.backgroundImage = "url(" + dir + formattedNumber + ".jpg)";


    })


};
shuffle();
