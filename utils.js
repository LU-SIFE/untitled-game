//width function
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

//height function
function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

//box display thingy
function box_remove(delay2) {
    setTimeout(function() {document.getElementById("text_box").style.display = "none";}, delay2);
}

//story text function
function timer(delay, array, reset, rdelay) {
    setTimeout(function() {
        document.getElementById("text_box").style.display = "initial";
        document.getElementById("text_box").classList.add("expand");
        document.getElementById("text_box").innerHTML = text_array[array];
        setTimeout(function() {
            document.getElementById("text_box").classList.remove("expand");
            if (rdelay > 0) {
                box_remove(rdelay);
            }
        }, 500);
        if (reset) {
            timing = 0;
        }
    }, timing);
    if (!reset) {
        timing += delay;
    }
}

//collision detection -- DO NOT MODIFY
function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y + 1)) ||
        (a.y > (b.y + b.height - 1)) ||
        ((a.x + a.width - 1) < b.x) ||
        (a.x > (b.x + b.width - 1))
    );
}

//component generation
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
        } else if (player === "wall") {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (player) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function display_menu(state) {
    if (state == true) {
        document.getElementById("menu").classList.remove("close_inv");
        document.getElementById("menu").classList.add("open_inv");
        document.getElementById("menu").style.display = "flex";
        document.getElementById("menu").style.zIndex = "10";
    } else {
        document.getElementById("menu").classList.remove("open_inv");
        document.getElementById("menu").classList.add("close_inv");
        setTimeout(function() {
            document.getElementById("menu").style.display = "none";
        }, 500);
        document.getElementById("menu").style.zIndex = "5";
    }
}

function display_map(state) {
    if (state == true) {
        document.getElementById("map").classList.remove("close_map");
        document.getElementById("map").classList.add("open_map");
        document.getElementById("map").style.display = "flex";
        document.getElementById("map").style.zIndex = "10";
    } else {
        document.getElementById("map").classList.remove("open_map");
        document.getElementById("map").classList.add("close_map");
        setTimeout(function() {
            document.getElementById("map").style.display = "none";
        }, 500);
        document.getElementById("map").style.zIndex = "5";
    }
}

function select_map(mapdir) {
    if (mapdir) {//up
        map_array.push(map_array.shift());
        map_selection++;

    } else if (!mapdir) {//down
        map_selection--;
        map_array.unshift(map_array.pop());
    }

    map_array_buffer = map_array.slice();
    map_array_buffer[0] = "<br>";
    top_entry = map_array[0].toString();
    top_entry = top_entry.substring(0, top_entry.length - 4);

    document.getElementById("map_entries").innerHTML = map_array_buffer.join("");
    document.getElementById("top_entry").innerHTML = "[ " + top_entry + " ]";
}

function teleport() {

    if (unlocked_locations[map_selection] != true) {
        return;
    }

    switch(map_selection) {
    case 0:
        myGamePiece.x = 128;
        myGamePiece.y = 128;
    break;

    case 1:
        myGamePiece.x = 200;
        myGamePiece.y = 200;
    break;
    }
    myGameArea.context.resetTransform();
    myGameArea.context.translate(-myGamePiece.x - 16,-myGamePiece.y - 16);
    myGameArea.context.translate(myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);
    display_map(false);
    display_menu(false);
    map_state = false;
    menu_state = false;
    paused = false;
    pauseCheck();
}

function gunCheck() {
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

//window resizing
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  myGameArea.canvas.width = getWidth();
  myGameArea.canvas.height = getHeight();
  myGameArea.context.resetTransform();
  myGameArea.context.translate(-myGamePiece.x - 16,-myGamePiece.y - 16);
  myGameArea.context.translate(myGameArea.canvas.width / 2, myGameArea.canvas.height / 2);
}