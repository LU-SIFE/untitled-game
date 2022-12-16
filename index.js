var myGamePiece;
var speed = 8;
var running = false;
var stamina = 50;
var tired = false;
var currently_moving = false;
var ammo = 8;
let img = new Image();
img.src = 'img/upham.png';

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
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function shoot(keypress) {
    if (keypress && !(ammo <= 0)) {
        document.getElementById("ammo").innerHTML = "";
        ammo--;
        for (i = 0; i < ammo; i++) {
            document.getElementById("ammo").innerHTML += "/";
        }
        if (ammo === 0) {
            document.getElementById("ammo").style.width = "0%";
        }
        console.log(ammo);
        return;
    }
}

function reload() {
    if (ammo === 0) {
        console.log("reloading...");
        document.getElementById("reload").style.animation="reload 0.75s";
        document.getElementById("reload").style.width = "50%";
        setTimeout(function() {document.getElementById("reload").style.animation="flash 0.25s";}, 750);
        setTimeout(function() {
            document.getElementById("reload").style.width = "0%";
            document.getElementById("ammo").style.width = "50%";
            ammo = 8;

            for (i = 0; i < ammo; i++) {
                document.getElementById("ammo").innerHTML += "/";
            }
        }, 1000);
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

        if (moving_up || moving_down || moving_left || moving_right) {
            currently_moving = true;
        } else {
            currently_moving = false;
        }

        if (running && tired == false && currently_moving) {
            if (!(stamina <= 0)) {
                stamina -= 0.05;
                speed = 20;
            } else {
                document.getElementById("stamina").style.backgroundColor = "red";
                tired = true;
            }
            document.getElementById("stamina").style.width = stamina + "%";
        } else {
            if (!(stamina >= 50)) {
                speed = 8;
                stamina += 0.07;
            } else {
                document.getElementById("stamina").style.backgroundColor = "white";
                tired = false;
            }
            document.getElementById("stamina").style.width = stamina + "%";
        }

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
    } else if (e.keyCode === 83) { // s
        moving_down = true;
    } else if (e.keyCode === 16) { // shift
        running = true;
    } else if (e.keyCode === 32) { // space
        shoot(true);
    } else if (e.keyCode === 82) { // shift
        reload();
    }
});

document.addEventListener("keyup", function(e) {
    e = e || window.event; // For older browsers (uses window.event if e is undefined)

    if (e.keyCode === 68) { // d
        moving_right = false;
    } else if (e.keyCode === 65) { // a
        moving_left = false;
    } else if (e.keyCode === 87) { // w
        moving_up = false;
    } else if (e.keyCode === 83) { // s
        moving_down = false;
    } else if (e.keyCode === 16) { // shift
        running = false;
    } else if (e.keyCode === 32) { // space
        shoot(false);
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