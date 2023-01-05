var myGamePiece;
var speed = 8;
var running = false;
var stamina = 50;
var tired = false;
var currently_moving = false;
var ammo = 8;
let img = new Image();
img.src = 'img/upham.png';
var projectiles = new Object();
var gunDirection = 1;
var reloading = false;
var myGamePieceColor = "red";
var gunColor = "#0f0f0f";
var r = 0;
var g = 255;
var b = 0;
var color_cycle = "rgb(" + r + ", " + g + ", " + b + ")";

function startGame() {
    myGamePiece = new component(32, 32, myGamePieceColor, 64, 32, true);
    myGun = new component(24, 8, gunColor, 64, 64, "gun");
    myObstacle  = new component(32 * 2, 32 * 12, "purple", 0, 0);
    myObstacle2  = new component(32 * 25, 32 * 5, "purple", 32 * 3, 0);
    myObstacle3  = new component(32 * 2, 32 * 2, "purple", 32 * 3 , 32 * 6);
    myObstacle4  = new component(32 * 14, 32 * 3, "purple", 32 * 6 , 32 * 6);
    myObstacle5  = new component(32 * 17, 32 * 2, "purple", 32 * 3 , 32 * 9);
    myObstacle6  = new component(32 * 5, 32 * 5, "purple", 32 * 21, 32 * 6);
    myObstacle7  = new component(32, 32, "purple", 32 * 2, 0);
    myObstacle8  = new component(32 * 28, 32 * 3, "purple", 0, 32 * 12);
    myGameArea.start();
    myGameArea.clear();
    myGameArea.context.translate(myGameArea.canvas.width / 2 - 80, myGameArea.canvas.height / 2 - 49);
}


var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = getWidth();
        this.canvas.height = getHeight();
        this.context = this.canvas.getContext("2d");
        document.getElementById("canvas-container").appendChild(this.canvas);
        updateGameArea();
    },
    clear : function() {
        this.context.restore();
        this.context.clearRect(
            (myGamePiece.x + 16 + mouseX) / 2 - (myGameArea.canvas.width / 2) + 80,
            (myGamePiece.y + 16 + mouseY) / 2 - (myGameArea.canvas.height / 2) + 49,
            myGameArea.canvas.width, myGameArea.canvas.height);
    }
}


function component(width, height, color, x, y, player) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y + 1;    
    this.update = function(){
        ctx = myGameArea.context;
        if (player === "gun") {
            ctx.fillStyle = gunColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (player) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function shoot(keypress) {
    if (keypress && !(ammo <= 0)) {
        gunColor = "orangered";
        setTimeout(function() {gunColor = "#0f0f0f";}, 50);
        document.getElementById("ammo").innerHTML = "";
        ammo--;
        for (i = 0; i < ammo; i++) {
            document.getElementById("ammo").innerHTML += "/";
        }
        if (ammo === 0) {
            document.getElementById("ammo").style.width = "0%";
        }
        projectiles["bullet" + ammo] = new component(16, 16, "yellow", myGamePiece.x + 8, myGamePiece.y + 8);
        projectiles["bullet" + ammo].direction = gunDirection;

        console.log(ammo);
        return;
    }
}

function reload() {
    gunColor = "darkred";
    reloading = true;
    ammo = 0;
    document.getElementById("ammo").style.width = "0%";
    document.getElementById("ammo").innerHTML = "";
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
        reloading = false;
        gunColor = "#0f0f0f"
    }, 1000);
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
        isCollide(myGamePiece, myObstacle5) ||
        isCollide(myGamePiece, myObstacle6) ||
        isCollide(myGamePiece, myObstacle7) ||
        isCollide(myGamePiece, myObstacle8)
        );
}


function update_area() {
    myGamePiece.update();
    myObstacle.update();
    myObstacle2.update();
    myObstacle3.update();
    myObstacle4.update();
    myObstacle5.update();
    myObstacle6.update();
    myObstacle7.update();
    myObstacle8.update();

    for (i = 0; i < 8; i++) {
        if (projectiles["bullet" + i]) {
            if (projectiles["bullet" + i].direction == 0) {
                projectiles["bullet" + i].x -= 24;
            } else if (projectiles["bullet" + i].direction == 1) {
                projectiles["bullet" + i].y -= 24;
            } else if (projectiles["bullet" + i].direction == 2) {
                projectiles["bullet" + i].x += 24;
            } else if (projectiles["bullet" + i].direction == 3) {
                projectiles["bullet" + i].y += 24;
            }
            projectiles["bullet" + i].update();
        }
    }
    myGun.update();
}
var mouseX = myGameArea.canvas.width / 2 - 80;
var mouseY = myGameArea.canvas.height / 2 - 49;
document.onmousemove = (event) => {
    mouseX = event.clientX - (myGameArea.canvas.width / 2 - 80);
    mouseY = event.clientY - (myGameArea.canvas.height / 2 - 49);
}

function updateGameArea() {

    myGameArea.context.setTransform(1, 0, 0, 1, 0, 0);
    myGameArea.context.translate(-((myGamePiece.x + 16 + mouseX) / 2),-((myGamePiece.y + 16 + mouseY) / 2));
    myGameArea.context.translate(myGameArea.canvas.width / 2 - 80, myGameArea.canvas.height / 2 - 49);

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
                tired = true;
            }
            document.getElementById("stamina").style.width = stamina + "%";
        } else {
            if (!(stamina >= 50)) {
                speed = 8;
                stamina += 0.1;
            } else {
                tired = false;
            }
            document.getElementById("stamina").style.width = stamina + "%";
        }

        r = 255 - (255 / (50 / stamina));
        g = 255 / (50 / stamina);
        color_cycle = "rgb(" + r + ", " + g + ", " + b + ")";
        document.getElementById("stamina").style.backgroundColor = color_cycle;

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

        if (gunDirection === 0) {
            myGun.width = 8;
            myGun.height = 24;
            myGun.x = myGamePiece.x - 14;
            myGun.y = myGamePiece.y + 4; 

        } else if (gunDirection === 1) {
            myGun.width = 24;
            myGun.height = 8;
            myGun.x = myGamePiece.x + 4;
            myGun.y = myGamePiece.y - 14; 

        } else if (gunDirection === 2) {
            myGun.width = 8;
            myGun.height = 24;
            myGun.x = myGamePiece.x + 38;
            myGun.y = myGamePiece.y + 4; 

        } else if (gunDirection === 3) {
            myGun.width = 24;
            myGun.height = 8;
            myGun.x = myGamePiece.x + 4;
            myGun.y = myGamePiece.y + 38; 

        }
    }

    update_area();


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
    } else if (e.keyCode === 82) { // r
        if (!reloading) {
            reload();
        }
    } else if (e.keyCode === 37) { // left
        gunDirection = 0;
    } else if (e.keyCode === 38) { // up
        gunDirection = 1;
    } else if (e.keyCode === 39) { // right
        gunDirection = 2;
    } else if (e.keyCode === 40) { // down
        gunDirection = 3;
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