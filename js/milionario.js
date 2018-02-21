


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function getRandomQuestionForLevel(level) {
    return domande[level][Math.floor(Math.random() * domande[level].length)];
}

function start(level) {
    $('#livello').text("Livello " + (level + 1));
    $('.answer').removeClass('btn-warning');
    $('.answer').removeClass('btn-success');
    $('.answer').prop("disabled", false);
    $('.answer').addClass('btn-primary');

    $('.answerindexOfCorrectAnswer').addClass('btn-primary');
    $('.answer').off();
    $('#continua').hide();
    $('#next-level').hide();
    $('#next-game').hide();

    var thisQuestion = getRandomQuestionForLevel(level);
    //var correctAnswer = thisQuestion.risposte[0];
    shuffle(thisQuestion.risposte);
    $('#domanda').text(thisQuestion.domanda);
    $('.answer').each(function(index) {
        $(this).text(thisQuestion.risposte[index]);
    });

    $('.answer').on('click', function(event) {
        if ($(this).hasClass('btn-warning')) {
            $('.answer').removeClass('btn-warning');
            $('.answer').prop("disabled", true);
            if ($(this).text() === "" + thisQuestion.corretta) { //controllo se la risposta è correta o meno
                $(this).addClass('btn-success');
                $('#continua').show();
                $("#next-level").show();
                $("#next-game").hide();

            } else {
                $(this).addClass('btn-danger');
                $('.answer').each(function(index) {
                    if ($(this).text() === "" + thisQuestion.corretta) {
                        $(this).addClass('btn-success');
                    }
                });
                $('#next-level').hide();
                $('#next-game').show();
                $('#continua').show();

            }
            $('#soluzione').attr("href", thisQuestion.soluzione);

        } else {
            $('.answer').removeClass('btn-warning');
            $(this).addClass('btn-warning');
        }
        setTimeout(function() {
            $(self).prop("disabled", true);
        }, 10);
    });
    /////////////////////////modifiche
    $('#cinquanta').on('click', function(event) {
        $(this).prop("disabled", true);
        $(this).removeClass('btn-info');


        var buttonsToDisplay = [];
        var indexOfCorrectAnswer = thisQuestion.risposte.indexOf(thisQuestion.corretta);
        var tmpArray = thisQuestion.risposte.filter(function(number) {
            return number !== thisQuestion.corretta;
        });
        shuffle(tmpArray);
        buttonsToDisplay.push(thisQuestion.risposte.indexOf(tmpArray[0]));
        buttonsToDisplay.push(indexOfCorrectAnswer);
        $('.answer').each(function(index) {
            $(this).prop("disabled", false);
            $(this).addClass('btn-primary');
            if (!buttonsToDisplay.includes(index)) {
                $(this).removeClass('btn-primary');
                $(this).removeClass('btn-warning');
                $(this).prop("disabled", true);
            }
        });
    });


    $('#casa').on('click', function(event) {
        $(this).removeClass('btn-info');
        var self = this;
        setTimeout(function() {
            $(self).prop("disabled", true);
        }, 100);
        setTimeout(function() {
            $('#chiamata').text("Sto pensando...");
            setTimeout(function() {
                var indexOfCorrectAnswer = thisQuestion.risposte.indexOf(thisQuestion.corretta);
                var risp = ['A', 'B', 'C', 'D'];
                risposta = getRandomInt(0, 10);
                if (level / 2-1 < risposta) {
                    $('#chiamata').text("Penso che sia la " + risp[indexOfCorrectAnswer]);
                } else {
                    $('#chiamata').text("Penso che sia la " + risp[getRandomInt(0, 3)]);
                }
            }, 2000);
        }, 3000);


    });


    $('#pubblico').on('click', function(event) {
        $(this).removeClass('btn-info');
        var self = this;
        setTimeout(function() {
            $(self).prop("disabled", true);
        }, 100);
        var indexOfCorrectAnswer = thisQuestion.risposte.indexOf(thisQuestion.corretta);
        var random = [getRandomInt(0, 100), getRandomInt(0, 100), getRandomInt(0, 100), getRandomInt(0, 100)];
        random[indexOfCorrectAnswer] = getRandomInt(100 - (level / 2 ) * 10, 100);
        for (i = 0; i < 4; i++) {
            if (i != indexOfCorrectAnswer) {
                random[i] = getRandomInt(0, (level + 1) * 10);
            }
        }
        var sumOfNumbers = random[0] + random[1] + random[2] + random[3];
        random[0] = 100 / sumOfNumbers * random[0];
        random[1] = 100 / sumOfNumbers * random[1];
        random[2] = 100 / sumOfNumbers * random[2];
        random[3] = 100 / sumOfNumbers * random[3];
        console.log(random);
        $('#modalPubblico .progress-bar').each(function(item) {
            $(this).css('height', random[item] + '%');
        });
        $('#modalPubblico .percentage-number').each(function(item) {
            if (random[item] > 20) {
                $(this).text(Math.floor(random[item]) + '%');
            }
        });
    });
    //////////fine
    $('#next-level').on('click', function() {
        if (level + 1 == 10) {
            window.location.href = "./vittoria.html";
        } else {
            start(level + 1);
        }
    });

    $('#soluzione').on('click', function(){
      $('#testo-soluzione').text(thisQuestion.soluzione);
    });
}


var domande;

var url = new URL(window.location.href);
var modalitaScelta = url.searchParams.get("modalita");


 $.getJSON('js/'+modalitaScelta+'.json', "",function(data, status){
   console.log(data);
  domande =data;
  start(0);
}); //domade
