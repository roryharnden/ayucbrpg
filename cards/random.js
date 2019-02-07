var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);

function shuffle(){


  var imgCount = 48;
  var dir = "images/";
  var count = 16;
  var skewAmount = 5;
  var headCount = Math.round(Math.random() * (count -1 )) + 1;
  document.getElementById("head").style.backgroundImage = "url(" + dir + headCount + ".jpg)";
  document.getElementById("head").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";

  console.log("headCount = " + headCount);

  var midCount = Math.round(Math.random() * (count -1)) + count +1;
  document.getElementById("mid").style.backgroundImage = "url(" + dir + midCount + ".jpg)";
  document.getElementById("mid").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";

  console.log("midCount = " + midCount);

  var footCount = Math.round(Math.random() * (count -1)) + count + count +1;
  document.getElementById("foot").style.backgroundImage = "url(" + dir + footCount + ".jpg)";
  document.getElementById("foot").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";

  console.log("footCount = " + footCount);

};
shuffle();
