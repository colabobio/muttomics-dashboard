/* #This waffle chart viz coding inspired by Peter Cook's tiled bar chart
================================================== */
var tilesPerRow = 10;
var tileSize = 8;
var barPadding = 20;

var w = 160
var h = 160

var margin = {
  right: 2,
  left: 2,
  top: 2,
  bottom: 2
}

var barWidth = (tilesPerRow * tileSize) + 5;
var barHeight = (tilesPerRow * tileSize) + 5;
console.log(barWidth);

let colors = ["#91d432"];

var selectedFactor1 = "any";
var selectedFactor2 = "any";
var selectedFactor3 = "any";
var selectedFactor4 = "any";
var selectedFactor5 = "any";
var selectedFactor6 = "any";
var selectedFactor7 = "any";
var selectedFactor8 = "any";

function initializeData() {
  data = data.map(function(d) {
    return {
      breed: titleCase(d.breed),
      f1:d.F1,
      f2:d.F2,
      f3:d.F3,
      f4:d.F4,
      f5:d.F5,
      f6:d.F6,
      f7:d.F7,
      f8:d.F8,
      value: + Math.round(d.frac_of_breed*100),
      img:d.img
    }
  });
 } 

function updateFilteredData() {
  console.log(data);
  filteredData_mix = data.filter(function(d){
    return( d.breed == "Mixed Breed"
      )
  });
  //console.log(filteredData_mix);

  filteredData2 = filteredData_mix.filter(function(d) {
    return ( d.f1 === selectedFactor1 && d.f2 === selectedFactor2
           && d.f3 === selectedFactor3 && d.f4 === selectedFactor4 
           && d.f5 === selectedFactor5 && d.f6 === selectedFactor6
           && d.f7 === selectedFactor7 && d.f8 === selectedFactor8
           )
  });
  //console.log(filteredData2);

  filteredData_pure = data.filter(function(d){
    return( d.breed !== "Mixed Breed"
      )
  });
  //console.log(filteredData_pure);

  filteredData1 = filteredData_pure.filter(function(d) {
    return ( d.f1 === selectedFactor1 && d.f2 === selectedFactor2
           && d.f3 === selectedFactor3 && d.f4 === selectedFactor4 
           && d.f5 === selectedFactor5 && d.f6 === selectedFactor6
           && d.f7 === selectedFactor7 && d.f8 === selectedFactor8
           )
  });

  filteredData = filteredData1.sort((a, b) => d3.descending(a.value, b.value))
  //console.log(filteredData);
}


function getTiles(num) {
  var tiles = [];

  for(var i = 0; i < num; i++) {
    var rowNumber = Math.floor(i / tilesPerRow);
    tiles.push({
      x: (i % tilesPerRow) * tileSize,
      y: -(rowNumber + 1) * tileSize
    });
  }
  return tiles
}

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}

function updateLabel(d) {
  var el = d3.select(this)
             .select(".name");
    console.log(this);

  if(el.empty()) {
    el = d3.select(this)
      .append("text")
      .attr("class", "name")
      .attr("y", -20)//-25
      .attr("x", 93) //95

  }

  //el.text(titleCase(d.breed));
  el.text(d.breed);
}

function updatevalue(d) {
 // var val = d3.selectAll(".squarepie")
    var val = d3.select(this)
           .select(".value");
    
  if(val.empty()) {
  // val = d3.selectAll(".squarepie")
   val = d3.select(this)
      .append("text")
      .attr("class", "value")
      .attr("y", -4)//  .attr("y", -10)
      .attr("x", 93)  //95
  }

  val.text(d.value + "%");
  //console.log(d.value);
}

function updatepath(d) {

  var path = d3.select(this)
               .select(".path");
      
      if(path.empty()) {
        path = d3.select(this)
             .append("path")
             //.attr('class','nes-container is-dark with-title')
             .attr('class','path')
             .style("stroke", `#bfbfbf`) //#bfbfbf
             .style("fill", "none")
             .style("stroke-width", `1.5px`)

var path= d3.path();
    path.rect(-3, -85, barWidth + margin.left, barHeight + margin.top + margin.bottom); //x,y,w.h
        
d3.selectAll(".path").attr("d",path);           
  }
  
}


