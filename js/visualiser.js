function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -22.831438, lng: 144.169743},
        zoom: 0,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    map.setTilt(0);
    var styles = [
      {
         stylers: [
            { hue: "#00ffe6" },
            { saturation: -20 }
         ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
            { lightness: 100 },
            { visibility: "simplified" }
        ]
        },{
            featureType: "road",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    map.setOptions({styles: styles});
}

