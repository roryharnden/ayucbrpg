var link = document.getElementById("shuffle");
// And when the link is clicked:
link.addEventListener("click", shuffle);

var a = 0;
var b = 0;
var c = 0;

a = location.search.split('a=').splice(1).join('').split('&')[0];
b = location.search.split('b=').splice(1).join('').split('&')[0];
c = location.search.split('c=').splice(1).join('').split('&')[0];

function shuffle(){


    var imgCount = 16;
    var dir = "images/";
    var count = 16;
    var skewAmount = 5;
      document.getElementById("head").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";


      document.getElementById("mid").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";


      document.getElementById("foot").style.transform = "rotate(" + (Math.round(Math.random() * (+ skewAmount - 1)) - (0.5 * skewAmount)) + "deg)";

      if ( a == 0) {

        var headCount = Math.round(Math.random() * (count -1 )) + 1;

        var midCount = Math.round(Math.random() * (count -1)) + count + 1;

        var footCount = Math.round(Math.random() * (count -1)) + count + count + 1;

      } else {
        var headCount = a
        var midCount = b
        var footCount = c
      }

      console.log("headCount = " + headCount);
      console.log("midCount = " + midCount);
      console.log("footCount = " + footCount);

      document.getElementById("head").style.backgroundImage = "url(" + dir + headCount + ".jpg)";
      document.getElementById("mid").style.backgroundImage = "url(" + dir + midCount + ".jpg)";
      document.getElementById("foot").style.backgroundImage = "url(" + dir + footCount + ".jpg)";

      setQueryStringParameter("a", headCount);
      setQueryStringParameter("b", midCount);
      setQueryStringParameter("c", footCount);

};

console.log(a,b,c);

shuffle();

a = 0

console.log("Shuffled");

function setQueryStringParameter(name, value) {
    const params = new URLSearchParams(location.search);
    params.set(name, value);
    window.history.replaceState({}, "", decodeURIComponent(`${location.pathname}?${params}`));
}
