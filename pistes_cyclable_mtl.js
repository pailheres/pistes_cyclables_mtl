console.log("Start Program");

var script = document.currentScript;
var fullUrl = script.src;
console.log(script);
console.log(fullUrl);

var tmp_src_prefix = fullUrl.split('/').slice(0, -1).join('/') + '/';

// prefix for files path
//var tmp_src_prefix = "";  //for local debug
//var tmp_src_prefix = "https://rawgit.com/pailheres/pistes_cyclables_mtl/master/";  //use rawgit for full web access (dev only)
//var tmp_src_prefix = "https://cdn.rawgit.com/pailheres/pistes_cyclables_mtl/7b548751/";  //use rawgit for full web access (release)

console.log(tmp_src_prefix);


// first list the types in an array
var mtl_types_voie = {
    //0: "null",
    1: "Chaussée désignée",
    2: "Accotement asphalté",
    3: "Bande cyclable",
    4: "Piste cyclable sur rue",
    5: "Piste cyclable en site propre",
    6: "Piste cyclable au niveau du trottoir",
    7: "Sentier polyvalent",
    8: "Vélorue"
    // etc.
};
var mtl_types_voie2 = {
    0: "Par défault - Dans le sens de la circulation",
    11: "Chaussée désignée et chaussée désigné à contresens",
    13: "Chaussée désignée et bande cyclable dans le sens de la circulation",
    30: "Une seule bande cyclable à contre sens",
    31: "Bande cyclable à contre sens et chaussée désignée",
    33: "Bande cyclable et bande cyclable à contre sens",
    34: "Bande cyclable en heure de pointe"
};

var mbAttr = 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, ' +
             '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
             'Imagery © <a href="https://mapbox.com">Mapbox</a>',
    mbUrl  = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var  streets     = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr})
    ,grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr})
    ,roadmap     = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ,satellite   = L.tileLayer('https://{s}.tiles.mapbox.com/v3/moklick.lh736gg3/{z}/{x}/{y}.png')
    ,terrain     = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png')
    //,cycling     = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png')
    ,simple      = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
                                subdomains: ['','a.','b.','c.','d.'],
                                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
                              })
    ;

var baseLayers = {
  "streets": streets,
  "grayscale": grayscale,
  "roadmap": roadmap,
  "satellite": satellite,
  "terrain": terrain,
  //"cycling": cycling,
  "simple": simple,
};

var map = L.map('mapid', {
    center: [45.555555, -73.647647], //ahuntsic
    zoom: 11,
    minZoom: 2, 
    maxZoom: 18,
    keyboard: true,
    zoomControl: true,
    layers: [simple]
});

//control for base (radiobutton) and overlays(checkbox)
var tmp_layerControl = L.control.layers(baseLayers, null, {collapsed:false}).addTo(map);
//var tmp_layerControl2 = L.control.layers(baseLayers, null, {collapsed:false, position:bottomright}).addTo(map);


var tmp_layer_ip251;
//load GeoJSON from an external file
$.getJSON(tmp_src_prefix + "data_out/Stations_2017.geojson", f_cb_bixi_stations_geojson);
function f_cb_bixi_stations_geojson(data_bixi_stations) {
    // add GeoJSON layer to the map once the file is loaded
    // Use the data to create a GeoJSON layer and add it to the map
    tmp_layer_stations_bixi = L.geoJson(data_bixi_stations);
    //tmp_layer_ip251.addTo(map);  //this should be uncomment to have the layer selected by default
    // Add the geojson layer to the layercontrol
    tmp_layerControl.addOverlay(tmp_layer_stations_bixi, 'stations BIXI');
};


$.getJSON(tmp_src_prefix + "data_out/reseau_cyclable_2018_janv2018.geojson", f_cb_pistes_mtl_geojson);
function f_cb_pistes_mtl_geojson(data) {
    // iterate over types, filter by that type, and format the layer for that feature type
    for (var type in mtl_types_voie) {
        var layer = L.geoJson(data, {
            style: f_cb_style,
            onEachFeature: function(feature, layer) {
                //put properties in a popup table
                var popupContent = "";
                popupContent += "<table>";
                for (var k in feature.properties) {
                    popupContent += "<tr><td>";
                    popupContent += k + '<td>' + String(feature.properties[k]);
                    if (k == "TYPE_VOIE") {
                        popupContent += " (" + mtl_types_voie[type] + ")";
                    }
                    else if (k == "TYPE_VOIE2") {
                        popupContent += " (" + mtl_types_voie2[type] + ")";
                    }
                    popupContent += "</td></tr>";
                }
                popupContent += "</table>";
                layer.bindPopup(popupContent);
            }, 
            filter: function(feature, layer) {
                return feature.properties.TYPE_VOIE == type;
            }
        })
        layer.addTo(map);
        // all done with the layer, add it to the control
        tmp_layerControl.addOverlay(layer, mtl_types_voie[type]);
    }
}

