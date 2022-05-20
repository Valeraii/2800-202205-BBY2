var arrayTest = [];
var boardArray =[];
var bonusArr = ["tripleLetter", "doubleLetter", "tripleWord", "doubleWord"]
var blankTile = {letter: "?", score: 1, count: 1};

$(function () {
    var player = {}
    var shuffledBag = [];
    var selected = false;

    var resetGame = function () {
        shuffledBag = [];
        tempBag = [];
        selected = false;
        tabCounter = 0;
        firstTurn = true;
        sameColumn = true;
        sameRow = true;

        player = {
            name: "",
            score: 0,
            rack: []
        }
    }

    var createBag = function() {
        tileBag = [
            { letter: "E", score: 1, count: 12 },
            { letter: "A", score: 1, count: 12 },
            { letter: "I", score: 1, count: 12 },
            { letter: "O", score: 1, count: 12 },
            { letter: "N", score: 1, count: 6 },
            { letter: "R", score: 1, count: 6 },
            { letter: "T", score: 1, count: 6 },
            { letter: "L", score: 1, count: 4 },
            { letter: "S", score: 1, count: 4 },
            { letter: "U", score: 1, count: 9 },
            { letter: "D", score: 2, count: 4 },
            { letter: "G", score: 2, count: 3 },
            { letter: "B", score: 3, count: 2 },
            { letter: "C", score: 3, count: 2 },
            { letter: "M", score: 3, count: 2 },
            { letter: "P", score: 3, count: 2 },
            { letter: "F", score: 4, count: 2 },
            { letter: "H", score: 4, count: 2 },
            { letter: "V", score: 4, count: 2 },
            { letter: "W", score: 4, count: 2 },
            { letter: "Y", score: 4, count: 2 },
            { letter: "K", score: 5, count: 1 },
            { letter: "J", score: 8, count: 1 },
            { letter: "X", score: 8, count: 1 },
            { letter: "Q", score: 10, count: 1 },
            { letter: "Z", score: 10, count: 1 }
        ]
    }

    var createTileBag = function () {
        while (tileBag.length > 0) {
            tempBag.push(tileBag[0]);
            tileBag[0].count--;
            if (tileBag[0].count === 0) {
                tileBag.shift();
            }
        }
    }

    var shuffleBag = function () {
        while (tempBag.length > 0) {
            var rndm = Math.floor(tempBag.length * Math.random());
            shuffledBag.push(tempBag[rndm]);
            tempBag.splice(rndm, 1);
        }
    }

    var loadRack = function (player) {
        player.rack.push(blankTile);
        for (i = player.rack.length; i < 7; i++) {
            if (shuffledBag.length > 0) {
                player.rack.push(shuffledBag[0]);
                shuffledBag.shift();
                var newTileBox = $('<div class="playerOneTile tileBox"></div>');
                $('.playerOneTilesRow').append(newTileBox);
            }
        }
        for (j = 0; j < $('.playerOneTile').length; j++) {
            $('.playerOneTile').eq(j).text(player.rack[j].letter);
        }
    }

    var returnToRack = function () {
        let lastBonus = localStorage.getItem('dailyBonus');
        $('.playerOneTile').css("display", "inline-block");
        $('.tempInPlay').text("");
        $('.permInPlay').text("");
        $('.bonusTile').text("");
        if(lastBonus === "doubleWord") {
            $('.bonus').text("Double Word Score");
        }
        if(lastBonus === "tripleLetter") {
            $('.bonus').text("Triple Letter Score");
        }
        if(lastBonus === "doubleLetter") {
            $('.bonus').text("Double Letter Score");
        }
        if(lastBonus === "tripleWord") {
            $('.bonus').text("Triple Word Score");
        }

        $('.tempInPlay').removeClass('tempInPlay');
        $('.permInPlay').removeClass('permInPlay');
        $('.bonusTile').removeClass('bonusTile');
    }

    var startGame = function () {
        $('.showTiles').show();
        if (shuffledBag.length > 0) {
            loadRack(player);
        }
        $('.start').hide();
        $('.backToRack').show();
        $('.submitWord').show();
    }

    $(document.body).on('click', '.tileBox', function () {
        $('.tileBox').removeClass('selected');
        $(this).addClass('selected');
        selected = true;
    });

    $(document.body).on('click', '.tile', function () {
        if (selected) {
            if (!($(this).hasClass('permInPlay')) && (!$(this).hasClass('tempInPlay'))) {
                $(this).text($('.selected').text());
                $(this).addClass('tempInPlay')
                $('.selected').hide();
                $('.selected').removeClass('selected');
                selected = false;
            }
        }
        if($(this).text() === "?"){
            $(this).addClass('bonusTile');
            window.addEventListener('keydown', function(event) {
                let blank = event.key;
                $('.bonusTile').text(blank);
            })
        }
    });

    var letterValue = function (input) {
        var selectedLetter = input;
        createBag();
        var selectedTile = tileBag.find(function (tile1) {
            return tile1.letter === selectedLetter;
        });
        return selectedTile.score;
    }

    var playerScore = function (array) {
        var totalScore = 0;
        for (let i = 0; i < array.length; i++) {
            let letterChar = arrayTest[i];
            let charScore = letterValue(letterChar);
            totalScore += charScore;
        }
        return totalScore;
    }

    var bonusTile = function() {
        $('.tile').each(function (index) {
            boardArray.push($(this));
        })
        randomTile(boardArray).addClass('bonus');
        var bonus = randomTile(bonusArr);
        localStorage.setItem('dailyBonus', bonus);
        if(bonus === "doubleWord") {
            $('.bonus').text("Double Word Score");
        }
        if(bonus === "tripleLetter") {
            $('.bonus').text("Triple Letter Score");
        }
        if(bonus === "doubleLetter") {
            $('.bonus').text("Double Letter Score");
        }
        if(bonus === "tripleWord") {
            $('.bonus').text("Triple Word Score");
        }
    }

    function randomTile(items) {
        return items[Math.floor(Math.random()*items.length)];
    }
    
    function startingProcedure() {
        $('.container').show();
        resetGame();
        createBag();
        createTileBag();
        shuffleBag();
        bonusTile();
    }
    
    let submitWord = function () {
        $('.tempInPlay').each(function (index) {
            arrayTest.push($(this).text());
        })
        const string = arrayTest.join("");
        fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + string)
            .then(response => response.json())
            .then(json => {
                if (json.title == 'No Definitions Found') {
                    window.confirm("That is not a word!");
                    returnToRack();
                    $('.permInPlay').removeClass('permInPlay');
                    arrayTest = [];
                } else (
                    document.getElementById('word-score').innerHTML = playerScore(arrayTest)
                )
            });
        $('.tempInPlay').addClass('permInPlay');
        $('.tempInPlay').removeClass('tempInPlay');
    }

    $('.backToRack').click(returnToRack);
    $('.start').click(startGame);
    $('.submitWord').click(submitWord);
    startingProcedure();
    
});







