var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);

function shuffle(){


  var imgCount = 54;
  var dir = "images/";
  var count = 16;
  var skewAmount = 5;
  var headCount = Math.round(Math.random() * (imgCount - 1)) + 1;
  document.getElementById("head").style.backgroundImage = "url(" + dir + headCount + ".jpg)";
  document.getElementById("head").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";
  var midCount = Math.round(Math.random() * (imgCount - 1)) + 1 + count;
  document.getElementById("mid").style.backgroundImage = "url(" + dir + midCount + ".jpg)";
  document.getElementById("mid").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";
  var footCount = Math.round(Math.random() * (imgCount - 1)) + 1 + count + count;
  document.getElementById("foot").style.backgroundImage = "url(" + dir + footCount + ".jpg)";
  document.getElementById("foot").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";

};
shuffle();
