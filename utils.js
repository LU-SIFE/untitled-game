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
function box_remove(delay) {
    setTimeout(function() {document.getElementById("text_box").style.display = "none";}, delay);
}

//story text function
function timer(delay, array, reset, rdelay) {
    setTimeout(function() {
        document.getElementById("text_box").style.display = "initial";
        document.getElementById("text_box").classList.add("expand");
        document.getElementById("text_box").innerHTML = text_array[array];
        setTimeout(function() {
            document.getElementById("text_box").classList.remove("expand");
            if (reset && rdelay) {
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