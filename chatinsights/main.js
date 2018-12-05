$(document).ready(function () {
    initialize();
});

var allData = null;
var product = null;
var locationC = null;
var week = null;
var startDate = null;
var endDate = null;
var biggestSum = 0;
var words = [];
var products = {};
var locations = {};
var adj = {};

//var phase = parseInt(queryObj().ph) || 1;

function initialize() {
    $.getJSON( "messages.json", function( data ) {
        allData = data;
        /*
        var items = [];
        $.each( data, function( key, val ) {
            items.push( "<li id='" + key + "'>" + val + "</li>" );
        });
        
        $( "<ul/>", {
            "class": "my-new-list",
            html: items.join( "" )
        }).appendTo( "body" );
        */

        getFilterValues();
        updateFilters();
    });
};

function sortBySum(a, b){
  var aName = a.sum;
  var bName = b.sum; 
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
};

function lookupItem(which) {
    var thisWord = which.data( "word" );
    $.each(sampleData, function(key, value) {
        if (thisWord == value.word) {
            ordinal = key;
            loadItem(key);
            return false;
        }
    });
};

function updateFilters() {
    product = $('#product').val();
    locationC = $('#location').val();
    week = $('#week').val();
    filterData();
};

function getFilterValues() {
    $.each(allData, function(key, value) {
        var tempProduct = value.product;
        var tempLocation = value.location;
        if (!products[tempProduct]) products[tempProduct] = 1;
        if (!locations[tempLocation]) locations[tempLocation] = 1;
    });
    $.each(products, function(key, value) {
        $('#product').append($('<option>', {value: key, text: key}));
    });
    $.each(locations, function(key, value) {
        $('#location').append($('<option>', {value: key, text: key}));
    });

    $("#product").val($("#product option:first").val());
    $("#location").val($("#location option:first").val());
    $("#week").val($("#week option:first").val());
};


function filterData() {
    words = [];
    startDate = moment(moment().day("Monday").week(week).format('YYYY-MM-DD')).toDate();
    endDate = moment(startDate).add(7, 'days').toDate();
    $.each(allData, function(key, value) {
        //console.log(value.timestamp, startDate, endDate);
        if (
            moment(value.timestamp).isBetween(startDate, endDate) &&
            value.location == locationC && 
            value.product == product
        ) {
            //console.log(JSON.stringify(value));
            if (value.nouns) {
                $.each(value.nouns, function(key, value1) {
                    if (value1.word) {
                        if (!words.find(obj => obj.word == value1.word)) {
                            words.push({word: value1.word, sum: 0, neg: 0, pos: 0});
                        };
                        $.each(value1.adjectives, function(key, value2) {
                            var obj = words.find(obj => obj.word == value1.word);
                            obj.sum += parseInt(value2.count);
                            if (parseFloat(value2.polarity) > 0)
                                obj.pos += parseInt(value2.count);
                            else
                                obj.neg += parseInt(value2.count);
                        });
                    }
                });
            }
        }
    });
    displayData();
};

function getperc(a, b) {
    return parseFloat(b / a * 100);
};

function displayData() {
    $('#first').empty();
    words.sort(sortBySum);

    //words.shift();  // throwing away the biggest value word

    $.each(words, function(key, value) {
        if (value.neg > biggestSum)
            biggestSum = value.neg;
        if (value.pos > biggestSum)
            biggestSum = value.pos;

    });
    //biggestSum = words[0].sum;

    $.each(words, function(key, value) {
        if (value.sum > 1) {   // throwing away all words that have a sum of 1
            var $tr = $('<tr data-word="'+value.word+'">')
                .on("click", function(){displayWord($(this).data("word"))})
                .append(
                    $('<td class="label1">'+value.word+' ['+value.sum+']</td>'),
                    $('<td><div style="width: '+getperc(biggestSum, value.pos)+'%"><span>'+value.pos+'</span></div><div style="width: '+getperc(biggestSum, value.neg)+'%"><span>'+value.neg+'</span></div></td>'))
                .appendTo('#first');
        }
    });
};

function displayWord(thatWord) {
    console.log(thatWord)
};

function loadItem(which) {
    $('#datatable').empty();
    var singleItem = sampleData[which];
    
    if (singleItem) {
        $.each(singleItem, function(key, value) {
            if (phase == 2) {
                if (key == 'labels' || key == 'intent')
                    return true
            };
            $.each(labelsDefault, function(ikey, ivalue) {
                if (key == 'intent') {
                    if (value.toLowerCase() == getLastLabel(ivalue).toLowerCase()) {
                        value += '<br>' + sanitizeLabels(ikey)
                    }
                }
            });
            if (key == 'labels' && value) {
                value = beautifyLabels(value)
            };
            var $tr = $('<tr>').append(
                $('<td class="la">').text(key),
                $('<td class="' + (key == 'intent' || key == 'labels' || key == 'new_label' ? 'field labels' : 'field') + '">').html("<pre>" + value + "</pre>")
            ).appendTo('#datatable');
        });
    }
    else {
        var $tr = $('<tr>').append(
            $('<td class="la">').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'),
            $('<td class="field">').html("<pre><br><br>Hooray!<br>You're done with this phase. <svg role='img' width=50 height=50 style='vertical-align: middle'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#accept'></use></svg><br><br><a href='?ph="+(phase + 1)+"'>Start phase #"+(phase + 1)+" of 4</a></pre>")
        ).appendTo('#datatable');
    };
};

function queryObj() {
    search = location.search;
    return search.substring(1).split("&").reduce(function(result, value) {
      var parts = value.split('=');
      if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      return result;
    }, {})
};