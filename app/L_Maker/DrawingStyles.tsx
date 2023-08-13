import type p5 from 'p5'

let DrawingStyles: ((params: number[], p: p5, t?: number) => void)[] = [
    (params: number[], p: p5, t = 1) => {
        p.stroke(0, 0, 0, 255);
        p.strokeWeight(1);
        p.line(0, 0, params[0] * t, 0);
        p.translate(params[0] * t, 0);
    },
    (params: number[], p: p5, t = 1) => {
        console.log(params[1])
        p.stroke(0, 0, 0, 100);
        p.strokeWeight(5);
        p.line(0, 0, params[0] * t, 0);
        p.translate(params[0] * t, 0);
    },

]

export default DrawingStyles;