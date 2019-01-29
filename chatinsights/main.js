$(document).ready(function () {
    initialize();
});

var allData = null;
var product = null;
var locationC = null;
var week = null;
var sentiments = 0;
var biggestSum = 0;
var weeks = [];
var words = [];
var word1 = [];
var products = [];
var locations = [];
var mainWord = "";
var weeksForOneWord = [];

function initialize() {
    if (isMobile) {
        //$('body').addClass('mobile');
        $('body').click(function() {
            $(this).addClass('navclosed')
        });
    };
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

function clearDisp(withLoading) {
    $('div#first').empty();
    $('div#second').empty();
    $('div#third').empty();
    $('div#fourth').addClass('hidden');
    $('div#fifth').empty();
    if (withLoading) $('div#loading').removeClass('hidden');
    $('div#nodata').addClass('hidden');
};
function clearSubDisp() {
    $('div#second').empty();
    $('div#third').empty();
    $('div#fourth').addClass('hidden');
    $('div#fifth').empty();
};

function doSort(a, b) {
    return ((a > b) ? -1 : ((a < b) ? 1 : 0));
};

function sortBySum(a, b){
    var av = a.sum,
        bv = b.sum; 
    return doSort(av, bv);
};

function sortByPos(a, b){
    var av = a.pos,
        bv = b.pos; 
    return doSort(av, bv);
};

function sortByNeg(a, b){
    var av = a.neg,
        bv = b.neg; 
    return doSort(av, bv);
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
        var momentStamp = moment(value.timestamp); 
        var computedWeek = momentStamp.year() + '_' + momentStamp.isoWeek();
        if (products.indexOf(tempProduct) == -1) products.push(tempProduct);
        if (locations.indexOf(tempLocation) == -1) locations.push(tempLocation);
        if (weeks.indexOf(computedWeek) == -1) weeks.push(computedWeek);
    });
    products.sort();
    locations.sort();
    weeks.sort();
    weeksForOneWord = [];
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
        weeksForOneWord.push({week: value, pos: 0, neg: 0})
    });

    $("#product").val($("#product option:first").val());
    $("#location").val($("#location option:last").val());
    $("#week").val($("#week option:first").val());
};

function filterData() {
    clearDisp(true);
    setTimeout(function () {
        words = [];
        $.each(allData, function(key, value) {
            var momentStamp = moment(value.timestamp); 
            var computedWeek = momentStamp.year() + '_' + momentStamp.isoWeek();
            if (
                computedWeek == week &&
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

function displayData(source, outer) {
    var sorter = sortBySum;
    if (sentiments == 1) sorter = sortByPos;
    if (sentiments == 2) sorter = sortByNeg;
    source.sort(sorter);
    if (outer == 'first') {
        mainWord = "";
        $('#' + outer).append('<span class="ihelp">Chat words and sentiments</span><br>')
    }
    if (outer == 'second') {
        $('#' + outer).append('<span class="ihelp">\"'+source[0].word+'\" and related adjectives, '+$("#week :selected").text()+'</span><br>')
    }
    if (outer != 'third') {
        biggestSum = 0;
    }

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
            var $tr = $('<div data-table="'+outer+'" data-word="'+value.word+'">')
                .on("click", function(){displayWord($(this).data("table"), $(this).data("word"))})
                .append(
                    $('<div class="label1">'+value.word+(sentiments == 0 ? ' &nbsp;<span class="sum">'+value.sum+'</span>' : '')+'</div>'),
                    $('<div><div style="width: '+getperc(biggestSum, value.pos)+'%"><span>'+value.pos+'</span></div><div style="width: '+getperc(biggestSum, value.neg)+'%"><span>'+value.neg+'</span></div></div>'))
                .appendTo('#' + outer);
        }
    });

    if (outer == 'third')
        $('#extrahr').removeClass('hidden');

    $('div.sent div div div').removeClass('hidden')
    if (sentiments == 1) {
        $('div.sent div div:nth-child(2) div:nth-child(2)').addClass('hidden')
    }
    if (sentiments == 2) {
        $('div.sent div div:nth-child(2) div:nth-child(1)').addClass('hidden')
    };

    if (!source.length) {
        clearDisp(false);
        $('div#nodata').removeClass('hidden');
    };

    $('div#loading').addClass('hidden');
};

function displayBubble(w1, w2) {
    $('div#fourth').removeClass('hidden');
    $('div#bubbles').empty();
    $('#bubbles').append('<span class="ihelp">\"'+w1+'\" and \"'+w2+'\"</span><br>');
    $.each(allData, function(key, value) {
            var momentStamp = moment(value.timestamp); 
            var computedWeek = momentStamp.year() + '_' + momentStamp.isoWeek();
            if (
                computedWeek == week &&
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
        var momentStamp = moment(value.timestamp); 
        var computedWeek = momentStamp.year() + '_' + momentStamp.isoWeek();
        if (
            week == computedWeek &&
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

    collectWord(word1[0].word);
};

function collectWord(w) {
    var oneWordInTime = weeksForOneWord.slice();
    $.each(oneWordInTime, function(key, value) {
        value.pos = 0;
        value.neg = 0;
    });
    var biggestVal = 0

    $.each(allData, function(key, value) {
        if (
            value.countrycode == locationC && 
            value.product == product
        ) {
            if (value.nouns) {
                $.each(value.nouns, function(key, value1) {
                    if (value1.word && (value1.word == w)) {
                        var momentStamp = moment(value.timestamp); 
                        var computedWeek = momentStamp.year() + '_' + momentStamp.isoWeek();
                        $.each(value1.adjectives, function(key, value2) {
                            var obj = oneWordInTime.find(obj => obj.week == computedWeek);
                            if (obj) {
                                if (parseFloat(value2.polarity) > 0) {
                                    obj.pos += parseInt(value2.count);
                                }
                                else {
                                    obj.neg += parseInt(value2.count);
                                }
                            }
                            if (obj.pos > biggestVal)
                                biggestVal = obj.pos;
                            if (obj.neg > biggestVal)
                                biggestVal = obj.neg;
                        });
                    }
                });
            }
        }
    });
    function drawChart(w, oneWordInTime) {
        $('div#fifth').empty();
        $('#fifth').append('<span class="ihelp">\"'+w+'\" week by week</span><br>')
        var $d1 = $('<div class="chart clearfix">');
        $.each(oneWordInTime, function(key, value) {
            var $week1 = $('<div class="col floleft">')
                .append(
                    $('<div class="weeklabel">w'+value.week.split('_')[1]+'</div>'),
                    $('<div class="pval" style="height: '+(value.pos / biggestVal * 100)+'%">&nbsp;<span class="val">'+value.pos+'</span></div>'),
                    $('<div class="nval" style="height: '+(value.neg / biggestVal * 100)+'%">&nbsp;<span class="val">'+value.neg+'</span></div>'))
                .appendTo($d1)
        });
        $d1.appendTo('#fifth');
        $('<hr>').appendTo('#fifth');
    };
    drawChart(w, oneWordInTime);
};

function queryObj() {
    search = location.search.replace(/\//g, '');
    return search.substring(1).split("&").reduce(function(result, value) {
      var parts = value.split('=');
      if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      return result;
    }, {})
};

function toggleNav(e) {
    e.stopPropagation();
    $('body').toggleClass('navclosed');
};

function detectMob() {
    if (window.innerWidth <= 800)
        return true;

    return false;
};

var json = queryObj().data || "messages";

var isMobile = detectMob();