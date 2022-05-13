$(function () {
    var player = {}
    var shuffledBag = [];
    var selected = false;

    var resetGame = function () {
        //global variables
        shuffledBag = [];
        tempBag = [];
        selected = false;
        tabCounter = 0;
        firstTurn = true;
        sameColumn = true;
        sameRow = true;

        //player objects
        player = {
            name: "",
            score: 0,
            rack: []
        }
    }

    var createBag = function () {
        tileBag = [{
                letter: "E",
                score: 1,
                count: 12
            },
            {
                letter: "A",
                score: 1,
                count: 9
            },
            {
                letter: "I",
                score: 1,
                count: 9
            },
            {
                letter: "O",
                score: 1,
                count: 8
            },
            {
                letter: "N",
                score: 1,
                count: 6
            },
            {
                letter: "R",
                score: 1,
                count: 6
            },
            {
                letter: "T",
                score: 1,
                count: 6
            },
            {
                letter: "L",
                score: 1,
                count: 4
            },
            {
                letter: "S",
                score: 1,
                count: 4
            },
            {
                letter: "U",
                score: 1,
                count: 4
            },
            {
                letter: "D",
                score: 2,
                count: 4
            },
            {
                letter: "G",
                score: 2,
                count: 3
            },
            {
                letter: "B",
                score: 3,
                count: 2
            },
            {
                letter: "C",
                score: 3,
                count: 2
            },
            {
                letter: "M",
                score: 3,
                count: 2
            },
            {
                letter: "P",
                score: 3,
                count: 2
            },
            {
                letter: "F",
                score: 4,
                count: 2
            },
            {
                letter: "H",
                score: 4,
                count: 2
            },
            {
                letter: "V",
                score: 4,
                count: 2
            },
            {
                letter: "W",
                score: 4,
                count: 2
            },
            {
                letter: "Y",
                score: 4,
                count: 2
            },
            {
                letter: "K",
                score: 5,
                count: 1
            },
            {
                letter: "J",
                score: 8,
                count: 1
            },
            {
                letter: "X",
                score: 8,
                count: 1
            },
            {
                letter: "Q",
                score: 10,
                count: 1
            },
            {
                letter: "Z",
                score: 10,
                count: 1
            }
        ]
    }

    //creates a temporary bag giving each tile its own array item
    var createTileBag = function () {
        while (tileBag.length > 0) {
            tempBag.push(tileBag[0]);
            tileBag[0].count--;
            if (tileBag[0].count === 0) {
                tileBag.shift();
            }
        }
    }

    //shuffles the bag
    var shuffleBag = function () {
        while (tempBag.length > 0) {
            var rndm = Math.floor(tempBag.length * Math.random());
            shuffledBag.push(tempBag[rndm]);
            tempBag.splice(rndm, 1);
        }
    }


    //given a player, will fill their rack with up to 7 tiles
    var loadRack = function (player) {
        //adds tiles to the player's rack array until it's either at 7 or until the bag is empty
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



    var turn = function () {
        $('.showTiles').show();
        console.log(shuffledBag.length);
        if (shuffledBag.length > 0) {
            loadRack(player);
        }
    }

    //takes all tiles placed on the board from the current turn and returns them to that player's rack
    var returnToRack = function () {
        $('.playerOneTile').css("display", "inline-block");
        $('.tempInPlay').text("");
        $('.permInPlay').text("");
        $('.tempInPlay').removeClass('tempInPlay');
    }

    //Initializes the board screen
    var startGame = function () {
        turn();
        $('.start').hide();
        $('.backToRack').show();
        $('.submitWord').show();
    }

    //resets everything visually once the 'play again' button is clicked
    var startingProcedure = function () {
        $('.container').show();
        $('.letterValuesBox').show();
        $('.instructions').fadeIn();
        createTileBag();
        shuffleBag();
    }

    //visually marks a tile as 'selected' when clicked
    $(document.body).on('click', '.tileBox', function () {
        $('.tileBox').removeClass('selected');
        $(this).addClass('selected');
        selected = true;
    });

    //adds a tile to the board if nothing occupies that space already
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
    });

    //takes all tiles in the player's rack and returns them to the bag
    var refreshTiles = function () {
        returnToRack();
        player.rack.forEach(function (tile) {
            shuffledBag.splice(Math.floor(Math.random() * shuffledBag.length), 0, tile);
        });
        while (player.rack.length > 0) {
            player.rack.pop();
        }
        $('.playerOneTile').remove();
        turn();
    }


    let submitWord = function () {

    $('.tempInPlay').each(function (index) {
        arrayTest.push($(this).text());
    })

    // console.log(arrayTest);

    const string = arrayTest.join("");
    console.log(string);



    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + string)
        .then(response => response.json())
        .then(json => {
            if (json.title == 'No Definitions Found') {

                window.confirm("That is not a word!");
                refreshTiles();

            } else(
                console.log(json)
            )
        });



    $('.tempInPlay').addClass('permInPlay');
    $('.tempInPlay').removeClass('tempInPlay');

}

$('.backToRack').click(returnToRack);
resetGame(); 
createBag();
startingProcedure();
$('.start').click(startGame);
$('.submitWord').click(submitWord);

});

var arrayTest = [];


// let test = document.getElementsByClassName("permInPlay");
// console.log(test);

// let idk = $(('.tile').eq(0).attr('data-row') && $('.tile').eq(0).attr('data-column'))

// console.log(idk);