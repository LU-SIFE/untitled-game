function generate_objects() {
    myGamePiece = new component(32, 32, myGamePieceColor, 64, 64, true);
    level.b1  = new component(32 * 2, 32 * 15, "#515151", 0, 0, "wall");
    level.b2  = new component(32 * 10, 32 * 2, "#515151", 32 * 2, 0, "wall");
    level.b3  = new component(32 * 13, 32 * 2, "#515151", 0, 32 * 13, "wall");
    level.b4  = new component(32 * 2, 32 * 15, "#515151", 32 * 13, 0, "wall");
    level.br1  = new component(32, 32 * 2, "#515151", 32 * 12, 0);
    item1 = new component(24, 8, "#0f0f0f", 32 * 12, 32 * 12);
}