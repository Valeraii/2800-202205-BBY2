var arrayTest2 = [];
var findBonus = [];
var boardArray = [];
var usersWord = [];
var bonusArr = ["tripleLetter", "doubleLetter"];
var blankTile = {letter: "?", score: 1, count: 1};
var bonusIndex = 0;
var bonus = "";
var bonusLetter = "";
var totalScore = 0;

function getHighScore() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let data = JSON.parse(this.responseText);
              if(data.status == "success") {
                let check = 0;
                let str = 0;
                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];
                    check = row.scoreValue;
                    if(check > str){
                        str = check;
                    }
                }
                document.getElementById("highScore").innerHTML = str;
              }
            }
        }
    };
    xhr.open("GET", "/getHighScore");
    xhr.send();
}
getHighScore();

function getDaysPlayed() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              let data = JSON.parse(this.responseText);
              if(data.status == "success") {
                let count = data.rows.length + 1;
                document.getElementById("daysPlayed").innerHTML = count;
              }
            }
        }
    };
    xhr.open("GET", "/getDaysPlayed");
    xhr.send();
}
getDaysPlayed();

function show() {
    if(document.getElementById("easter-bttn").style.visibility = "hidden") {
        document.getElementById("easter-bttn").style.visibility = "visible";
    } 
}

function showMsg() {
    if(document.getElementById("hidden_msg").style.display = "none") {
        document.getElementById("hidden_msg").style.display = "block";
    } 
}

function copyToClipboard(element) {
    var text = $(element).clone().find('br').prepend('\r\n').end().text();
    element = $('<textarea>').appendTo('body').val(text).select();
    document.execCommand('copy');
    element.remove();
  }


  function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index + chunk_size);
        tempArray.push(myChunk);
    }

    return tempArray;
}

function getAllIndexes(arr, val) {
    let indexes = [],
        i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            indexes.push(i);
        }
    }
    return indexes;
}

async function wordsValidation (wordInput) {
    let booleanCheck;
    try {
        const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + wordInput);
        const json = await response.json();
        if (json.title == "No Definitions Found") {
        
            booleanCheck = false;
        } else {
            booleanCheck = true;
        }
        return booleanCheck;
    } catch (err) {
        return console.log(err);
    }
}

