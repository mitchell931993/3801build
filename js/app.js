/*global
angular,console,sessionStorage
*/
//"use strict";

var sites = "https://iotschoolbackend.herokuapp.com";

var app = angular.module('IoT-School', ['app-directives', 'ngFileUpload','chart.js']);

var email = localStorage.getItem("loggedinemail");

var password = localStorage.getItem("loggedinpassword");

var schoolid = localStorage.getItem("loggedinid");

//angular controller, checks that user is logged into the websitie.
app.controller('MainController',function($scope, $http) {
    var loggedin = this;
    if (sessionStorage.getItem("token") !== null) {
        var token = sessionStorage.getItem("token");
        loggedin.user = {logintoken: token, insession: true, loginbutton: false};
        console.log("TEST1");
        console.log(loggedin.user);
    } else {
        loggedin.user = {logintoken: null, insession: false, loginbutton: true};
        console.log("TEST2");
    }
});
//angular controller for populating table under all devices tab
app.controller('SchoolController',function($scope, $http){
    //makes call to backend for all photons belonging to the user, when supplied the email address and password
    //$http.get("http://iotschool-backend.azurewebsites.net/schools/photon/getAll?user="+email+"&pass="+password)
    $http.get(sites + "/schools/photon/getAll?user="+email+"&pass="+password)
    //on success make photons within scope equal to response from backend
    .success(function (response) {
        console.log(response);
        $scope.photons = response;
    });
});

app.controller('StudentController',function($scope, $http){
    $http.get(sites + "/schools/students/"+schoolid+"/get")
    .success(function(response){
        $scope.students = response;
    });
    $('#removestud').click(function(){
        if (confirm("Delete the selected ? ") == true) {
            $('.check').each(function(i, each) {
                console.log(each);
                if(each.checked){
                    console.log("deleted"+ each.value)
                    $http.delete(sites + "/schools/students/"+each.value);
                }
                location.reload();
            });
        } else {
            alert("Think twice :)")
        }
    });
});

app.controller('TeacherController',function($scope, $http){
    $http.get(sites + "/schools/teachers/"+schoolid+"/get")
    .success(function(response){
        $scope.teachers = response;
    });

    $('#removeteac').click(function(){
        if (confirm("Delete the selected ? ") == true) {
            $('.checktea').each(function(i, each) {
                console.log(each);
                if(each.checked){
                    console.log("deleted"+ each.value)
                    $http.delete(sites + "/schools/teachers/"+each.value);
                }
                location.reload();
            });
        } else {
            alert("Think twice :)")
        }
    });
});


//angular controller for populating table under flash tab, (only online devices)
app.controller('FlashController', function ($scope, $http) {
     //makes call to backend for all photons belonging to the user, when supplied the email address and password
   //$http.get("http://iotschool-backend.azurewebsites.net/schools/photon/getAll?user="+email+"&pass="+password)
   $http.get(sites + "/schools/photon/getAll?user="+email+"&pass="+password)
   .success(function (response) {
    var online = [];
    //iterates through every object within the response array
    for (var i = 0; i < response.length; i++) {
        var value =  response[i]
        console.log(value.connected)
     //if the object property connected is true, add to object to array list online
     if (value.connected == true) {
        online.push(value);
    }
}
    //makes photons within scope equal to online
    $scope.photons = online;});
});

// Convert the data into CSV so it available to download
function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

// Convert the data into TXT so it available to download
var makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});
    var textFile = null;
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
  }
  textFile = window.URL.createObjectURL(data);
  return textFile;
}

