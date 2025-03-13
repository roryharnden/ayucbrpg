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


    var imgCount = 18;
    var dir = "images/";
    var count = 18;
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

// tips from https://stackoverflow.com/questions/36718344/recreating-a-lookup-table-in-javascript

      var data = [
        [1,"electricity","a beard",],
        [2,"an eyepatch","a tounge"],
        [3,"map","sausage"],
        [4,"map","sausage"],
        [5,"sock","sausage"],
        [6,"map","sausage"],
        [7,"a mask","some lipstick"],
        [8,"map","sausage"],
        [9,"map","sausage"],
        [10,"map","sausage"],
        [11,"map","sausage"],
        [12,"map","sausage"],
        [13,"bees!","sweet things","a net"],
        [14,"map","sausage"],
        [15,"a spear","an earring"],
        [16,"map","sausage"]
      ],
          object = {};
          item = {};

      data.forEach(function (aaa) {
          strength[aaa[0]] = aaa[1];
          weakness[aaa[0]] = aaa[2];
          item[aaa[0]] = aaa[3];
      });

      // usage
      document.getElementById('strength').innerHTML = (strength[headCount]);
      document.getElementById('weakness').innerHTML = (weakness[midCount - 16]);
      document.getElementById('item').innerHTML = (item[footCount - 32]);

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

// Fetch and parse the CSV file
async function loadCSV() {
    const response = await fetch('cards.csv');
    const data = await response.text();
    displayTable(data);
}

function displayTable(data) {
    const allRows = data.split(/\r?\n|\r/);
    let table = '<table>';
    
    allRows.forEach((row, index) => {
        if (index === 0) {
            table += '<thead><tr>';
        } else {
            table += '<tr>';
        }

        const cells = row.split(',');
        cells.forEach(cell => {
            if (index === 0) {
                table += `<th>${cell}</th>`;
            } else {
                table += `<td>${cell}</td>`;
            }
        });

        if (index === 0) {
            table += '</tr></thead><tbody>';
        } else {
            table += '</tr>';
        }
    });

    table += '</tbody></table>';
    document.body.insertAdjacentHTML('beforeend', table);

    // Add click handler to button
    document.querySelector('button').addEventListener('click', highlightRandomRow);
}

function highlightRandomRow() {
    const rows = document.querySelectorAll('table tr');
    const rnd = Math.floor(Math.random() * (rows.length - 1)) + 1;
    
    // Reset all rows
    rows.forEach(row => row.style.backgroundColor = 'transparent');
    
    // Highlight random row
    rows[rnd].style.backgroundColor = '#fff';
}

// Start loading when page loads
loadCSV();