function f_cb_style(feature, layer) {
    var tmp_color = '#FF0000';

    switch(feature.properties.TYPE_VOIE) {
        case 1:
            tmp_color = '#FF8000';
            break;
        case 2:
            tmp_color = '#EEEE00';
            break;
        case 3:
            tmp_color = '#84FF00';
            break;
        case 4:
            tmp_color = '#00EEEE';
            break;
        case 5:
            tmp_color = '#0084FF';
            break;
        case 6:
            tmp_color = '#8400FF';
            break;
        case 7:
            tmp_color = '#EE0000';
            break;
        case 8:
            tmp_color = '#FF8000';
            break;
        default:
            tmp_color = '#000099';
    }

    return {
        weight: 4
        ,opacity: 0.5
        ,color: tmp_color
        //,dashArray: '3'
        //,fillOpacity: 0.3
        //,fillColor: '#666666'
    };

}

//fichier commute au travail 6 septembre 2017 
var tmp_layer_ip251;
//load GeoJSON from an external file
$.getJSON(tmp_src_prefix + "data_out/IpBike_251.geojson",function(data_ipbike){
    // add GeoJSON layer to the map once the file is loaded
    // Use the data to create a GeoJSON layer and add it to the map
    tmp_layer_ip251 = L.geoJson(data_ipbike);
    //tmp_layer_ip251.addTo(map);  //this should be uncomment to have the layer selected by default
    // Add the geojson layer to the layercontrol
    tmp_layerControl.addOverlay(tmp_layer_ip251, 'ip251');
});

//marker example
//L.marker([45.566169, -73.654492]).addTo(map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString() )
        .openOn(map);
}
map.on('click', onMapClick);

//add scale at bottom left
//L.control.scale().addTo(map);
/*

// Setup svg element to work with
var svg = d3.select("#map").select("svg"), linklayer = svg.append("g"), nodelayer = svg.append("g");

//var tmp_links = [];
d3.json("data_out/bla.geojson", function(tmp_nodes) {
    d3.csv("data_out/links2.csv", function(tmp_links) {
        //tmp_links = data;
        console.log(tmp_links[0]);
        console.log(tmp_links[1]);

        // Instantiate spatial sankey
        var spatialsankey = d3.spatialsankey()
                              .lmap(map)
                              .nodes(tmp_nodes.features)
                              .links(tmp_links);

        // Draw nodes
        var node = spatialsankey.node();
        var circs = nodelayer.selectAll("circle")
                             .data(spatialsankey.nodes())
                             .enter()
                             .append("circle")
                             .attr("cx", node.cx)
                             .attr("cy", node.cy)
                             .attr("r", node.r)
                             .style("fill", node.fill);

        // Draw links
        link = spatialsankey.link();
        var beziers = linklayer.selectAll("path")
                               .data(spatialsankey.links())
                               .enter()
                               .append("path")
                               .attr("d", link)
                               .attr('id', function(d){return d.id})
                               .style("stroke-width", link.width())
                               .style("fill", 'none');
                               
    });
});
//    console.log(tmp_links[0]);


//utilise ca pour trouver ou ca plante
L.control.scale().addTo(map);






// Initialize the SVG layer
//map._initPathRoot()

// Setup svg element to work with
var svg = d3.select("#map").select("svg"), linklayer = svg.append("g"), nodelayer = svg.append("g");


// Load data asynchronosuly
d3.json("data_out/bla.geojson", function(nodes) {
  d3.csv("data_out/links2.csv", function(links) {

    // Setup spatialsankey object
    var spatialsankey = d3.spatialsankey()
                            .lmap(map)
                            .nodes(nodes.features)
                            .links(links);
                            
                            
                            
                            
    
    
    
    
    
    
    var mouseover = function(d){
      // Get link data for this node
      var nodelinks = spatialsankey.links().filter(function(link){
        return link.source == d.id;
      });

      // Add data to link layer
      var beziers = linklayer.selectAll("path").data(nodelinks);
      link = spatialsankey.link(options);

      // Draw new links
      beziers.enter()
        .append("path")
        .attr("d", link)
        .attr('id', function(d){return d.id})
        .style("stroke-width", spatialsankey.link().width());
      
      // Remove old links
      beziers.exit().remove();

      // Hide inactive nodes
      var circleUnderMouse = this;
      circs.transition().style('opacity',function () {
          return (this === circleUnderMouse) ? 0.7 : 0;
      });
    };

    var mouseout = function(d) {
      // Remove links
      linklayer.selectAll("path").remove();
      // Show all nodes
      circs.transition().style('opacity', 0.7);
    };

    // Draw nodes
    var node = spatialsankey.node()
    var circs = nodelayer.selectAll("circle")
      .data(spatialsankey.nodes())
      .enter()
      .append("circle")
      .attr("cx", node.cx)
      .attr("cy", node.cy)
      .attr("r", node.r)
      .style("fill", node.fill)
      .attr("opacity", 0.7)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout);
    
    // Adapt size of drawn objects after leaflet zoom reset
    var zoomend = function(){
        linklayer.selectAll("path").attr("d", spatialsankey.link());

        circs.attr("cx", node.cx)
             .attr("cy", node.cy);
    };
 
    map.on("zoomend", zoomend);
  });
});
var options = {'use_arcs': false, 'flip': false};
d3.selectAll("input").forEach(function(x){
  options[x.name] = parseFloat(x.value);
})

d3.selectAll("input").on("click", function(){
  options[this.name] = parseFloat(this.value);
});
*/
