(function($){
		
	//variables
	var numberOfAudioElements;
	var spentTime = [];
	var remainingTime  = [];
	var timeline = []; // timeline
	var sound = []; //sound
	var playhead = [];
	var played = [];
	var button = [];
	var imagesRoot = "images/"
	var music = []; // the audio tag
	var duration = [];
	var timelineWidth = [];
	var audioElement = [];
	// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
	var onplayhead = [false, false];
	
	
	//Methods
	var methods = 
	{
		
		init: function(settings){
		
			_defaultSettings = {
				/*
				hook: ["audioplayer"],
				buttonId: ["pButton"],
				audioId: ["music"]
				*/
			}
			
			//overwrite the default values with the variables
			if (settings) $.extend(_defaultSettings, settings);	
			
			/*
			How many AUDIO elements in the page?
			*/
			var x = document.getElementsByTagName('audio');
			numberOfAudioElements = x.length;
			
			//render the scheleton of the audio DOM
			methods.buildDOM(_defaultSettings);
			methods.setVariables(_defaultSettings);
			methods.addEventListeners(_defaultSettings);
			
		},
		
		setVariables: function(settings){
			
			for (var i=0; i<numberOfAudioElements; i++){
				audioElement.push($('audio#'+settings.audioId[i]));
				spentTime.push($("#"+settings.hook[i] +' div.spent-time'));
				remainingTime.push($("#"+settings.hook[i] + ' div.remaining-time'));
				timeline.push($("#"+settings.hook[i] + ' .timeline')); // timeline
				sound.push($("#"+settings.hook[i] + ' .sound')); //sound
				playhead.push($("#"+settings.hook[i] + ' .playhead'));
				played.push($("#"+settings.hook[i] + ' .played'));
				button.push($("#" + settings.buttonId[i]));
				music.push(document.getElementById(settings.audioId[i]));
				music[i].muted = false;
				timelineWidth.push($("#"+settings.hook[i] + ' .timeline').width() - $("#"+settings.hook[i] + ' playhead').width());	
			}
		},
		
		buildDOM: function(settings){
			
			var audioTag = document.getElementsByTagName('audio');
			var rootElement = [];
			
			for (var i=0; i<numberOfAudioElements; i++){
				
				rootElement.push(settings.hook[i]);
			
				$(audioTag[i]).after("<div id=\"" + rootElement[i]+ "\"></div>");
				$("#"+rootElement[i]).append("<button id=\"" + settings.buttonId[i] + "\" class=\"play\"></button>")
							  		 .append("<div class=\"timeline\"></div>")
							  		 .append("<div class=\"counter\"></div>")
							  		 .append("<div class=\"sound\"></div>");
							  
				$('.timeline').html("<div class=\"playhead\"></div>").append("<div class=\"played\"></div>");
				$('.counter').html("<div class=\"spent-time\">0:00</div>").append("<div class=\"separator\">/</div>").append("<div class=\"remaining-time\"></div>");
			}
			
		},
		
		addEventListeners: function(settings){
		
			for (var i=0; i<numberOfAudioElements; i++){
			
			
				//add event listener to the button
				$(button[i]).click(
					function(e){
						methods.play(e.currentTarget);					
					}
				);
				
				sound[i].click(
					function(){
						if (music[i].muted == false){
							music[i].muted = true;
							//sound.style.backgroundImage = "";
							sound[i].css("background-image", "");
							//sound.style.backgroundImage = "url(\"" + imagesRoot + "speaker-off.png\")";
							sound[i].css("background-image", "url(\"" + imagesRoot + "speaker-off.png\")");
						}
						else{
							music[i].muted = false;
							//sound.style.backgroundImage = "";
							sound[i].css("background-image", "");
							//sound.style.backgroundImage = "url(\"" + imagesRoot + "speaker-on.png\")";
							sound[i].css("background-image", "url(\"" + imagesRoot + "speaker-on.png\")");
						}
					}
				);
				
				//event fired every time the time get updated
				$(audioElement).bind('timeupdate', methods.timeUpdate);
				
				//set the duration
				$(audioElement).bind('loadedmetadata', methods.setDuration);
				
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
			
			}
			
		},
		
		
		mouseup: function(e){
			if (onplayhead == true) {
				methods.moveplayhead(e);
				//window.removeEventListener('mousemove', methods.moveplayhead, true);
				$(window).unbind('mousemove');
				// change current time
				music.currentTime = duration * methods.clickPercent(e);
				$(audioElement).bind('timeupdate', methods.timeUpdate);
			}
				onplayhead = false;
		},
		
		mousedown: function(){
			onplayhead = true;
			$(window).bind('mousemove', methods.moveplayhead);
			$(audioElement).unbind('timeupdate');


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
				button.className = "";
				button.className = "play";
			}
		},
		
		getIndex: function(element, array){
				//get the Button index
				for (var j=0; j<numberOfAudioElements; j++){
					if (element.id == array[j][0].id){
						return j;
					}
					
				}
				return -1
		},
		
		play: function(audioId){
			
			//which button is invoking the action? In which position within the array is the button located?
			
			var x = methods.getIndex(audioId, button);
			//var x = $.inArray(audioId, button);
						
			if (music[x].paused) {
				music[x].play();
				
				// remove play, add pause
				button[x].removeClass();
				button[x].addClass("pause");

			} else { // pause music
				music[x].pause();
				
				// remove pause, add play
				button[x].removeClass();
				button[x].addClass("play");
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