$(function () {
    var player = {};
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
        };
    };

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
        ];
    };

    var createTileBag = function () {
        while (tileBag.length > 0) {
            tempBag.push(tileBag[0]);
            tileBag[0].count--;
            if (tileBag[0].count === 0) {
                tileBag.shift();
            }
        }
    };

    var shuffleBag = function () {
        while (tempBag.length > 0) {
            var rndm = Math.floor(tempBag.length * Math.random());
            shuffledBag.push(tempBag[rndm]);
            tempBag.splice(rndm, 1);
        }
    };

    var loadRack = function (player) {
        player.rack.push(blankTile);
        for (i = player.rack.length; i < 15; i++) {
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
    };

    var returnToRack = function () {
        let lastBonus = localStorage.getItem('dailyBonus');
        $('.playerOneTile').css("display", "inline-block");
        $('.tempInPlay').text("");
        $('.permInPlay').text("");
        $('.bonusTile').text("");
        if(lastBonus === "doubleWord") {
            $('.bonus').text("DW");
        }
        if(lastBonus === "tripleLetter") {
            $('.bonus').text("TL");
        }
        if(lastBonus === "doubleLetter") {
            $('.bonus').text("DL");
        }
        if(lastBonus === "tripleWord") {
            $('.bonus').text("TW");
        }

        $('.tempInPlay').removeClass('tempInPlay');
        $('.permInPlay').removeClass('permInPlay');
        $('.bonusTile').removeClass('bonusTile');
    };

    var startGame = function () {
        $('.showTiles').show();
        if (shuffledBag.length > 0) {
            loadRack(player);
        }
        $('.start').hide();
        $('.backToRack').show();
        $('.submitWord').show();
    };

    $(document.body).on('click', '.tileBox', function () {
        $('.tileBox').removeClass('selected');
        $(this).addClass('selected');
        selected = true;
    });

    $(document.body).on('click', '.tile', function () {
        if (selected) {
            if (!($(this).hasClass('permInPlay')) && (!$(this).hasClass('tempInPlay'))) {
                $(this).text($('.selected').text());
                $(this).addClass('tempInPlay');
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
            });
        }
    });

    var letterValue = function (input) {
        var selectedLetter = input;
        createBag();
        var selectedTile = tileBag.find(function (tile1) {
            return tile1.letter === selectedLetter;
        });
        if(bonus === "doubleLetter" && selectedLetter === bonusLetter) {
            return selectedTile.score * 2;
        }
        if(bonus === "tripleLetter" && selectedLetter === bonusLetter) {
            return selectedTile.score * 3;
        }  
        return selectedTile.score;   
    };

    var playerScore = function(arr) {
        bonusLetter = arrayTest2[bonusIndex - 1].toUpperCase();
        for (let i = 0; i < arr.length; i++) {
            let j = 0;
            while(j < arr[i].length) {
                let letterChar = arr[i].charAt(j).toUpperCase();
                let charScore = letterValue(letterChar);
                totalScore += charScore;
                j++;    
            }
        }
        document.getElementById('scoreCount').innerHTML = "Score " + totalScore;
        document.getElementById('word-score').innerHTML = totalScore;
        document.getElementById('stat-score').innerHTML = totalScore;
    };

    var bonusTile = function() {
        $('.tile').each(function (index) {
            boardArray.push($(this));
        });
        randomTile(boardArray).addClass('bonus');
        bonus = randomTile(bonusArr);
        
        //localStorage.setItem('dailyBonus', bonus);
        if(bonus === "doubleWord") {
            $('.bonus').text("DW");
        }
        if(bonus === "tripleLetter") {
            $('.bonus').text("TL");
        }
        if(bonus === "doubleLetter") {
            $('.bonus').text("DL");
        }
        if(bonus === "tripleWord") {
            $('.bonus').text("TW");
        }

        $('.tile').each(function (index) {
            if($(this).hasClass('bonus')) {
                findBonus.push($(this).text());
                bonusIndex = findBonus.length;
            } else {
                findBonus.push($(this).text());
            }
        });
    };

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
    
    async function submitWord() {
        $('.tile').each(function (index) {
            if($(this).text().length > 1) {
                arrayTest2.push("");
            } else {
                arrayTest2.push($(this).text());
            }
        });   
        var invalidWord = [];
        let blackList = [];
        var verticleArray = [];
        let horizontalArray = [];
        let word = "";
        let currentTileV = 0;
        var chunkThisArray = chunkArray(arrayTest2, 5);

        // Get Verticle Words

        for (let i = 0; i < arrayTest2.length; i++) {
            let isThereString = arrayTest2[i];
            currentTileV = i;
            if ((isThereString !== "" && arrayTest2[i + 5] !== "") && (!blackList.includes(i))) {
                while (currentTileV < 25) {
                    word += arrayTest2[currentTileV];
                    currentTileV += 5;
                    if (arrayTest2[currentTileV] !== "" && blackList.indexOf(currentTileV) === -1 && currentTileV < 25) {
                        blackList.push(currentTileV);
                    }
                }
                if (word.length > 2) {
                    verticleArray.push(word);
                }
                word = "";
            }
        }
        // Get Horizontal Words
        for (let rows = 0; rows < chunkThisArray.length; rows++) {
            let allSpaces = getAllIndexes(chunkThisArray[rows], "");
            let middleSpaces = chunkThisArray[rows].indexOf("");
            let wordTemp = [];
            if (middleSpaces == 2 || (allSpaces.includes(1) && allSpaces.includes(3)) || (allSpaces.length > 2)) {
                chunkThisArray[rows] = [];
            } else if (middleSpaces !== 2) {
                wordTemp = chunkThisArray[rows].splice(0, middleSpaces);
                if (wordTemp.length > 2) {
                    for (let z = 0; z < wordTemp.length; z++) {
                        word += wordTemp[z];
                    }
                    horizontalArray.push(word);
                    word = "";
                    wordTemp = [];
                }
                if (chunkThisArray[rows].length > 2) {
                    for (let z = 0; z < chunkThisArray[rows].length; z++) {
                        word += chunkThisArray[rows][z];
                    }
                    horizontalArray.push(word);
                    word = "";
                }
            }
        }
        
        let tempCombWords = verticleArray.concat(horizontalArray);

        // Loop for combined array to test for words and transfer to a new array
        for (let index = 0; index < tempCombWords.length; index++) {
            let testForTrue = await (wordsValidation(tempCombWords[index].toLowerCase()));
            if (testForTrue) {
                usersWord.push(tempCombWords[index]);
                $(".stats-overlay, .popup-content").addClass("active");
            } else {
                invalidWord.push(tempCombWords[index]);
                $(".error-overlay, .error-popup-content").addClass("active");
                returnToRack();
            }
        }
        playerScore(usersWord);

        
        // Add text to stats page for invalid words
        let errorContent = document.getElementById("incorrect-word");
        errorContent.innerHTML = "";
        if(invalidWord.length > 0) {
            let index = 0;
            while (index < invalidWord.length) {
                let number = index + 1;
                errorContent.innerHTML += " [" + number + "] " + invalidWord[index] + " is not a word! <br>";
                index++;
            }
        }

        $('.tempInPlay').addClass('permInPlay');
        $('.tempInPlay').removeClass('tempInPlay');
        arrayTest2 = [];
        usersWord = [];

        addScore();
    }

    function addScore() {
        let thisID = {userID: document.getElementById("userID").innerHTML};
            const xhr = new XMLHttpRequest();
                xhr.open("POST", "/add-score");
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send("userID=" + thisID.userID + "&scoreValue=" + totalScore);
    }

    $('.backToRack').click(returnToRack);
    $('.start').click(startGame);

    $(".submitWord").on("click", function() {
        submitWord();
    });

    $(".game-stats").on("click", function() {
        $(".stats-overlay, .popup-content").addClass("active");
    });

    $(".close-stats").on("click", function() {
        $(".stats-overlay, .popup-content").removeClass("active");
    });

    $(".close, .error-overlay").on("click", function() {
        $(".error-overlay, .error-popup-content").removeClass("active");
    });

    $(".close-stats").on("click", function() {
        $(".stats-overlay, .popup-content").removeClass("active");
    });

    $('.playAgain').on("click", function() {
        returnToRack();
        totalScore = 0;
        $(".stats-overlay, .popup-content").removeClass("active");
        location.reload();
    });


    startingProcedure();
    
});
