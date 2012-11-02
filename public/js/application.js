// requestAnimationFrame shim
(function() {
	var i = 0,
		lastTime = 0,
		vendors = ['ms', 'moz', 'webkit', 'o'];
	
	while (i < vendors.length && !window.requestAnimationFrame) {
		window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
		i++;
	}
	
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max(0, 1000 / 60 - currTime + lastTime),
				id = setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			
			lastTime = currTime + timeToCall;
			return id;
		};
	}
}());

var App = {
	start: function(stream) {
		App.video.addEventListener('canplay', function() {
			App.video.removeEventListener('canplay');
			setTimeout(function() {
				App.video.play();
				App.canvas.style.display = 'block';
				App.info.style.display = 'none';
				App.canvas.width = App.video.videoWidth;
				App.canvas.height = App.video.videoHeight;
				App.backCanvas.width = App.video.videoWidth / 4;
				App.backCanvas.height = App.video.videoHeight / 4;
				App.backContext = App.backCanvas.getContext('2d');

				App.context.translate(App.canvas.width, 0);
				App.context.scale(-1, 1);
			
				var w = 300 / 4 * 0.8,
					h = 270 / 4 * 0.8;
			
				App.comp = [{
					x: (App.video.videoWidth / 4 - w) / 2,
					y: (App.video.videoHeight / 4 - h) / 2,
					width: w, 
					height: h,
				}];
			
				App.drawToCanvas();
			}, 500);
		}, true);
		
		var domURL = window.URL || window.webkitURL;
		App.video.src = domURL ? domURL.createObjectURL(stream) : stream;
	},
	denied: function() {
		App.info.innerHTML = 'Camera access denied!<br>Please reload and try again.';
	},
	error: function(e) {
		if (e) {
			console.error(e);
		}
		App.info.innerHTML = 'Please go to about:flags in Google Chrome and enable the &quot;MediaStream&quot; flag.';
	},
	drawToCanvas: function() {
		requestAnimationFrame(App.drawToCanvas);
		
		var video = App.video,
			ctx = App.context,
			backCtx = App.backContext,
			m = 4,
			w = 4,
			i,
			comp;

		ctx.drawImage(video, 0, 0, App.canvas.width, App.canvas.height);
		backCtx.drawImage(video, 0, 0, App.backCanvas.width, App.backCanvas.height);
		
		comp = ccv.detect_objects(App.ccv = App.ccv || {
			canvas: App.backCanvas,
			cascade: cascade,
			interval: 4,
			min_neighbors: 1
		});
		
		if (comp.length) {
			App.comp = comp;
		}
		
		for (i = App.comp.length; i--; ) {
			ctx.drawImage(App.glasses, (App.comp[i].x - w / 2) * m, (App.comp[i].y - w / 2) * m, (App.comp[i].width + w) * m, (App.comp[i].height + w) * m);
		}
	}
};

var moustache = [];
moustache[0] = "0.png";
moustache[1] = "1.png";
moustache[2] = "2.png";
moustache[3] = "3.png";
moustache[4] = "4.png";
moustache[5] = "5.png";
moustache[6] = "6.png";
moustache[7] = "7.png";
moustache[8] = "8.png";
moustache[9] = "9.png";
moustache[10] = "10.png";
moustache[11] = "11.png";
moustache[12] = "12.png";
moustache[13] = "13.png";
moustache[14] = "14.png";
moustache[15] = "15.png";
moustache[16] = "16.png";
moustache[17] = "no-tash.png";

App.glasses = new Image();
App.glasses.src = "moustaches/" + moustache[0];

function changeMoustache(value) {
  App.glasses.src = "moustaches/" + moustache[value];
}

var video = document.getElementById('output');
var photo = document.getElementById('photo');

var takeButton = document.getElementById('take');
var saveButton = document.getElementById('save');
var delButton = document.getElementById('delete');
var anotherButton = document.getElementById('another');
var flash = document.getElementById('flash');
var context;

function takePhoto() {
  
  photo.width = video.width;
  photo.height = video.height;
  
  context = photo.getContext('2d');
  context.drawImage(video, 0, 0, photo.width, photo.height);
  
  saveButton.disabled = false;
  
  flash.classList.add('active');
  setTimeout(function(){flash.classList.remove('active');},100); 
                                         
  photo.style.display = 'inline-block';
  video.style.display = 'none';
  takeButton.style.display = 'none';
  saveButton.style.display = 'inline-block';
  anotherButton.style.display = 'inline-block';                        
                                
}

function savePhoto() {
  
  var timestamp = new Date();
  var dd = timestamp.getDate();
  var mm = timestamp.getMonth()+1;
  var hour = timestamp.getHours();
  var min = timestamp.getMinutes();
  
  var yyyy = timestamp.getFullYear();
  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} timestamp = mm+'-'+dd+'-'+yyyy+'_'+hour+'-'+min;
  
  photo.toBlob(function(blob) {
      saveAs(blob, "Photo_"+timestamp+".png");
  });
}

function takeAnother() {
  photo.style.display = 'none';
  video.style.display = 'inline-block';
  takeButton.style.display = 'inline-block';
  saveButton.style.display = 'none';
  anotherButton.style.display = 'none';
}

function deletePhoto() {
  context.clearRect(0, 0, photo.width, photo.height);
}

App.init = function() {
	App.video = document.createElement('video');
	App.backCanvas = document.createElement('canvas');
	App.canvas = document.querySelector('#output');
	App.canvas.style.display = 'none';
	App.context = App.canvas.getContext('2d');

	App.info = document.querySelector('#info');
	
	navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	try {
		navigator.getUserMedia_({
			video: true,
			audio: false
		}, App.start, App.denied);
	} catch (e) {
		try {
			navigator.getUserMedia_('video', App.start, App.denied);
		} catch (e) {
			App.error(e);
		}
	}
	
	App.video.loop = App.video.muted = true;
	App.video.load();
};

App.init();
