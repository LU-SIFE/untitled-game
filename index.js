var text_array = [
    "...",
    "Where am I?",
    "Looks like someone left<br>their weapon on the floor,<br>Maybe I should pick it up,<br>just in case.",
    "Alright...<br>How do I get out of here?",
    "Maybe I could see if<br>there are any possible<br>exits or cracks around."

];

var collision_counter = 4;
var colliding = false;
var timing = 0;
var myGamePiece;
var myGun;
var speed = 8;
var running = false;
var stamina = 50;
var tired = false;
var currently_moving = false;
var hasgun = false;
var ammo = 8;
let img = new Image();
img.src = 'img/upham.png';
var projectiles = new Object();
var level = new Object();
var gunDirection = 1;
var reloading = false;
var myGamePieceColor = "red";
var gunColor = "#0f0f0f";
var begin_game = false;
var r = 0;
var g = 255;
var b = 0;
var color_cycle = "rgb(" + r + ", " + g + ", " + b + ")";

function fade1() {
    if (begin_game) {
        startGame();
    } else {
        begin_game = true;
        document.getElementById("start").style.pointerEvents = "none";
        document.getElementById("start").style.opacity = "0";

        setTimeout(function() {
            document.getElementById("start").innerHTML = "Are You Sure?";
            document.getElementById("start").style.pointerEvents = "all";
            document.getElementById("start").style.opacity = "1";
        }, 500);
    }
}

function startGame() {
    document.getElementById("stats").style.animation="pop_in_stats 0.5s";
    document.getElementById("start").style.display = "none";
    document.getElementById("stats").style.display = "initial";
    generate_objects();
    myGameArea.start();
    myGameArea.context.translate(myGameArea.canvas.width / 2 - 80, myGameArea.canvas.height / 2 - 81);
    myGameArea.clear();
    story(0);
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
            (myGamePiece.x + 16) - (myGameArea.canvas.width / 2),
            (myGamePiece.y + 16) - (myGameArea.canvas.height / 2),
            myGameArea.canvas.width, myGameArea.canvas.height);
    }
}

function shoot(keypress) {
    if (keypress && !(ammo <= 0) && hasgun) {
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
        projectiles["bullet" + ammo] = new component(24, 24, "orange", myGamePiece.x + 4, myGamePiece.y + 4);
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

function update_area() {

myGamePiece.update();
for (i = 1; i <= collision_counter; i++) {
    level["b" + i].update();
}

if (item1) {
    item1.update();
    if (isCollide(myGamePiece, item1)) {
        hasgun = true;
        item1 = null;
        myGun = new component(24, 8, gunColor, (myGamePiece.x + 4), (myGamePiece.y - 14), "gun");
        gunDirection = 1; 
        reload();
        story(1);
    }
}

if (level.br1) {
    level.br1.update();
}

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
            if (level.br1) {
                collision("breakable", i);
            }
            if (projectiles["bullet" + i]) {
                collision("bullet", i);
            }

            if (projectiles["bullet" + i]) {
                projectiles["bullet" + i].update();
            }
        }
    }
    if (myGun) {
        myGun.update();
    }
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

            if (collision() && !colliding) {
                myGamePiece.x++;
            } else {
                myGameArea.context.translate(1, 0);
            }
        }

        if (moving_right && !colliding) {
            myGamePiece.x++;

            if (collision()) {
                myGamePiece.x--;
            } else {
                myGameArea.context.translate(-1, 0);
            }
        }

        if (moving_up) {
            myGamePiece.y--;

            if (collision() && !colliding) {
                myGamePiece.y++;
            } else {
                myGameArea.context.translate(0, 1);
            }
        }

        if (moving_down) {
            myGamePiece.y++;

            if (collision() && !colliding) {
                myGamePiece.y--;
            } else {
                myGameArea.context.translate(0, -1);
            }
        }

        if (gunDirection === 0 && myGun) {
            myGun.width = 8;
            myGun.height = 24;
            myGun.x = myGamePiece.x - 14;
            myGun.y = myGamePiece.y + 4; 

        } else if (gunDirection === 1 && myGun) {
            myGun.width = 24;
            myGun.height = 8;
            myGun.x = myGamePiece.x + 4;
            myGun.y = myGamePiece.y - 14; 

        } else if (gunDirection === 2 && myGun) {
            myGun.width = 8;
            myGun.height = 24;
            myGun.x = myGamePiece.x + 38;
            myGun.y = myGamePiece.y + 4; 

        } else if (gunDirection === 3 && myGun) {
            myGun.width = 24;
            myGun.height = 8;
            myGun.x = myGamePiece.x + 4;
            myGun.y = myGamePiece.y + 38; 

        }
    }

    update_area();

    requestAnimationFrame(updateGameArea);
}

function story(event) {
    switch(event) {
    case 0:

        document.getElementById("text_box").style.display = "initial";
        timer(1500, 0);
        timer(2000, 1);
        timer(1500, 2, true);
    break;

    case 1:
        timer(2000, 3);
        timer(1500, 4, true);
    break;
    }
}