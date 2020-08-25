function random_bg_color() {
		var dataHsb = document.body.dataset.hsb.split(' ');

		if (Math.random() < 0.2){
	    hueColor = Math.floor(Math.random() * 10);
		} else {
			hueColor = 90 + Math.floor(Math.random() * 270);
		}
    var hueSat = +dataHsb[1] + Math.floor(Math.random() * 15);
    var hueLight = +dataHsb[2] + Math.floor(Math.random() * 10);
    var bgColor = "hsl(" + hueColor + "," + hueSat + "% ," + hueLight + "%)";

    console.log(bgColor);

    document.getElementById("body-bg").style.backgroundColor = bgColor;
    }

random_bg_color();

document.getElementById("shuffle").addEventListener('click',function ()
    {
     random_bg_color();
    }  );
