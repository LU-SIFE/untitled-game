var myGamePiece;
var speed = 16;

function startGame() {
    canvasWidth = getWidth() - (getWidth() % 32);
    canvasHeight = getHeight() - (getHeight() % 32);
    myGamePieceColor = "red";
    myGamePiece = new component(32, 32, myGamePieceColor, (canvasWidth / 2) - 16, (canvasHeight / 2) - 16, true);
    myObstacle  = new component(32 * 2, 32 * 10, "purple", 16, 16);
    myObstacle5  = new component(32, 32, "purple", 32 * 2 + 16, 16);
    myObstacle2  = new component(32 * 25, 32 * 5, "purple", 32 * 3 + 16, 16);
    myObstacle3  = new component(32 * 17, 32 * 5, "purple", 32 * 3 + 16, 32 * 6 + 16);
    myObstacle4  = new component(32 * 5, 32 * 5, "purple", 32 * 21 + 16, 32 * 6 + 16);
    myGameArea.start();
    console.log(canvasWidth + " " + canvasHeight);
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = getWidth() - (getWidth() % 32);
        this.canvas.height = getHeight() - (getHeight() % 32);
        this.context = this.canvas.getContext("2d");
        document.getElementById("canvas-container").appendChild(this.canvas);
        updateGameArea();
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, player) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.update = function(){
        ctx = myGameArea.context;
        if (player) {
            ctx.fillStyle = myGamePieceColor;
        } else {
            ctx.fillStyle = color;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y + 1)) ||
        (a.y > (b.y + b.height - 1)) ||
        ((a.x + a.width - 1) < b.x) ||
        (a.x > (b.x + b.width - 1))
    );
}

function collision() {
    return (isCollide(myGamePiece, myObstacle) ||
        isCollide(myGamePiece, myObstacle2) ||
        isCollide(myGamePiece, myObstacle3) ||
        isCollide(myGamePiece, myObstacle4) ||
        isCollide(myGamePiece, myObstacle5)
        );
}

function update_area() {
    myObstacle.update();
    myObstacle2.update();
    myObstacle3.update();
    myObstacle4.update();
    myObstacle5.update();
}

function updateGameArea() {

    myGameArea.clear();

    for (i = 0; i < speed; i++) {

        if (moving_left) {
            myGamePiece.x--;

            if (collision()) {
                myGamePiece.x++;
            } else {
                myGameArea.context.translate(1, 0);
            }
        }

        if (moving_right) {
            myGamePiece.x++;

            if (collision()) {
                myGamePiece.x--;
            } else {
                myGameArea.context.translate(-1, 0);
            }
        }

        if (moving_up) {
            myGamePiece.y--;

            if (collision()) {
                myGamePiece.y++;
            } else {
                myGameArea.context.translate(0, 1);
            }
        }

        if (moving_down) {
            myGamePiece.y++;

            if (collision()) {
                myGamePiece.y--;
            } else {
                myGameArea.context.translate(0, -1);
            }
        }
    }

    update_area();
    myGamePiece.update();

    setTimeout(() => { requestAnimationFrame(updateGameArea); }, 0);
}


//

var moving_right = false;
var moving_left = false;
var moving_up = false;
var moving_down = false;


// ---- Code to work with HTML keyboard events ----

document.addEventListener("keydown", function(e) {
    e = e || window.event; // For older browsers (uses window.event if e is undefined)

    if (e.keyCode === 68) { // d
        moving_right = true;
    } else if (e.keyCode === 65) { // a
        moving_left = true;
    } else if (e.keyCode === 87) { // w
        moving_up = true;
    } else if (e.keyCode === 83) { // w
        moving_down = true;
    } else if (e.keyCode === 16) { // shift
        speed = 24;
    }
});

document.addEventListener("keyup", function(e) {
    e = e || window.event; // For older browsers (uses window.event if e is undefined)

    if (e.keyCode === 68) { // d
        moving_right = false;
    } else if (e.keyCode === 65) { // a
        moving_left = false;
    } else if (e.keyCode === 87) { // a
        moving_up = false;
    } else if (e.keyCode === 83) { // a
        moving_down = false;
    } else if (e.keyCode === 16) { // shift
        speed = 16;
    }
});

var mouse = new Object;
mouse.x = -1;
mouse.y = -1;

document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

//

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}