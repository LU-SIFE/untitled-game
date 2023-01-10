// ---- Code to work with HTML keyboard events ----
var moving_right = false;
var moving_left = false;
var moving_up = false;
var moving_down = false;

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
        if (!reloading && hasgun) {
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