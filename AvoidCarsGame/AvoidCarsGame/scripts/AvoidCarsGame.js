window.onload = function () {
    var frag;
    var startBtn;
    var controlsBtn;
    var quitBtn;
    var controls;
    var divButtons;
    var playerPoints;
    var isBtnsDraw = false;
    var isGameOver = false;

    function StartMenu() {

        if (isBtnsDraw === false) {
            frag = document.createDocumentFragment();
            startBtn = document.createElement('button');
            controlsBtn = document.createElement('button');
            quitBtn = document.createElement('button');
            startBtn.innerText = 'Start Game';
            controlsBtn.innerText = 'Controls';
            quitBtn.innerText = 'Quit Game';

            frag.appendChild(startBtn);
            frag.appendChild(controlsBtn);
            frag.appendChild(quitBtn);

            divButtons = document.getElementById('btn-container');
            divButtons.appendChild(frag);
            isBtnsDraw = true;

            startBtn.addEventListener('click', function () {
                startBtn.style.visibility = 'hidden';
                controlsBtn.style.visibility = 'hidden';
                isGameOver = false;
                Game();
            });

            var controlsWords = document.getElementById('controls-explained');
            controlsWords.style.visibility = 'hidden';
            controlsBtn.addEventListener('click', function () {
                if (controlsWords.style.visibility === 'hidden') {
                    controlsWords.style.visibility = 'visible';
                }
                else if (controlsWords.style.visibility === 'visible') {
                    controlsWords.style.visibility = 'hidden';
                }
            });


            quitBtn.addEventListener('click', function () {
                isGameOver = true;
                alert("Player Points:" + playerPoints);
                StartMenu();
            })
        }
        else {
            startBtn.style.visibility = 'visible';
            controlsBtn.style.visibility = 'visible';

        }

        
    }

    StartMenu();

    function Game() {
        var canvas = document.getElementById("field");
        var ctx = canvas.getContext("2d");

        var pointsDiv = document.getElementById("points");
        playerPoints = 0;
        var myCarImage = new Image();
        myCarImage.src = 'images/car.png';
        var obstacleCarImage = new Image();
        obstacleCarImage.src = 'images/obstacleCar.png';

        var directions = {
            "left": -175,
            "right": 175,
            "center": 0
        };

        var minCanvasHeight = 0;
        var maxSpeed = 20;
        var fieldMinPositionX = 350;
        var fieldMaxPositionX = 850;
        var centerPosition = ((fieldMaxPositionX + fieldMinPositionX) / 2) - 35;
        var fieldPositionY = canvas.height;
        var mainCarDirection = "center";
        


        var myCar = new MainCar(centerPosition, canvas.height - 140, myCarImage, mainCarDirection);
        var obstacleCar = new ObstacleCar(centerPosition, minCanvasHeight - 128, obstacleCarImage, "center");

        var obstacleCars = [];
        obstacleCars.push(obstacleCar);

        requestAnimationFrame(drawingObjects);
        var updateObstacleCarY = 0.5;
        //var cyclesCount = 0;

        function drawingObjects() {
            //cyclesCount++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawObstacleCars(updateObstacleCarY);

            myCar.draw(mainCarDirection);

            checkForCollision();

            checkIfAddingANewObstacleCarIsNeeded();

            deleteOuterObstacleCars();

            if (!(updateObstacleCarY >= maxSpeed)) {
                updateObstacleCarY += 0.005;
            }

            endGame();
        }

        function endGame() {
            if (!isGameOver) {
                pointsDiv.innerText = "Points: " + playerPoints;
            } else {
                pointsDiv.innerText = ' ';
            }

            if (!isGameOver) {
                requestAnimationFrame(drawingObjects);
            }
        }

        function ObstacleCar(x, y, image, line) {
            this.x = x;
            this.y = y;
            this.image = image;
            this.line = line;

            this.draw = function (update) {
                this.y += update;
                ctx.drawImage(this.image, this.x, this.y);
                this.backBumperY = this.y + 128;
                this.frontBumperY = this.y;
            }
        }

        function MainCar(x, y, image) {
            this.x = x;
            this.y = y;
            this.image = image;
            this.frontBumperY = this.y;
            this.backBumperY = this.y + 128;
            this.frontLeftBumperX = 570;
            this.frontRightBumperX = 620;

            this.draw = function (direction) {
                var newPosition = this.x + directions[direction];

                if (!(newPosition > fieldMaxPositionX) && !(newPosition < fieldMinPositionX)) {
                    ctx.drawImage(this.image, newPosition, this.y);
                    this.line = mainCarDirection;
                }
            }
        }

        function drawObstacleCars(updateObstacleCarY) {
            for (var i = 0, len = obstacleCars.length; i < len; i++) {
                obstacleCars[i].draw(updateObstacleCarY);
            }
        }

        function deleteOuterObstacleCars() {
            for (var i = 0; i < obstacleCars.length; i++) {
                if (obstacleCars[i].y > canvas.height) {
                    playerPoints += 5;
                    obstacleCars.splice(i, 1);
                }
            }
        }

        function checkIfAddingANewObstacleCarIsNeeded() {
            var isNeeded = true;

            for (var i = 0, len = obstacleCars.length; i < len; i++) {
                if (obstacleCars[i].y < (canvas.height / 2)) {
                    isNeeded = false;
                }
            }

            if (isNeeded) {
                var generatedRandomValue = generateRandomNumberFrom0To2();
                var direction;

                if (generatedRandomValue === 0) {
                    direction = "left";
                }
                else if (generatedRandomValue === 1) {
                    direction = "right";
                }
                else {
                    direction = "center";
                }

                obstacleCars.push(new ObstacleCar(centerPosition + directions[direction],
                    minCanvasHeight - 128,
                    obstacleCarImage,
                    direction));
            }
        }

        function checkForCollision() {
            for (var i = 0, len = obstacleCars.length; i < len; i++) {
                if ((obstacleCars[i].backBumperY > myCar.frontBumperY) && (obstacleCars[i].frontBumperY + 10 < myCar.backBumperY)) {
                    if (obstacleCars[i].line == myCar.line) {
                        isGameOver = true;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        alert("Game Over! Points: " + playerPoints);
                        printResults();
                    }
                }
            }
        }

        function printResults() {
            StartMenu();
        }

        document.onkeydown = checkKey;

        function checkKey(e) {
            e = e || window.event;

            if (e.keyCode == '40') {
                //brake
                if (updateObstacleCarY > 1) {
                    updateObstacleCarY -= 0.5;
                }

                if (playerPoints >= 15) {
                    playerPoints -= 15;
                }
            }
            else if (e.keyCode == '39') {
                if (mainCarDirection == "center") {
                    mainCarDirection = 'right';
                }
                if (mainCarDirection == "left") {
                    mainCarDirection = 'center';
                }
            }
            else if (e.keyCode == '37') {
                if (mainCarDirection == "center") {
                    mainCarDirection = 'left';
                }
                if (mainCarDirection == "right") {
                    mainCarDirection = 'center';
                }
            }
        }

        function generateRandomNumberFrom0To2() {
            return (Math.random()) * 3 | 0;
        }
    }
};