window.onload = function () {
    var canvas = document.getElementById("field");
    var ctx = canvas.getContext("2d");
    var fieldMinPositionX = 350;
    var fieldMaxPositionX = 850;
    var fieldPositionY = 580;

    var myCarImage = new Image();
    myCarImage.src = 'images/car.png';

    var myCar = new MainCar(565, 450, myCarImage);

    var directions = {
        "left": -175,
        "right": 175,
        "center": 0
    };

    myCar.draw("center");

    function MainCar(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.frontBumperY = 450;
        this.frontLeftBumperX = 570;
        this.frontRightBumperX = 620;
        this.draw = function (direction) {
            var newPosition = this.x + directions[direction];
            if (!(newPosition > fieldMaxPositionX) && !(newPosition < fieldMinPositionX)) {
                this.x = newPosition;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(this.image, newPosition, this.y);
            }
        }
    }

    function drawMyCar(mainCar, direction, mainCarY) {
        var newPosition = myCarX + directions[direction];
        if (!(newPosition > fieldMaxPositionX) && !(newPosition < fieldMinPositionX)) {
            myCarX = newPosition;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(mainCar, newPosition, mainCarY);
        }
    }

    document.onkeydown = checkKey;
    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == '40') {
            direction = 'down';
        }
        else if (e.keyCode == '39') {
            direction = 'right';
            myCar.draw(direction);
        }
        else if (e.keyCode == '37') {
            direction = 'left';
            myCar.draw(direction);
        }
    }
}