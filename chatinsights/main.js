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
var weeks = [];
var words = [];
var word1 = [];
var products = [];
var locations = [];
var mainWord = "";

function initialize() {
    $.getJSON( json + ".json", function( data ) {
        allData = data;
        getFilterValues();
        updateFilters();
    })
    .done(function() { })
    .fail(function() { 
        $('div#loading').addClass('hidden');
        $('div#nodata').removeClass('hidden'); })
    .always(function() { });
};

function clearDisp() {
    $('table#first').empty();
    $('table#second').empty();
    $('table#third').empty();
    $('div#fourth').addClass('hidden');
    $('div#loading').removeClass('hidden');
    $('div#nodata').addClass('hidden');
};
function clearSubDisp() {
    $('table#second').empty();
    $('table#third').empty();
    $('div#fourth').addClass('hidden');
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
    var yr = week.split('_')[0];
    var wk = week.split('_')[1];
    startDate = moment(moment().day("Monday").year(yr).week(wk).format('YYYY-MM-DD')).toDate();
    endDate = moment(startDate).add(7, 'days').toDate();
    filterData();
};

function getFilterValues() {
    $.each(allData, function(key, value) {
        var tempProduct = value.product;
        var tempLocation = value.countrycode;
        var momentStamp = moment(value.timestamp); 
        var computedWeek = momentStamp.year() + '_' + momentStamp.isoWeek();
        if (products.indexOf(tempProduct) == -1) products.push(tempProduct);
        if (locations.indexOf(tempLocation) == -1) locations.push(tempLocation);
        if (weeks.indexOf(computedWeek) == -1) weeks.push(computedWeek);
    });
    products.sort();
    locations.sort();
    weeks.sort();
    $.each(products, function(key, value) {
        $('#product').append($('<option>', {value: value, text: value}));
    });
    $.each(locations, function(key, value) {
        $('#location').append($('<option>', {value: value, text: value}));
    });
    $.each(weeks, function(key, value) {
        var yr = value.split('_')[0];
        var wk = value.split('_')[1];
        $('#week').append($('<option>', {value: value, text: 'Week ' + wk + ', ' + yr}));
    });

    $("#product").val($("#product option:first").val());
    $("#location").val($("#location option:last").val());
    $("#week").val($("#week option:first").val());
};

