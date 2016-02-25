var currDate = 0;
var finalArray = [];
var gamesArray = [];

//Width and height
var w = window.innerWidth * (8/10);
var h = window.innerHeight * (9/10);
//Define map projection
var projection = d3.geo.albersUsa()
					   .translate([w/2, h/2])
					   .scale([2000]);

//Define path generator
var path = d3.geo.path()
				 .projection(projection);

// The SVG Element
var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

d3.json("us-states.json", function(json) {
	svg.selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .style("fill", "#D3D3D3");

	   $.ajax( {
	         url: '/tweets',
	         type: 'POST',
	         success: function(geostuff) {
				var i;
				for (i in geostuff) {
					if (!finalArray[geostuff[i].days_ago]) {
						finalArray[geostuff[i].days_ago] = []
					}
					finalArray[geostuff[i].days_ago].push(geostuff[i]);
				}

				$('#slider')[0].max = finalArray.length;
				$('#slider')[0].min = 0;
				$('#slider')[0].step = 1;
				$('#slider')[0].value = finalArray.length;

				// Games
		 	   $.ajax( {
		 	   	  url: '/games',
		 	   	  type: 'POST',
		 	   	  success: function(data) {
		 	   		  gamesArray = data;
		 			  if (gamesArray[currDate]) {
		 		  		$('#game').show();
		 		  		$('#team').html(gamesArray[currDate].team);
		 		  		$('#score').html(gamesArray[currDate].score);
		 		  	} else {
		 		  		$('#game').hide();
		 		  	}
		 	   	  }
		 	   });

				// Add dots
		 	    a();
	         }
	   });


});

var a = function () {
	var geostuff = finalArray[currDate];

	var positiveTweets = geostuff.filter(function (value) {
		return value.positive;
	})
	var negativeTweets = geostuff.filter(function (value) {
		return !value.positive;
	})

	if (svg.selectAll("circle")) {
		svg.selectAll("circle").remove();
	}

   svg.selectAll("circle")
	  .data(positiveTweets)
	  .enter()
	  .append("circle")
	  .attr("cx", function(d) {
	   return projection([d.lon, d.lat])[0];
	  })
	  .attr("cy", function(d) {
	   return projection([d.lon, d.lat])[1];
	  })
	  .attr("r", 15)
	  .style("fill", "blue")
	  .style("opacity", 0.2);
  svg.selectAll("circle")
	 .data(negativeTweets)
	 .enter()
	 .append("circle")
	 .attr("cx", function(d) {
	  return projection([d.lon, d.lat])[0];
	 })
	 .attr("cy", function(d) {
	  return projection([d.lon, d.lat])[1];
	 })
	 .attr("r", 15)
	 .style("fill", "red")
	 .style("opacity", 0.2);
};

// Slider Logic
$('#slider').change(function(){
	currDate = finalArray.length - $(this).val();
	$('#days').html(currDate + "Days Ago");
	if (gamesArray[currDate]) {
		$('#game').show();
		$('#team').html(gamesArray[currDate].team);
		$('#score').html(gamesArray[currDate].score);
	} else {
		$('#game').hide();
	}
	$('#')
	a();
});
