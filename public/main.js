var width = 700,
    height = 550;

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var map = svg.append("g").attr("id", "map"),
    points = svg.append("g").attr("id", "cities");

var projection = d3.geo.mercator()
    .center([128, 35.9])
    .scale(height * 8)
    .translate([width/2, height/2]);

var path = d3.geo.path().projection(projection);

d3.json("provinces-topo-simple.json", function(error, data) {
  var features = topojson.feature(data, data.objects['provinces-geo']).features;
  map.selectAll('path')
      .data(features)
    .enter().
    append('a')
      .attr('id', function(d) { return '' + d.properties.code })
      .attr('onmousemove', "moveBox(this)")
      .attr('onmouseout', "moveOut()")
      .append('path')
      .attr('class', function(d) { return 'province c' + d.properties.code })
      .attr('d', path)

});

// move the box depending on the mouse location.
function moveBox(data) {
  var regionID = data.id;

  let initX, initY, mousePressX, mousePressY;
  let box = document.getElementById('movingBox');

  initX = box.offsetLeft;
  initY = box.offsetTop;
  mousePressX = event.clientX;
  mousePressY = event.clientY;

  // console.log(mousePressY);

  // let left = mousePressX + 150 + 'px';
  let left = mousePressX - 350 + 'px';
  let top;
  if (mousePressY > 340) {
    var diff = mousePressY - 340;
    top = mousePressY - 35 - (diff/1.5) + 'px';
  }
  else { top = mousePressY - 35 + 'px'; }
  let visib = 'initial'

  box.setAttribute('style', `top: ${top}; left: ${left}; display: ${visib};`);

  // get information from csv file and fill the box.
  $.ajax({
      url: '/180607probs.csv',
      dataType: 'text',
  }).done(successFunction);

  function successFunction(data) {
      var allRows = data.split(/\r?\n|\r/);
      var winner = '';
      var winPerc = 0;
      var place = '';

      // console.log(regionID);

      // to get the information about winner
      for (var eachRow = 0; eachRow < allRows.length; eachRow++) {
          var rowCells = allRows[eachRow].split(',');
          if (rowCells[0] === regionID) {
              place = rowCells[1];
              winner = rowCells[3];
              break;
          }
      }
      
      var output = '<h3 id="krText" class="municip">';
      output += place;

      // find the province name and the winner.
      if (regionID < 30) {
          output += ' 시장';
      } else { output += ' 도지사'; }

      output += '</h3><br><p id="krText">후보별 승리 확률</p> <div id="table">';

      // to get information about all the candidates
      for (var eachRow = 0; eachRow < allRows.length; eachRow++) {
          var rowCells = allRows[eachRow].split(',');

          // [2]: color, [3]: name of candidate, [4]: percentage in float, [5]: percentage in int.
          if (rowCells[0] === regionID) {
              output += '<div class="row" id="krText"> <span class="cell col1">' + rowCells[3] + '</span> <span class="cell col2">'
              
              // divided cases to express very small/big percentages.
              if (rowCells[4] > 0.99) {
                output += '>99%</span><span class="cell col3"><svg width="99" height="10"><rect width="99" height="10"'
              } else if (rowCells[4] < 0.01) {
                output += '<1%</span><span class="cell col3"><svg width="1" height="10"><rect width="1" height="10"'
              } else {
                output += rowCells[5] + '%</span><span class="cell col3"><svg width="' + rowCells[5] + '" height="10"> <rect width= "'
                output += rowCells[5] + '" height="10"'
              }
              output += '" style="fill:'
              output += rowCells[2]; // color 
              output += '" /> </svg> </span> </div>'
          }
      }

      output += '</div>'
      $('.movingBox').html(output);
  } 
}

function moveOut () {
  let box = document.getElementById('movingBox');
  let visib = 'none'

  box.setAttribute('style', `display: ${visib};`);
}


