/**
 * 
 */
var $body = $('body');
var topTweetIndex;
var visitor = 'me';
var main = function(){
	streams.users.me=[]; //add one more user 'me'
	
	//initialize tweets
	var $tweets = $('.tweets .container');
	initTweets($tweets);
	
	//button to load more tweets
	$('.refresh').click(fetchNewTweets);
	
	//showUserTimeline when click 'me' on the navigation
	$('.menu > li:first').on('click', 'div', showUserTimeline);
	
	/*show user timeline when click on user's name
	$('.tweet-user').on('click', function) only attaches handler to current page elements
	register to document for later appended element*/
	$(document).on('click', '.tweet-user', showUserTimeline); 
	
	//hide showUserTimeline
	$('.appendedContainer').click(function(){
		$(this).addClass('hide');		
	});
	
	//send user tweets when click tweet-btn or enter key
	$('.tweet-box').on('click','.tweet-btn', sendMyTweet);
	$('.tweet-box').on('keypress', 'input', function(event){
		if(event.which === 13)
			sendMyTweet();
	});
	
	//toggle submenu when hovering settings icon
	$('.menu').find('li').hover( function(){
		$(this).find('.submenu').toggleClass('hide');
	});
	
	/*configure shortcut keys*/
	$(document).on('keypress', function(event){
		//show tweet box
		if(event.which === 116||event.which === 84){
			$('.footer').toggleClass('show-footer');
			$('.footer .hint').addClass('hide');
		}
		//load more tweets
		if(event.which === 108||event.which === 76){
			fetchNewTweets();
			$('.tweets .hint').addClass('hide');
		}
	});
}
$(document).ready(main);
/*This is called when user's name is clicked.*/
var showUserTimeline = function(event){	
	$('.appendedContainer').removeClass('hide');
	var $tweets = $('.tweets .appendedContainer');
	var user = $(event.target).data('usrid');
	initTweets($tweets, user);
	$('.profile .name').text(user);
	$tweets.scrollTop(0);
}
/*2 possible containers to render: home tweets and specific user tweets
 * home tweets - $('.tweets .container') => show home timeline
 * user tweets - $('.tweets .appendedContainer') => show user timeline
 * user parameter can be empty.
 * */
var  initTweets = function(container, user){	
	//The order in sreams.home is oldest to newest
	var tweetsArray=[];
	var tweetLayout;
	var userTag;
	if(user !== undefined){ //show user timeline
		container.children('.tweet').remove(); //clear previous user's tweets
		tweetsArray = streams.users[user];
		tweetLayout = '<div class="tweet row col-md-6 col-md-offset-2"></div>';
		userTag = "<div class='col-md-4'"; //non clickable
		$('.tweetNumber').text(tweetsArray.length);
	}else{	//show home timeline	
		tweetsArray = streams.home;
		//store the current latest tweet. We will fetch new tweets from here
		var topTweetIndex = tweetsArray.length-1;
		tweetLayout = '<div class="tweet row col-md-8 col-md-offset-2"></div>';
		userTag = "<div class='tweet-user col-md-4'"+" data-usrid='";
		
	}
	      
    tweetsArray.forEach(function(tweet, index){   	
    	var $tweet = $(tweetLayout);
        var tweetUser = userTag+tweet.user+"'>@"+tweet.user+"</div>";
        var tweetTime = new parseDate(tweet.created_at);
        var tweetMessage = "<div class='message col-md-8'>"+tweet.message+
        					"<div><span class='tweet-elapsed'>"+tweetTime.getElapsed()+'</span>'+
        						"<span class='tweet-time'>&nbsp;"+tweetTime.getFullTime()+"</span></div>"+
        					"</div>";
        $tweet.html(tweetUser+tweetMessage);                
        container.prepend($tweet);
    });
   
}
/*This is called when 'load more' link is clicked*/
var fetchNewTweets = function(){
	var $tweets = $('.tweets .container');
	//check if there is any new tweets
	if(streams.home.lengh-1 <= topTweetIndex)
			  return;
	//copy the new tweets
	var newTweetsArray = streams.home.slice(topTweetIndex+1);
	
	//store the top tweet and save its current vertical position
	var topTweet = $('.tweet:first');
	var curOffset = topTweet.offset().top - $(document).scrollTop();
	
	//prepend from the element at topTweetIndex to the last element
	newTweetsArray.forEach(function(tweet, index){	
		var tweetTime = new parseDate(tweet.created_at);
	    var $tweet = $('<div class="tweet row col-md-8 col-md-offset-2"></div>');
	    var tweetUser = "<div class='tweet-user col-md-4'"+" data-usrid='"+tweet.user+"'>@"+tweet.user+"</div>";
	    var tweetMessage = "<div class='message col-md-8'>"+tweet.message+"<div class='tweet-elapsed'>"+tweetTime.getElapsed()+
	    					"<span class='tweet-time'>&nbsp;"+tweetTime.getFullTime()+"</span></div>"+
	    					"</div>";
	    $tweet.html(tweetUser+tweetMessage);         
	    $tweets.prepend($tweet);				            
	});
	//keep the page stay at the current position
	$(document).scrollTop(topTweet.offset().top-curOffset);
}; 
/*called when user press enter or tweet button*/
var sendMyTweet = function(){
	writeTweet($('.tweet-box input').val());
	$('.tweet-box input').val('');
	fetchNewTweets();
	$(document).scrollTop(0);
}

/*following 2 functions are used to format time object for display*/
function parseDate(time){
	//string format: Sun Sep 21 2014 12:54:03 GMT-0700 (PDT)
	//reformat to 9, 21, 2014		
	var date = new Date(time);
	var postTime = date.getTime();
	var now = Date.now();
	
	//determine if the tweet was created today
	this.getElapsed =function(){
		//diff shows how many milliseconds ago the user tweeted 
		var result='';
		var diff = now-postTime;
		var MS_23_HR = 82800000;
		var MS_1_HR = 3600000;
		var MS_1_MIN = 60000;
		if(diff< MS_23_HR){
			if(diff > MS_1_HR){
				//show hours
				result = Math.floor(diff/MS_1_HR)+' hours ago';
			}else{
				//show minuts
				result = Math.floor(diff/MS_1_MIN)+' minutes ago';
			}
		}
		return result;	
	}
	this.getFullTime = function(){
		return date.getHours()+':'+date.getMinutes()+' '+formatMonth(date.getMonth())+' '+date.getDate();
	}	
}

function formatMonth(month){
	var result;
	switch(month){
		case 0: result = 'Jan';
				break;
		case 1: result = 'Feb';
			 	break;
		case 2: result = 'Mar';
				break;
		case 3: result = 'Apr';
				break;
		case 4: result = 'May';
				break;
		case 5: result = 'Jun';
				break;
		case 6: result = 'Jul';
				break;
		case 7: result = 'Aug';
				break;
		case 8: result = 'Sep';
				break;
		case 9: result = 'Oct';
				break;
		case 10: result = 'Nov';
				break;
		case 11: result = 'Dec';
				break;
	};
	return result;
}