// The Event Controller that handle the data
app.controller('EventController', function($scope,$http) {

    // create Angular function for download To TXT
    $scope.downloadtoTXT = function(sourceData){
        var stringwrite = "";
        sourceData.forEach(function(each){
            var str = each.time + "," + each.data + "\n";
            stringwrite +=  str;
        });
        console.log(stringwrite);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = makeTextFile(stringwrite);
        a.download = "data.txt";
        a.click();
    };

    // create Angular function for download To CSV
    $scope.downloadtoCSV = function(args,sourceData) {
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: sourceData
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    };

    $scope.getData = function(data){
        var datas = [];
        data.forEach(function(each){
            datas.push(each.data);
        });
        console.log(datas);
        return datas;
    };

    $scope.getDate = function(data){
        var datas = [];
        data.forEach(function(each){
            datas.push(each.time);
        });
        console.log(datas);
        return datas;
    };

    $scope.getSeries = function(data){
        var datas = [];
        datas.push(data.name);
        console.log(datas);
        return datas;
    };

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    // Create Angular Function for creating Graph
    $scope.graphMe = function(data){
        var graphed = [];
        data.forEach(function(each){
            if(each.name != "spark/status" && each.name != "spark/flash/status" && each.name != "spark/online"){
                var graphlabel = [];
                var graphdata = [];
                var graphone = [];
                var graphseries = each.name;
                var newevents = [];
                each.events.forEach( function(one){
                    graphlabel.push(new Date(one.time));
                    graphdata.push(one.data);
                    var datestring = "" + new Date(one.time);
                    newevents.push({time : datestring, data : one.data});
                });
                graphone.push(graphdata);
                var JSON = { graphLabel : graphlabel, graphData : graphone, graphSeries : graphseries};
                graphed.push({data : {type : each.type, name : each.name, school: each.school, events : newevents },graph : JSON});
                console.log(graphed);
            }

        });
        return graphed;
    };

    // When Search All Data button is clicked, showing all data
    $('#searchAll').click(function(){
        $http.post(sites + "/events/getGroups2")
        .success(function(response){
            $scope.eventgroup = $scope.graphMe(response);
        });
    });

    // When Search Data button is clicked , showing the Data that being pick
    $('#searchData').click(function(){
        var typecheck = [];
        var obj;
        var schoolpick = $('.select2-selection__rendered').html();
        if(schoolpick == "All"){
            schoolpick = null;
        }
        var fromdate = $('#startdate').val();
        var todate = $('#enddate').val();
        var frdt;
        var todt;
        if(fromdate != null && todate != null && fromdate != "" && todate != ""){
            fromdate = fromdate.split('/');
            todate = todate.split('/');
            frdt = "20"+fromdate[2] +"-"+fromdate[1]+"-"+fromdate[0];
            todt = "20"+todate[2] +"-"+todate[1]+"-"+todate[0];
            console.log(frdt);
            console.log(todt);    
        }else{
            frdt = null;
            todt = null;
            console.log(frdt);
            console.log(todt);
        }
        if(!($('#temperatureCheck').is(":checked")|| $('#vibrationCheck').is(":checked") || $('#UVCheck').is(":checked") || $('#humidityCheck').is(":checked") || $('#motionCheck').is(":checked") || $('#distanceCheck').is(":checked") || $('#airCheck').is(":checked") || $('#otherCheck').is(":checked"))){
            typecheck.push("");      
        }if ($('#temperatureCheck').is(":checked")){
            typecheck.push('temperature');
        }if ($('#vibrationCheck').is(":checked")){ 
            typecheck.push('vibration');
        }if ($('#UVCheck').is(":checked")){
            typecheck.push('UV');
        }if ($('#humidityCheck').is(":checked")){
            typecheck.push('humidity');
        }if ($('#motionCheck').is(":checked")){
            typecheck.push('motion');
        }if ($('#distanceCheck').is(":checked")){
            typecheck.push('distance');
        }if ($('#airCheck').is(":checked")){
            typecheck.push('airquality');
        }if ($('#otherCheck').is(":checked")){
            typecheck.push($('#otherValue').val());
        }
        typecheck.forEach(function(type){
            console.log(type);
            $.ajax({
                type: 'POST',
                url: sites + "/events/getGroups2",
                data: {typeQuery : type,school : schoolpick, toDate :todt, fromDate : frdt},
                success: function(response){
                    console.log("success");
                    if(obj == null || obj.length == 0){
                        obj = response;
                    }else{
                        response.forEach(function(each){
                            obj.push(each);
                        });
                    }
                },
                async:false
            });
        });
console.log(obj);
var graphgraph = $scope.graphMe(obj);
$scope.eventgroup = graphgraph;
});
});

//hard coded  angular controller for
app.controller('tempEventController',function($scope){
    //Get your devices events for access token dbabf48bdbc7c9cb91a01a83f0bb2a1dfcfa01a1
    var datas = [];
    spark.login({accessToken: "dbabf48bdbc7c9cb91a01a83f0bb2a1dfcfa01a1"});
    $scope.events = datas;
    spark.getEventStream(false, 'mine', function(data) {
      console.log("Event: " + data.data);
      datas.push(data);
  });
});

// For Feed Controller to handle the Stream into an account
app.controller('FeedController',function($scope){
    var em = localStorage.getItem("loggedinemail");
    var pas = localStorage.getItem("loggedinpassword");
    console.log(em +" "+pas);

    spark.login({username: em, password: pas}).then(
      function(token){
        console.log('API call completed on promise resolve: ', token);
        spark.getEventStream(false, 'mine', function(data) {
            console.log(data);
            spark.getDevice(data.coreid, function(err, device) {
              var dname = device.name;
              createTable(data,dname);
              console.log(device.name);
          });
        });
    },
    function(err) {
        console.log('API call completed on promise fail: ', err);
    }
    );

});

// Create Table for the Stream
var createTable = function(data,dname){
    var tr = document.createElement('tr');
    var td1 = tr.appendChild(document.createElement('td'));
    var td2 = tr.appendChild(document.createElement('td'));
    var td3 = tr.appendChild(document.createElement('td'));
    var td4 = tr.appendChild(document.createElement('td'));

    td1.innerHTML = new Date(data.published_at);;
    td2.innerHTML = data.data;
    td3.innerHTML = data.name;
    td4.innerHTML = dname;
    document.getElementById('bodytable').insertBefore(tr,document.getElementById('bodytable').firstChild);

}

// Upload Controller to the server
app.controller('MyCtrl2', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadFiles = function (files) {
        $scope.files = files;
        var schooluser = localStorage.getItem("loggedinemail");
        var schoolpass = localStorage.getItem("loggedinpassword");
        var photons = [];
        $('.checkPhoton').each(function(i, each) {
            if(each.checked){
                photons.push(each.value);
                console.log(each);
                console.log(each.value);   
            }
        });
        if(photons.length == 0){
            alert('Choose at least One Photon pls');
        }else{
            if (files && files.length) {
                Upload.upload({
                    url: 'https://iotschoolbackend.herokuapp.com/uploads2',
                    data: {
                        email : schooluser, 
                        pass : schoolpass,
                        files: files,
                        photon : photons
                    }
                }).then(function (response) {
                    console.log(response);
                    if(response.status == 200 && response.code !="ENOENT" && response.data.ok){
                        $scope.errorMsg = null;
                        $scope.successMsg = response.data.message + " Wait Till the LED turn to Blue again.";
                        $scope.categoryMsg = "success";
                    } else if(response.status == 200 && !response.data.ok && response.data.errors != null){
                        $scope.successMsg = null;
                        $scope.categoryMsg = "danger";
                        $scope.errorMsg = "Something Wrong with Flashing !";
                    }
                    $timeout(function () {
                        $scope.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function (evt) {
                    $scope.progress = 
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
}
}
};
}]);
