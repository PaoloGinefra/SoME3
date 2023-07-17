import type p5 from "p5";

/**
 * A class to draw a grid on the screen
 * 
 * @example
 * let grid = new Grid(400, 400, 20, 0.2, 0.2, p);
 * p.preload = () => grid.preload();
 * p.setup = () => grid.setup();
 * p.draw = () => grid.draw();
 */
export default class Grid {
    w: number;
    h: number;
    gridSize: number;
    dotSize: number;
    dotOpacity: number;
    p: p5;
    shader!: p5.Shader;
    screen!: p5.Graphics;


    /**
     * Builds a grid object
     * @param w The width of the screen
     * @param h The height of the screen
     * @param gridSize The spacing between the dots in px
     * @param dotSize The size of the dots' radius as a fraction of the grid size
     * @param dotOpacity The opacity of the dots
     * @param p The p5 instance
     */
    constructor(w: number, h: number, gridSize: number = 20, dotSize: number = 0.2, dotOpacity: number = 0.2, p: p5) {
        this.w = w;
        this.h = h;
        this.gridSize = gridSize;
        this.dotSize = dotSize;
        this.dotOpacity = dotOpacity;
        this.p = p;
    }

    /**
     * Preloads the shader
     */
    preload() {
        this.shader = this.p.loadShader('shaders/shader.vert', 'shaders/grid.frag');
    }

    /**
     * Builds the screen
     */
    setup() {
        this.screen = this.p.createGraphics(this.w, this.h, this.p.WEBGL);
    }

    /**
     * Draws the grid
     */
    draw() {
        this.screen.clear(0, 0, 0, 0);
        this.shader.setUniform('u_resolution', [this.w, this.h]);
        this.shader.setUniform('u_gridSize', this.gridSize * 2);
        this.shader.setUniform('u_dotSize', this.dotSize);
        this.shader.setUniform('u_dotOpacity', this.dotOpacity);
        this.screen.shader(this.shader);
        this.screen.strokeWeight(0);
        this.screen.rect(0, 0, this.w, this.h);
        this.p.image(this.screen, 0, 0);
    }
}
