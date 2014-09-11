
var spentTime = document.getElementsByClassName('spent-time');
var remainingTime = document.getElementsByClassName('remaining-time');
var timeline = document.getElementById('timeline'); // timeline
var sound = document.getElementById('sound'); //sound
// timeline width adjusted for playhead
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
var imagesRoot = "images/"

// timeupdate event listener
music.addEventListener("timeupdate", timeUpdate, false);

//Makes timeline clickable
timeline.addEventListener("click", function (event) {
	moveplayhead(event);
	music.currentTime = duration * clickPercent(event);
}, false);

//Makes sound icon clickable
sound.addEventListener("click", function (event) {
	
	/*if (music.paused == false){*/
		if (music.muted == false){
			music.muted = true;
			sound.style.backgroundImage = "";
			sound.style.backgroundImage = "url(\"" + imagesRoot + "speaker-off.png\")";
		}
		else{
			music.muted = false;
			sound.style.backgroundImage = "";
			sound.style.backgroundImage = "url(\"" + imagesRoot + "speaker-on.png\")";
		/*}*/
	}
	
	
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
	return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

// Makes playhead draggable 
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
var onplayhead = false;
// mouseDown EventListener
function mouseDown() {
	onplayhead = true;
	window.addEventListener('mousemove', moveplayhead, true);
	music.removeEventListener('timeupdate', timeUpdate, false);
}
// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
	if (onplayhead == true) {
		moveplayhead(e);
		window.removeEventListener('mousemove', moveplayhead, true);
		// change current time
		music.currentTime = duration * clickPercent(e);
		music.addEventListener('timeupdate', timeUpdate, false);
	}
	onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
	var newMargLeft = e.pageX - timeline.offsetLeft;
	if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
		playhead.style.left = newMargLeft + "px";
	}
	if (newMargLeft < 0) {
		playhead.style.left = "0px";
	}
	if (newMargLeft > timelineWidth) {
		playhead.style.left = timelineWidth + "px";
	}
}

// timeUpdate 
// Synchronizes playhead position with current point in audio 
function timeUpdate() {
	var playPercent = timelineWidth * (music.currentTime / duration);
	playhead.style.left = playPercent + "px";
	played.style.width = playPercent + "px";
	
	//convert the current time (spent-time) in to readable format and display it
	spentTime.innerHtml = convertSeconds(music.currentTime);
	
	if (music.currentTime == duration) {
		pButton.className = "";
		pButton.className = "play";
	}
}

//Play and Pause
function play() {
	// start music
	if (music.paused) {
		music.play();
		// remove play, add pause
		pButton.className = "";
		pButton.className = "pause";
	} else { // pause music
		music.pause();
		// remove pause, add play
		pButton.className = "";
		pButton.className = "play";
	}
}

// Gets audio file duration
music.addEventListener("canplaythrough", function () {
	duration = music.duration;  
}, false);

function convertSeconds(seconds){
		var m = Math.floor(seconds/60);
		var s = Math.ceil(seconds%60);
		var result = m  + ":" + (s  < 10 ? "0" + s : s);

		return  result;
}