function filterData() {
    clearDisp();
    setTimeout(function () {
        words = [];
        $.each(allData, function(key, value) {
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
        displayData(words, 'first');
    }, 1);
};

function getperc(a, b) {
    return parseFloat(b / a * 100);
};

function displayData(source, table) {
    var sorter = sortBySum;
    if (sentiments == 1) sorter = sortByPos;
    if (sentiments == 2) sorter = sortByNeg;
    source.sort(sorter);
    if (table == 'first') mainWord = "";
    if (table != 'third') biggestSum = 0;

    //source.shift();  // throwing away the biggest value word

    $.each(source, function(key, value) {
        if (value.neg > biggestSum)
            biggestSum = value.neg;
        if (value.pos > biggestSum)
            biggestSum = value.pos;

    });

    $.each(source, function(key, value) {
        if (value.sum > 0) {   // throwing away all words that have a sum of 1
            if (sentiments == 1 && value.pos == 0) return true;
            if (sentiments == 2 && value.neg == 0) return true;
            var $tr = $('<tr data-table="'+table+'" data-word="'+value.word+'">')
                .on("click", function(){displayWord($(this).data("table"), $(this).data("word"))})
                .append(
                    $('<td class="label1">'+value.word+(sentiments == 0 ? ' &nbsp;<span class="sum">'+value.sum+'</span>' : '')+'</td>'),
                    $('<td><div style="width: '+getperc(biggestSum, value.pos)+'%"><span>'+value.pos+'</span></div><div style="width: '+getperc(biggestSum, value.neg)+'%"><span>'+value.neg+'</span></div></td>'))
                .appendTo('#' + table);
        }
    });

    $('table.sent td div').removeClass('hidden')
    if (sentiments == 1) {
        $('table.sent td:nth-child(2) div:nth-child(2)').addClass('hidden')
    }
    if (sentiments == 2) {
        $('table.sent td:nth-child(2) div:nth-child(1)').addClass('hidden')
    };

    if (!source.length) 
        $('div#nodata').removeClass('hidden')

    $('div#loading').addClass('hidden');
};

function displayBubble(w1, w2) {
    $('div#fourth').removeClass('hidden');
    $('div#bubbles').empty();
    $.each(allData, function(key, value) {
            if (
                moment(value.timestamp).isBetween(startDate, endDate) &&
                value.countrycode == locationC && 
                value.product == product
            ) {
                if (value.nouns) {
                    $.each(value.nouns, function(key, value1) {
                        if (value1.word == w1) {
                            $.each(value1.adjectives, function(key, value2) {
                                if (value2.word == w2) {
                                    showBubble(value, w1, w2);
                                }
                            });
                        }
                    });
                }
            }
        
    });
};

function showBubble(value, w1, w2) {
    $('#bubbles').append($(
        '<div class="bubble"><div class="props"><div class="label">'+product+'</div><div class="label">'+value.countrycode+', '+value.city+'</div><div class="label">'+moment(value.timestamp).format('LLL')+'</div></div><div class="words"><div class="label">'+w1+'</div><div class="label">'+w2+'</div></div><div class="text">'+value.text+'</div><div class="more"><span class="href">Show full chat ></span></div></div>')
    );
};

function displayWord(targetTable, thatWord) {
    if (!thatWord.length) return;
    if (targetTable == 'first') {
        mainWord = thatWord;
    };
    if (targetTable == 'second') {
        return;
    };
    if (targetTable == 'third') {
        displayBubble(mainWord, thatWord);
        return
    };
    clearSubDisp();
    word1 = [];
    word2 = [];
    filteredWords = [];
    window.scrollTo(0, 0);

    $.each(allData, function(key, value) {
        if (
            moment(value.timestamp).isBetween(startDate, endDate) &&
            value.countrycode == locationC && 
            value.product == product
        ) {
            if (value.nouns) {
                $.each(value.nouns, function(key, value1) {
                    if (value1.word && value1.word == thatWord) {
                        filteredWords.push({word: value1.word, adjectives: value1.adjectives});
                    }
                });
            }
        }
    });
    
    $.each(filteredWords, function(key, value1) {
        if (!word1.find(obj => obj.word == value1.word)) {
            word1.push({word: value1.word, sum: 0, neg: 0, pos: 0});
        };
        $.each(value1.adjectives, function(key, value2) {
            var obj = word1.find(obj => obj.word == value1.word);
            obj.sum += parseInt(value2.count);
            if (parseFloat(value2.polarity) > 0)
                obj.pos += sentiments != 2 ? parseInt(value2.count) : 0;
            else
                obj.neg += sentiments != 1 ? parseInt(value2.count) : 0;

            var obj2 = word2.find(obj => obj.word == value2.word);
            if (!obj2) {
                obj2 = {word: value2.word, sum: 0, neg: 0, pos: 0};
                word2.push(obj2)
            };

            obj2.sum += parseInt(value2.count);
            if (parseFloat(value2.polarity) > 0)
                obj2.pos += sentiments != 2 ? parseInt(value2.count) : 0;
            else
                obj2.neg += sentiments != 1 ? parseInt(value2.count) : 0;
        });
    });

    displayData(word1, 'second');
    displayData(word2, 'third');
};

function queryObj() {
    search = location.search.replace(/\//g, '');
    return search.substring(1).split("&").reduce(function(result, value) {
      var parts = value.split('=');
      if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      return result;
    }, {})
};

var json = queryObj().data || "messages";