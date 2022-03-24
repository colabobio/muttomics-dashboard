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
      f1:d.Q121,
      f2:d.Q125,
      f3:d.Q127,
      f4:d.Q124,
      f5:d.Q54,
      f6:d.Q123,
      f7:d.Q60,
      f8:d.Q17,
      value: + Math.round(d.frac_of_breed*100),
      img:d.img
    }
  });
 } 

function updateFilteredData() {
  console.log(data);
  filteredData_mix = data.filter(function(d){
    return( d.breed == "Mutts"
      )
  });

  filteredData2 = filteredData_mix.filter(function(d) {
    return ( d.f1 === selectedFactor1 && d.f2 === selectedFactor2
           && d.f3 === selectedFactor3 && d.f4 === selectedFactor4 
           && d.f5 === selectedFactor5 && d.f6 === selectedFactor6
           && d.f7 === selectedFactor7 && d.f8 === selectedFactor8
           )
  });

  filteredData_pure = data.filter(function(d){
    return( d.breed !== "Mutts"
      )
  });

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
      .attr("y", -4)//-25
      .attr("x", 90) //93

  }
  el.text(d.breed);
}

function updatevalue(d) {
    var val = d3.select(this)
           .select(".value");
    
  if(val.empty()) {
   val = d3.select(this)
      .append("text")
      .attr("class", "value")
      .attr("y", -18)
      .attr("x", 90) 
  }

  val.text(function(d){
    if (d.value == "0"){
      return "<1" + "%" + " "+ "of"
    }else {
      return d.value + "%" + " "+ "of"
    }
  });
}

function updatepath(d) {

  var path = d3.select(this)
               .select(".path");
      
      if(path.empty()) {
        path = d3.select(this)
             .append("path")
             .attr('class','path')
             .style("stroke", `#bfbfbf`) 
             .style("fill", "none")
             .style("stroke-width", `1px`)

var path= d3.path();
    path.rect(-2.5, -84, 85, 88); //x,y,w.h
        
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
      .attr("x", 85)//88
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

var u = d3.select(this)
    .attr('transform',`translate(3, ${barWidth})`)
    .selectAll("rect")
    .data(tiles);
    //console.log(this)

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
  d3.selectAll(".holder ").remove(); 
  var u = d3.select("div.purebreeds")
      .selectAll("g") 
      .data(filteredData);

  u.enter()
    .append("div")
    .attr('class','holder')
    .style("width", "215" +"px")
    .style("position", "relative")
    .append('svg')
    .attr("width", "215" +"px")
    .attr('class', 'squares')
    .append('g')
    .attr('class', 'squarepie')
    .merge(u)  
    .style("fill", "#E56DA8")
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
    .style("fill", "#E56DA8")
    .each(updateBar)
    .each(updateLabel)
    .each(updatevalue)
    .each(updateimg)
    .each(updatepath);
}

function initialize() {
  initializeData();

   d3.selectAll("#f1 .button").on("click", function() {
        selectedFactor1 = d3.select(this).attr("value");
        d3.select("#f1 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f2 .button").on("click", function() {
        selectedFactor2 = d3.select(this).attr("value");
        d3.select("#f2 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f3 .button").on("click", function() {
        selectedFactor3 = d3.select(this).attr("value");
        d3.select("#f3 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f4 .button").on("click", function() {
        selectedFactor4 = d3.select(this).attr("value");
        d3.select("#f4 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f5 .button").on("click", function() {
        selectedFactor5 = d3.select(this).attr("value");
        d3.select("#f5 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f6 .button").on("click", function() {
        selectedFactor6 = d3.select(this).attr("value");
        d3.select("#f6 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f7 .button").on("click", function() {
        selectedFactor7 = d3.select(this).attr("value");
        d3.select("#f7 .current").classed("current", false);
        d3.select(this).classed("current", true);
        update();
    });

   d3.selectAll("#f8 .button").on("click", function() {
        selectedFactor8 = d3.select(this).attr("value");
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

d3.select("#all").on('click', function(){

 d3.selectAll('#labels *').remove();

        selectedFactor1 = "any";
        d3.select("#f1 .current").classed("current", false);
        d3.select('#f1 .button[value="any"]').classed("current", true);
        //console.log(selectedFactor1);
        update();

        selectedFactor2 = "any";
        d3.select("#f2 .current").classed("current", false);
        d3.select('#f2 .button[value="any"]').classed("current", true);
        console.log(selectedFactor2);
        update();

        selectedFactor3 = "any";
        d3.select("#f3 .current").classed("current", false);
        d3.select('#f3 .button[value="any"]').classed("current", true);
        update();

        selectedFactor4 = "any";
        d3.select("#f4 .current").classed("current", false);
        d3.select('#f4 .button[value="any"]').classed("current", true);
        update();

        selectedFactor5 = "any";
        d3.select("#f5 .current").classed("current", false);
        d3.select('#f5 .button[value="any"]').classed("current", true);
        update();

        selectedFactor6 = "any";
        d3.select("#f6 .current").classed("current", false);
        d3.select('#f6 .button[value="any"]').classed("current", true);
        update();

        selectedFactor7 = "any";
        d3.select("#f7 .current").classed("current", false);
        d3.select('#f7 .button[value="any"]').classed("current", true);
        update();

        selectedFactor8 = "any";
        d3.select("#f8 .current").classed("current", false);
        d3.select('#f8 .button[value="any"]').classed("current", true);
        update();

    })
  
d3.csv("./data/question_data.for_viz.frac_gt_withZeros.csv", function(err, test) {
  data = test;
  //console.log(data);
  initialize();
  update();
});
