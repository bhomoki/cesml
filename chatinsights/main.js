$(document).ready(function () {
    initialize();
});

var allData = null;
var product = null;
var locationC = null;
var week = null;
var startDate = null;
var endDate = null;
var sentiments = 0;
var biggestSum = 0;
var words = [];
var products = {};
var locations = [];
var adj = {};

//var phase = parseInt(queryObj().ph) || 1;

function initialize() {
    $.getJSON( "messages.json", function( data ) {
        allData = data;
        getFilterValues();
        updateFilters();
    });
};

function clearDisp() {
    $('table#first').empty();
    $('div#loading').removeClass('hidden');
    $('div#nodata').addClass('hidden');
};

function sortBySum(a, b){
  var aName = a.sum;
  var bName = b.sum; 
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
};

function sortByPos(a, b){
  var aName = a.pos;
  var bName = b.pos; 
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
};

function sortByNeg(a, b){
  var aName = a.neg;
  var bName = b.neg; 
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

function sentFilter(which) {
    sentiments = which;
    filterData();
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
        var tempLocation = value.countrycode;
        if (!products[tempProduct]) products[tempProduct] = 1;
        if (locations.indexOf(tempLocation) == -1) locations.push(tempLocation);
    });
    locations.sort();
    $.each(products, function(key, value) {
        $('#product').append($('<option>', {value: key, text: key}));
    });
    $.each(locations, function(key, value) {
        $('#location').append($('<option>', {value: value, text: value}));
    });

    $("#product").val($("#product option:first").val());
    $("#location").val($("#location option:last").val());
    $("#week").val($("#week option:first").val());
};

function filterData() {
    clearDisp();
    setTimeout(function () {
        words = [];
        startDate = moment(moment().day("Monday").week(week).format('YYYY-MM-DD')).toDate();
        endDate = moment(startDate).add(7, 'days').toDate();
        $.each(allData, function(key, value) {
            //console.log(value.timestamp, startDate, endDate);
            if (
                moment(value.timestamp).isBetween(startDate, endDate) &&
                value.countrycode == locationC && 
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
                                    obj.pos += sentiments != 2 ? parseInt(value2.count) : 0;
                                else
                                    obj.neg += sentiments != 1 ? parseInt(value2.count) : 0;
                            });
                        }
                    });
                }
            }
        });
        displayData();
    }, 1);
};

function getperc(a, b) {
    return parseFloat(b / a * 100);
};

function displayData() {
    var sorter = sortBySum;
    if (sentiments == 1) sorter = sortByPos;
    if (sentiments == 2) sorter = sortByNeg;
    words.sort(sorter);
    biggestSum = 0;

    //words.shift();  // throwing away the biggest value word

    $.each(words, function(key, value) {
        if (value.neg > biggestSum)
            biggestSum = value.neg;
        if (value.pos > biggestSum)
            biggestSum = value.pos;

    });

    $.each(words, function(key, value) {
        if (value.sum > 0) {   // throwing away all words that have a sum of 1
            var $tr = $('<tr data-word="'+value.word+'">')
                .on("click", function(){displayWord($(this).data("word"))})
                .append(
                    $('<td class="label1">'+value.word+' ['+value.sum+']</td>'),
                    $('<td><div style="width: '+getperc(biggestSum, value.pos)+'%"><span>'+value.pos+'</span></div><div style="width: '+getperc(biggestSum, value.neg)+'%"><span>'+value.neg+'</span></div></td>'))
                .appendTo('#first');
        }
    });

    $('table.sent td div').removeClass('hidden')
    if (sentiments == 1) {
        $('table.sent td:nth-child(2) div:nth-child(2)').addClass('hidden')
    }
    if (sentiments == 2) {
        $('table.sent td:nth-child(2) div:nth-child(1)').addClass('hidden')
    };

    if (!words.length) 
        $('div#nodata').removeClass('hidden')
    else 
        console.log(words.length);

    $('div#loading').addClass('hidden');
};

function displayWord(thatWord) {
    console.log(thatWord)
};

function loadItem(which) {
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