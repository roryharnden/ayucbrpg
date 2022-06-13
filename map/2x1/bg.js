function random_bg_color() {
		var dataHsb = document.body.dataset.hsb.split(' ');

		// if (Math.random() < 0.2){
	  //   hueColor = Math.floor(Math.random() * 10);
		// } else {
		// 	hueColor = 90 + Math.floor(Math.random() * 270);
		// }
		hueColor = 180 + Math.floor(Math.random() * 60);

    var hueSat = +dataHsb[1] + Math.floor(Math.random() * 20);
    var hueLight = +dataHsb[2] + Math.floor(Math.random() * 5);
    var bgColor = "hsl(" + hueColor + "," + hueSat + "% ," + hueLight + "%)";

    console.log(bgColor);

    document.getElementById("body-bg").style.backgroundColor = bgColor;
    }

random_bg_color();

document.getElementById("shuffle").addEventListener('click',function ()
    {
     random_bg_color();
    }  );
