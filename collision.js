
function collision(type, iteration) {
    if (type == "breakable") {
        if (isCollide(projectiles["bullet" + iteration], level.br1)) {
            projectiles["bullet" + iteration] = null;
            level.br1 = null;
            story(2);
        }
    } else if (type == "bullet") {
        if (isCollide(projectiles["bullet" + iteration], level.b1) ||
            isCollide(projectiles["bullet" + iteration], level.b2) ||
            isCollide(projectiles["bullet" + iteration], level.b3) ||
            isCollide(projectiles["bullet" + iteration], level.b4)
            ) {
            projectiles["bullet" + iteration] = null;
            return true;
        }

    }

    for (iter = 1; iter <= collision_counter; iter++) {
        if (isCollide(myGamePiece, level["b" + iter])) {
            return true;
        } else if (level.br1 && isCollide(myGamePiece, level.br1)) {
            return true;
        }
    }
        return false;
}