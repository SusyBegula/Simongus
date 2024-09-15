var gamePattern = [];
var userPattern = [];
var level = 0;
var maxLevels = 5;
var boxes = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Preload Audio Files
var panelSound = new Audio('./sounds/Panel.mp3');
var failSound = new Audio('./sounds/PanelFail.mp3');
var clickSound = new Audio('./sounds/click.wav'); // Add click sound

// Function to light up a specific box
function lightUpBox(boxNumber) {
    var light = $(".box" + boxNumber).addClass("lit_box");
    panelSound.play(); // Play sound immediately
    setTimeout(function() {
        light.removeClass("lit_box");
    }, 500);
}

// Function to light up the entire game pattern
function lightUpPattern(pattern) {
    let i = 0;
    let interval = setInterval(function() {
        lightUpBox(pattern[i]);
        i++;
        if (i >= pattern.length) {
            clearInterval(interval);
        }
    }, 700); // Add some delay between lighting up each box
}

// Function to generate a new box that is not the same as the previous one
function generateNewBox(previousBox) {
    let newBox;
    do {
        newBox = Math.floor(Math.random() * 9) + 1;
    } while (newBox === previousBox);
    return newBox;
}

// Function to start the next level
function nextLevel() {
    if (level < maxLevels) {
        var newBox = generateNewBox(gamePattern[gamePattern.length - 1]);
        gamePattern.push(newBox);
        level++;
        console.log("Level " + level);
        lightUpPattern(gamePattern);
    } else {
        $("#overlay").css("display", "flex");
        console.log("You won the game!");
        document.getElementById('overlay').addEventListener('click', function() {
            this.style.display = 'none';
            resetGame();
        });
    }
}

// Function to handle user input
function userInput() {
    $(".input_box").off("click").on("click", function() {
        clickSound.play(); // Play click sound immediately
        
        var userInp = $(this).attr('class').match(/box(\d+)/)[1];
        userPattern.push(parseInt(userInp));
        
        if (!comparePatterns(gamePattern.slice(0, userPattern.length), userPattern)) {
            failSound.play(); // Play fail sound immediately
            $("img." + level).attr("src", "./images/failbtn.png"); // Change image for wrong guess
            console.log("Wrong pattern! Restarting...");
            setTimeout(function() {
                for (var i = 1; i <= 5; i++) {
                    $("img." + i).attr("src", "./images/unbtn.png");
                }
            }, 1000);
            resetGame(); // Restart the game if user fails
            return;
        }
        
        if (userPattern.length === gamePattern.length) {
            console.log("Correct pattern! Moving to the next level.");
            $("img." + level).attr("src", "./images/btn.png"); // Change image for correct guess
            userPattern = [];
            setTimeout(nextLevel, 1000); // Proceed to the next level after a short delay
        }
    });
}

// Function to compare two patterns (partial check for user pattern)
function comparePatterns(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// Function to reset the game
function resetGame() {
    gamePattern = [];
    userPattern = [];
    level = 0;
    setTimeout(nextLevel, 1000); // Restart the game after a short delay
}

document.getElementById('overlay').addEventListener('click', function() {
    this.style.display = 'none';
    resetGame();
    userInput();
});
