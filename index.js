var myGamePiece;

function startGame() {
    myGamePieceColor = "red";
    myGamePiece = new component(32, 32, myGamePieceColor, (getWidth() / 2) -16, (getHeight() / 2) - 16, true);
    myObstacle  = new component(332, getHeight(), "green", 0, 0);
    myObstacle2  = new component(128, 256, "purple", 364, 32);
    myObstacle3  = new component(128, 256, "purple", 364, 320);
    myGameArea.start();
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = getWidth();
        this.canvas.height = getHeight();
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
            isCollide(myGamePiece, myObstacle3)

            );
}

function updateGameArea() {

    myGameArea.clear();

    myGamePieceColor = "purple";

for (i = 0; i < 32; i++) {
    if (moving_left) {
        myGamePiece.x--;

        if (collision()) {
            myGamePiece.x++;
        }
    }

    if (moving_right) {
      myGamePiece.x++;

        if (collision()) {
            myGamePiece.x--;
        }
    }

    if (moving_up) {
      myGamePiece.y--;


        if (collision()) {
            myGamePiece.y++;
        }
    }

    if (moving_down) {
      myGamePiece.y++;


        if (collision()) {
            myGamePiece.y--;
        }
    }

    myGamePiece.update();

    if (myGamePiece.x < 0) {
        myGamePiece.x = 0;
    }
    if (myGamePiece.x > getWidth() - 32) {
        myGamePiece.x = getWidth() - 32;
    }

    if (myGamePiece.y < 0) {
        myGamePiece.y = 0;
    }
    if (myGamePiece.y > getHeight() - 32) {
        myGamePiece.y = getHeight() - 32;
    }

}

if (isCollide(myGamePiece, myObstacle)) {
        console.log("true");
    }

    myGamePieceColor = "red";

        myObstacle.update();
        myObstacle2.update();
        myObstacle3.update();
    myGamePiece.update();
    setTimeout(() => {
        requestAnimationFrame(updateGameArea);
}, "0")
    
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