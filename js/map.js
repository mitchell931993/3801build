    $(window).resize(function () {
        var h = $(window).height(),
        offsetTop = 0 // calculate the top offset

        $('#map').css('height', (h-offsetTop));
    }).resize();


var map = null; //declares variable to be null

/* called on map load
   styles map and calls functions to place markers
   */
function initMap() {
    // Create an array of styles.
    var styles = [
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
        { "visibility": "off" }
        ]
    },{
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
        { "visibility": "off" }
        ]
    },{
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
        { "visibility": "off" }
        ]
    },{
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
        { "visibility": "on" }
        ]
    },{
        "featureType": "transit",
        "stylers": [
        { "visibility": "off" }
        ]
    },{
        "featureType": "landscape",
        "stylers": [
        { "weight": 0.1 },
        { "gamma": 2.81 },
        { "color": "#906F45" },
        { "lightness": 51 },
        { "saturation": 15 }
        ]
    },{
        "featureType": "road",
        "stylers": [
        { "color": "#4b3b22" },
        { "saturation": 2 },
        { "lightness": 13 },
        { "gamma": 1.42 }
        ]
    },{
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [
        { "visibility": "on" },
        { "weight": 0.4 },
        { "color": "#10330c" }
        ]
    },{
        "featureType": "water",
        "stylers": [
        { "saturation": -83 },
        { "hue": "#004cff" },
        { "lightness": -60 }
        ]
    },{
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
        { "visibility": "simplified" },
        { "color": "#af8343" }
        ]
    },{
        "featureType": "poi.park",
        "stylers": [
        { "color": "#559A64" },
        { "hue": "#e6ff00" },
        { "saturation": -43 },
        { "lightness": 21 }
        ]
    },{
        "featureType": "poi.business",
        "stylers": [
        { "visibility": "off" }
        ]
    },{
        "featureType": "poi.school",
        "elementType": "labels",
        "stylers": [
        { "visibility": "on" },
        { "color": "#484483" },
        { "lightness": -1 },
        { "gamma": 0.86 },
        { "weight": 0.6 }
        ]
    }];

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles,
        {name: "Styled Map"});

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(-23.020155, 145.191018),
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']},
            streetViewControl: false
        };
        map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    addMarkers();
}

/* makes get request to the back end for a list of all nodes that have data to display.
   */
function addMarkers() {
    $.get("http://iotschoolbackend.herokuapp.com/schools/locations", function(json, status){  // makes call to heroku backend
        for (var i = 0, length = json.length; i < length; i++) { //iterates through each response from the server
            var data = json[i],
            latLng = new google.maps.LatLng(data.latitude, data.longitude);

            // Creating a marker and putting it on the map
            var marker = new google.maps.Marker({
            position: latLng,
            title: data.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: 'Blue',
                fillOpacity: 0.8,
                scale: 15,
                strokeWeight: 0},
                map: map
            });
            marker['infowindow'] =  new google.maps.InfoWindow({
                maxWidth: 2000,
                maxHeight:400
            })
            infoBox(marker, data.id, data.name); // calls infoBox which populates and ensures only on infoWindow is open for a particular marker.
        }
    });

}
/*
   given a marker which has infowindow attached to it
   the id for that marker and the name of the location
   calls functions and opens the infoWinfow associated with the given marker when clicked */
function infoBox(marker, id, name) {
    marker.addListener('click', function() { //all actions occur after marker has been clicked
        marker['infowindow'].open(map, marker);

        marker['infowindow'].setContent(markerContent(id, name)); // cretes div layout for an infowWindow as well.
        $.get("http://iotschoolbackend.herokuapp.com/events/7days/"+id, function(res, status){ // pulls content data for the given node from the backend
            for (i = 0, length = res.length; i < length; i++) { // iterates through each data type
                drawChart(id, res[i]) //draws a graph within a particular marker
            }
        });
    });
}

/* given the id for the marker and a json object res, creates all charts and places
   them in premade Divs within a markers InfowWindow
   */
   function drawChart(id, res) {
    var  myLabels = new Array()
    var myData = new Array()
    for (var i = 0, length = res.values.length; i < length; i++) { //interates through the json object getting the  day and avg values to create two seperate arrays
        myLabels.push(res.values[i].day);
        myData.push(res.values[i].avg);
    }

    var data = {
        labels: getTime(myLabels), //use array created above called into function to change time format
        datasets: [
            {
                label: res.type,
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: myData //use other array created
            }
    ]};

    var newid = id+res.type; //get the id to add the graph too, is a combination of marker id and name of data type
    var ctx = document.getElementById(newid).getContext("2d");
    ctx.canvas.width = 200;
    ctx.canvas.height = 200;
    var myNewChart = new Chart(ctx).Line(data, { // sets variables about graph.
        responsive:true,
        maintainAspectRatio: true,
    });


}

/*
   given array of dates ensures format is in day/month
   */
function getTime(dates) {
    var newDates = []
    for (i = 0, length = dates.length; i < length; i++){
        var thisDate = new Date(dates[i]);
        var day = thisDate.getDate();
        var month = thisDate.getMonth();
        newDates.push(day+"/"+month);
    }
    return newDates;
}




/*
   creates div container and sub divs for each InfoWindow when given the name and Id of a marker
   */
function markerContent(id, name) {
    var mycontainer;
    var container = document.createElement('div');
    $.get("http://iotschoolbackend.herokuapp.com/events/7days/"+id, function(json, status){ //calls the info of each type of data
        var info = document.createElement('div');
        info.innerHTML = "<h1>"+name+"</h1>";
        container.appendChild(info);
        for (var i = 0, length = json.length; i < length; i++) { // creates requires divs for each graph to be made
            var graph = document.createElement('div');
            graph.className="graphcase";
            var label = document.createElement('h4');
            var title = json[i].type+" average";

            label.innerHTML = title
            var newid = id+json[i].type
            graph.appendChild(makeGraph(newid)); //appends canvas with the given id
            graph.appendChild(label);
            container.appendChild(graph);
        }
    }).then(mycontainer =  container);
         return mycontainer


}
/*
   creates a canvas with the given id
   */
function makeGraph(id) {
    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.style.width="200px";
    canvas.style.height="100px";
    canvas.id = id;
    return canvas;
}
