/**
 * 
 */
var $body = $('body');
var topTweetIndex;
var $tweets = $('.tweets .container');

$(document).ready(function(){       
	initTweets();
	$('.refresh').click(fetchNewTweets);
});

function parseDate(time){
	//string format: Sun Sep 21 2014 12:54:03 GMT-0700 (PDT)
	//reformat to 9, 21, 2014
	var date = new Date(time);
	return formatMonth(date.getMonth())+' '+date.getDate();
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
	}
	return result;
}

var  initTweets = function(){	
	//The order in sreams.home is oldest to newest
	var tweetsArray = streams.home;
	//store the current latest tweet. We will fetch new tweets from here
    var topTweetIndex = tweetsArray.length-1;
  
    tweetsArray.forEach(function(tweet, index){
    	//var $divider = $('<div class="row col-md-8 col-md-offset-2"><div class="col-md-8 col-md-offset-4"><hr></div></div>');
        var $tweet = $('<div class="tweet row col-md-8 col-md-offset-2"></div>');
        var tweetUser = "<div class='tweet-user col-md-4'>@"+tweet.user+"</div>";
        var tweetMessage = "<div class='col-md-8'>"+tweet.message+"<div class='tweet-time'>"+parseDate(tweet.created_at)+"</div>"+"</div>";
        $tweet.html(tweetUser+tweetMessage);                
        $tweets.prepend($tweet);
     //   $tweets.prepend($divider);
    });
}

var fetchNewTweets = function(){
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
		//var $divider = $('<div class="row col-md-8 col-md-offset-2"><div class="col-md-8 col-md-offset-4"><hr></div></div>');
	    var $tweet = $('<div class="tweet row col-md-8 col-md-offset-2"></div>');
	    var tweetUser = "<div class='tweet-user col-md-4'>@"+tweet.user+"</div>";
	    var tweetMessage = "<div class='col-md-8'>"+tweet.message+"<div class='tweet-time'>"+parseDate(tweet.created_at)+"</div>"+"</div>";
	    $tweet.html(tweetUser+tweetMessage);         
	    $tweets.prepend($tweet);
	//	$tweets.prepend($divider);					            
	});
	//keep the page stay at the current position
	$(document).scrollTop(topTweet.offset().top-curOffset);
}; 
	 

