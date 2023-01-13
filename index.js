//object variables (UPDATE THIS WHENEVER A NEW NORMAL WALL IS MADE!!!!)
const collision_counter = 4;

//player states
var myGamePieceColor = "red";
var currently_moving = false;
var gunColor = "#0f0f0f";
var gunDirection = 1;
var colliding = false;
var reloading = false;
var running = false;
var hasgun = false;
var paused = false;
var tired = false;

//player options/stats
var stamina = 50;
var speed = 8;
var ammo = 8;

//story related variables
var begin_game = false;
var progress = 0;

//variable initialization
var projectiles = new Object();
var level = new Object();
const img = new Image();
img.src = 'img/upham.png';
var myGamePiece;
var myGun;

//ui (stamina)
var r = 0;
var g = 255;
var b = 0;
var color_cycle = "rgb(" + r + ", " + g + ", " + b + ")";


//menu states
var map_state = false;
var menu_state = false;

// map stuff :P
var top_entry = "Cell One<br>";
var map_selection = 0;
var unlocked_locations = [true];
var map_array = ["Cell One<br>", "???<br>", "???<br>", "???<br>", "???<br>", "???<br>", "???<br>", "???<br>"];
var map_array_buffer = ["<br>", "???<br>", "???<br>", "???<br>", "???<br>", "???<br>", "???<br>", "???<br>"];

//misc
var timing = 0;

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

//start function
function startGame() {
    document.body.style.cursor = 'none';
    document.getElementById("stats").style.animation="pop_in_stats 0.5s";
    document.getElementById("start").style.display = "none";
    document.getElementById("stats").style.display = "initial";
    generate_objects();
    myGameArea.start();
    myGameArea.context.translate(myGameArea.canvas.width / 2 - 80, myGameArea.canvas.height / 2 - 81);
    myGameArea.clear();
    story(0);
    select_map(true);
    select_map(false);
}

//shooting function
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

//reloading function
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

//update function 1
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

//main update function
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

        if (moving_right) {
            myGamePiece.x++;

            if (collision() && !colliding) {
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
        gunCheck();
    }

    update_area();

    pauseCheck();
}

//checks if the game is paused before updating game area
function pauseCheck() {
    if (paused !== true) {
        requestAnimationFrame(updateGameArea);
    }
}

//story function
function story(event) {
    switch(event) {
    case 0:

        document.getElementById("text_box").style.display = "initial";
        document.getElementById("text_box2").style.display = "block";
        timer(1500, 0);
        timer(2000, 1);
        timer(1500, 2, true);
    break;

    case 1:
        document.getElementById("text_box2").innerHTML = "SHOOT:<br>[SPACE]<br>DIRECTION:<br>[ARROWS]";
        timer(2000, 3);
        timer(1500, 4, true);
    break;

    case 2:
        document.getElementById("text_box2").style.display = "none";
        timer(1000, 5);
        timer(9000, 6, null, 1500);
        timer(1500, 7, null, 3000);
        setTimeout(function(){story(3);}, 11500);
        timer(4000, 8, true, null);
        break;

    case 3:
        document.getElementById("text_box2").style.display = "block";
        document.getElementById("text_box2").innerHTML = "MAP:<br>[M]";
        progress = 3;
    break;

    case 4:
        progress = 4;
        timer(1000, 9);
        document.getElementById("text_box2").innerHTML = "MENU:<br>[I]";
    break;
    }
}