function updateimg(d) {
var img = d3.select(this)
            .select(".imageholder");
      
      if(img.empty()) {
    img = d3.select(this)
      //console.log(this)
      .append("svg")
      .attr("class","imageholder")
      .attr("width", 80)
      .attr("x", 88)//90
      .attr("y", -105) //-110
      .append("svg:image")
      .attr("class", "dogs")
      .attr("xlink:href",  function(d) { return d.img;})
      //.attr("xlink:href", "./img/breeds/test.png")
      .attr("width", 60)
      .attr("height", 60)
      .attr("transform", "translate(0, 5)")
  }
    img.text(d.img)
      .append("svg:image")
      .attr("class", "dogs")
      .attr("xlink:href",  function(d) { return d.img;})
      .attr("width", 60)
      .attr("height", 60)
      .attr("transform", "translate(0, 5)")

}

function updateBar(d, i) {
 var tiles = getTiles(d.value);
  //console.log(tiles);

//var u = d3.select(this)
var u = d3.select(this)
    .attr('transform',`translate(3, ${barWidth})`)
    .selectAll("rect")
    .data(tiles);
    console.log(this)

  u.enter()
    .append("rect")
    .style("opacity", 0)
    .style("stroke", "#333333")
    .style("stroke-width", "0.8")
    .style("shape-rendering", "crispEdges")
    .merge(u)
    .attr("x", function(d) {
      return d.x;
    })
    .attr("y", function(d) {
      return d.y;
    })
    .attr("width", tileSize)
    .attr("height", tileSize)
    .transition()
    .delay(function(d, i) {
      return i * 20;
    })
    .style("opacity", 1);

  u.exit()
   .transition()
   //.duration(10)
   .delay(function(d, i) {
     // console.log(d);
      //console.log(i);
      return (100 - i) * 20;
    })
    .style("opacity", 1)
    .on("end", function() {
    d3.select(this).remove();
    });
}


function updateBars() {
  var u = d3.select("div.purebreeds")
      .selectAll("g")
    //.selectAll(".holder")  
    .data(filteredData);

  u.enter()
    .append("div")
    .attr('class','holder')
    .style("width", "210" +"px")
    .style("position", "relative")
    .append('svg')
    .attr("width", "210" +"px")
    .attr('class', 'squares')
    .append('g')
    .attr('class', 'squarepie')
    .merge(u)  
    .style("fill", "#B9D432")
    .each(updateBar)
    .each(updateLabel)
    .each(updatevalue)
    .each(updateimg)
    .each(updatepath);

  u.exit().remove();
}

function updateBar_mix() {
  var u = d3.select("div.mixbreed")
    .selectAll("g")
    .data(filteredData2);

  u.enter()
    .append("div")
    .attr('class','holder')
    .style("width", "210" +"px")
    .style("position", "relative")
    .append('svg')
    .attr("width", "210" +"px")
    .attr('class', 'squares')
    .append('g')
    .attr('class', 'squarepie')
    .merge(u)  
    .style("fill", "#B9D432")
    .each(updateBar)
    .each(updateLabel)
    .each(updatevalue)
    .each(updateimg)
    .each(updatepath);

  //u.exit().remove(u);
}

function initialize() {
  initializeData();

   d3.selectAll("#f1 .button").on("click", function() {
        selectedFactor1 = d3.select(this).attr("value");
        console.log(selectedFactor1);
        d3.select("#f1 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f2 .button").on("click", function() {
        selectedFactor2 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f2 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f3 .button").on("click", function() {
        selectedFactor3 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f3 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f4 .button").on("click", function() {
        selectedFactor4 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f4 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f5 .button").on("click", function() {
        selectedFactor5 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f5 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f6 .button").on("click", function() {
        selectedFactor6 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f6 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f7 .button").on("click", function() {
        selectedFactor7 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f7 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f8 .button").on("click", function() {
        selectedFactor8 = d3.select(this).attr("value");
        //console.log(selectedFactor2);
        d3.select("#f8 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

}

function update() {
    updateFilteredData();
    updateBars();
    updateBar_mix();
}

  
d3.csv("./data/factor_data.for_viz.frac_gt_zero.csv", function(err, test) {
  data = test;
  //console.log(data);
  initialize();
  update();
});
