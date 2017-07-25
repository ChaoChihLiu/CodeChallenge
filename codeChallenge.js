'use strict';
/*
question2, prepare data function: http://basketball.example.com/thisweek.json
accessing data from different domain, cross-domain should be considered.
*/
var getbasketballdata = function(url){
	return new Promise(function(resolve, reject){
		
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if( xhr.readyState === 4 ){
				if( xhr.status === 200 ){
					//of course, I don't expect it can be done
					setTimeout( resolve(xhr.response), 1000 );
				}else{
					/*
						Normally, error should be thrown from general function, 
						let business doer handle exception, but here I would like to prepare data;
					*/
					resolve(genData(url));
				}
			}
		}//end of onreadystatechange
		xhr.open("Get", url, true);
		xhr.setRequestHeader( 'Content-Type', 'application/json' );
		xhr.send();
		
	});
}

function genData(url) {
   if( url.indexOf( 'thisweek' ) != -1 ){
	   return {
				  "week": "51st of 2011",
				  "games": [
					{ "url": "http://basketball.example.com/game/1" },
					{ "url": "http://basketball.example.com/game/2" },
					{ "url": "http://basketball.example.com/game/3" },
					{ "url": "http://basketball.example.com/game/4" }
				  ]
				};
   }
   
   let names1 = [ "Lakers", "Bulls", "Knicks" ];
   let names2 = [ "Raptors", "Warriors", "Clippers" ];
   if( url.indexOf( 'game' ) != -1 ){
	   return {
			  "id": url.substring(url.length-1, url.length),
			  "teams": [
				{
				  "name": names1[getRandomIntInclusive(0, 2)],
				  "score": getRandomIntInclusive(10, 100)
				},
				{
				  "name": names2[getRandomIntInclusive(0, 2)],
				  "score": getRandomIntInclusive(10, 100)
				}
			  ]
			};
   }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function summarizeGame( team1, team2 ){
	//Lakers 79 - 99 Bulls
	return team1.name + ' ' + team1.score + ' - ' + team2.score + ' ' + team2.name; 
}

function displayScoreOnDOM(results){
	
	var elements = document.getElementById("question2").getElementsByTagName('p');
		for ( var i = 0; i < results.length; i++ ) {
			elements[i].innerHTML = summarizeGame(results[i].teams[0], results[i].teams[1]);
		}
}

var summary = function(){
	let getdata = getbasketballdata( 'http://basketball.example.com/thisweek.json' );
	
	getdata.then(function(value) {
		  
		  let gamePromises = [];
		  value.games.forEach(function(value){
			  gamePromises.push( getbasketballdata(value.url) );
		  });
		  Promise.all(gamePromises).then(results => { 
				displayScoreOnDOM(results);
			});
			
		}).catch(function(e) {
		  return false;
		});
}

var deepclone = function(obj){
	
	if( obj instanceof Array ) return deepcloneArray(obj);
	if( obj instanceof Date ) return new Date(obj.getTime());
	if( !(obj instanceof Object) && !(obj instanceof Array) ) return obj;
	
	let copy = {};
	for (var property in obj) {
		if (obj.hasOwnProperty(property)) {
			copy[property] = deepclone( obj[property] );
		}
	}
	
	return copy;
}

var deepcloneArray = function(array){
	let copy = [];
	array.forEach(function(value, key){
		copy[key] = deepclone(value);
	});
	return copy;
}

