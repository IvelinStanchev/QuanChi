window.onload = function () {

    function StartMenu(){

        var frag = document.createDocumentFragment();
        var startBtn = document.createElement('button');
        var controlsBtn = document.createElement('button');
        var quitBtn = document.createElement('button');
        var controls;
        
        startBtn.innerText = 'Start Game';
        controlsBtn.innerText = 'Controls';
        quitBtn.innerText = 'Quit Game';

        frag.appendChild(startBtn);
        frag.appendChild(controlsBtn);
        frag.appendChild(quitBtn);

        var divButtons = document.getElementById('btn-container');
        divButtons.appendChild(frag);


        startBtn.addEventListener('click', function () {
            startBtn.parentNode.removeChild(startBtn);
            controlsBtn.parentNode.removeChild(controlsBtn);
            // Quit Button should not be removed!!!!!!!!
            quitBtn.parentNode.removeChild(quitBtn);

            Game();
        })

        controlsBtn.addEventListener('click', function () {
            controls = document.createElement('div');
            controls.innerText = 'Left arrow - move car to the left\n Right arrow - move car to the right';
            divButtons.appendChild(controls);
        })

        controlsBtn.addEventListener('mouseout', function () {
            controls.parentNode.removeChild(controls);
        })
    }

    StartMenu();

    function Game() {
        var canvas = document.getElementById("field");
        var ctx = canvas.getContext("2d");

        var pointsDiv = document.getElementById("points");

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
        var playerPoints = 0;
        var isGameOver = false;

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