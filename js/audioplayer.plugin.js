(function($){
		
	//variables
	
	var spentTime;
	var remainingTime ;
	var timeline; // timeline
	var sound; //sound
	var playhead;
	var imagesRoot = "images/"
	var music; // the audio tag
	var duration;
	var timelineWidth;
	
	// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
	var onplayhead = false;
	
	
	//Methods
	var methods = 
	{
		
		init: function(settings){
		
			_defaultSettings = {
				hook: "audioplayer",
				buttonId: "pButton",
				audioId: "music"
			}
			
			//overwrite the default values with the variables
			if (settings) $.extend(_defaultSettings, settings);	
			
			//render the scheleton of the audio DOM
			
			methods.buildDOM(_defaultSettings);
			methods.setVariables(_defaultSettings);
			methods.addEventListeners(_defaultSettings);
			
		},
		
		setVariables: function(settings){
			//audioIE = document.getElementById(settings.audioId);
			spentTime = $('div.spent-time');
			remainingTime = $('div.remaining-time');
			timeline = $('.timeline'); // timeline
			sound = $('.sound'); //sound
			playhead = $('.playhead');
			played = $('.played');
			button = $("#" + settings.buttonId);
			//music = $("#" + settings.audioId);
			music = document.getElementById(settings.audioId)
			music.muted = false;
			timelineWidth = $('.timeline').width() - $('playhead').width();			
		},
		
		buildDOM: function(settings){
			
			var rootElement = settings.hook;
			
			$("#" + rootElement).html("<button id=\"" + settings.buttonId + "\" class=\"play\"></button>")
						  .append("<div class=\"timeline\"></div>")
						  .append("<div class=\"counter\"></div>")
						  .append("<div class=\"sound\"></div>");
						  
			$('.timeline').html("<div class=\"playhead\"></div>").append("<div class=\"played\"></div>");
			$('.counter').html("<div class=\"spent-time\">0:00</div>").append("<div class=\"separator\">/</div>").append("<div class=\"remaining-time\"></div>");
			
		},
		
		addEventListeners: function(settings){
		
			//add event listener to the button
			button.click(
				function(){
					methods.play(music);					
				}
			);
			
			sound.click(
				function(){
					if (music.muted == false){
						music.muted = true;
						//sound.style.backgroundImage = "";
						sound.css("background-image", "");
						//sound.style.backgroundImage = "url(\"" + imagesRoot + "speaker-off.png\")";
						sound.css("background-image", "url(\"" + imagesRoot + "speaker-off.png\")");
					}
					else{
						music.muted = false;
						//sound.style.backgroundImage = "";
						sound.css("background-image", "");
						//sound.style.backgroundImage = "url(\"" + imagesRoot + "speaker-on.png\")";
						sound.css("background-image", "url(\"" + imagesRoot + "speaker-on.png\")");
					}
				}
			);
			
			//event fired every time the time get updated
			$('audio').bind('timeupdate', methods.timeUpdate);
			
			//set the duration
			$('audio').bind('loadedmetadata', methods.setDuration);
			
			//Makes timeline clickable
			$('.timeline').bind(
				'click',
				function(event){
					methods.moveplayhead(event);
					music.currentTime = duration * methods.clickPercent(event);
				},
				false
			);
			
			$('.playhead').bind('mousedown', methods.mousedown);
			
			$(document).bind('mouseup', methods.mouseup);
			
		},
		
		
		mouseup: function(e){
			if (onplayhead == true) {
				methods.moveplayhead(e);
				//window.removeEventListener('mousemove', methods.moveplayhead, true);
				$(window).unbind('mousemove');
				// change current time
				music.currentTime = duration * methods.clickPercent(e);
				$('#music').bind('timeupdate', methods.timeUpdate);
			}
				onplayhead = false;
		},
		
		mousedown: function(){
			onplayhead = true;
			$(window).bind('mousemove', methods.moveplayhead);
			$('audio').unbind('timeupdate');


		},
		
		moveplayhead: function(e) {
			//var newMargLeft = e.pageX - timeline.offset();
			var newMargLeft = e.pageX - (timeline.offset()).left;
			if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
				//playhead.style.left = newMargLeft + "px";
				playhead.css("left", newMargLeft + "px");
				played.css("width", newMargLeft + "px");
			}
			if (newMargLeft < 0) {
				//playhead.style.left = "0px";
				playhead.css("left","0px");
				played.css("width", "0px");
			}
			if (newMargLeft > timelineWidth) {
				//playhead.style.left = timelineWidth + "px";
				playhead.css("left", timelineWidth + "px");
				played.css("width", timelineWidth + "0px");
			}
		},
		
		
		clickPercent: function(e) {
			return (e.pageX - (timeline.offset()).left) / timeline.width() ;
		},
		
		setDuration: function(){
			duration = music.duration; 
			console.log("Progress event started");
			console.log(duration);
			remainingTime.html(methods.convertSeconds(duration));
		},
		
		
		convertSeconds: function(seconds){
			var m = Math.floor(seconds/60);
			var s = Math.ceil(seconds%60);
			var result = m  + ":" + (s  < 10 ? "0" + s : s);
	
			return  result;
		},
		
		
		timeUpdate: function(){
			var playPercent = timelineWidth * (music.currentTime / duration);
			//playhead.style.left = playPercent + "px";
			playhead.css("left", playPercent + "px");
			//played.style.width = playPercent + "px";
			played.css("width", playPercent + "px");
			
			//convert the current time (spent-time) in to readable format and display it
			spentTime.html(methods.convertSeconds(music.currentTime));
	
			if (music.currentTime == duration) {
				pButton.className = "";
				pButton.className = "play";
			}
		},
		
		play: function(audioId){
			if (audioId.paused) {
				audioId.play();
				
				// remove play, add pause
				button.removeClass();
				button.addClass("pause");

			} else { // pause music
				audioId.pause();
				
				// remove pause, add play
				button.removeClass();
				button.addClass("play");
			}
		},
	}

	$.fn.jQueryAudioPlayer = function(method){
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		}
		if (typeof method == "object" || ! method){
			return methods.init.apply(this,arguments);
		}else{
			$.error(' Method ' + method + ' doesn\'t exist on Jquery.jsonreader');
		}
	}

})(jQuery);