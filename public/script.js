/*
** Data Formatting
*/

var files = [
	"gsw_data/gsw_1.json",
	"gsw_data/gsw_2.json",
	"gsw_data/gsw_3.json",
	"gsw_data/gsw_4.json",
	"gsw_data/gsw_5.json",
	"gsw_data/gsw_6.json",
	"gsw_data/gsw_7.json",
	"gsw_data/gsw_8.json",
	"gsw_data/gsw_9.json",
	"gsw_data/gsw_10.json"
]
var geostuff = [];
for (var j = 0; j < files.length; j++) {
	$.getJSON( files[j], function(data) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].geo.coordinates[0] >= 25
				&& data[i].geo.coordinates[0] <= 50
				&& data[i].geo.coordinates[1] >= -125
				&& data[i].geo.coordinates[1] <= -65) {
			geostuff.push(
				{
					"lat": data[i].geo.coordinates[0],
					"lon": data[i].geo.coordinates[1]
				});
			}
		}
	});
}

console.log(JSON.stringify(geostuff));

/*
** D3 Stuff
*/

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

	d3.csv("data.csv", function(data) {
    	// Dots on the Map
		svg.selectAll("circle")
		   .data(data)
		   .enter()
		   .append("circle")
		   .attr("cx", function(d) {
			   return projection([d.lon, d.lat])[0];
		   })
		   .attr("cy", function(d) {
			   return projection([d.lon, d.lat])[1];
		   })
		   .attr("r", 5)
		   .style("fill", "blue")
		   .style("opacity", 0.4);

	});
});
