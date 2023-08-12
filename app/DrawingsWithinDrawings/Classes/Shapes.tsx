import type p5 from "p5";

export default class Shape {
    p: p5;
    canvas: p5.Graphics;
    position: p5.Vector;
    rotation: number;
    scale: number;

    constructor(p: p5, canvas: p5.Graphics, position: p5.Vector, rotation: number, scale: number) {
        this.p = p;
        this.canvas = canvas;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    draw(context: drawContext_interface) {
        this.canvas.fill(255, 255, 255)
        this.canvas.circle(this.position.x, this.position.y, this.scale)
    }
}

interface drawContext_interface {
    drawContour?: boolean,
}

export class Square extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.fill(255, 255, 255)
        this.canvas.push()
        this.canvas.translate(this.position)
        this.canvas.rotate(this.rotation)
        this.canvas.rectMode(this.p.CENTER)
        this.canvas.square(0, 0, this.scale)
        this.canvas.pop()
    }
}

export class Circle extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.fill(255, 255, 255)
        this.canvas.circle(this.position.x, this.position.y, this.scale)
    }
}

export class Triangle extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.fill(255, 255, 255)
        this.canvas.push()
        this.canvas.translate(this.position)
        this.canvas.rotate(this.rotation)
        this.canvas.triangle(0, 0, this.scale, 0, 0, this.scale)
        this.canvas.pop()
    }
}

export class Line extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.fill(255, 255, 255)
        this.canvas.push()
        this.canvas.translate(this.position)
        this.canvas.rotate(this.rotation)
        this.canvas.line(0, 0, this.scale, 0)
        this.canvas.pop()
    }
}

export class Canvas extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.push()
        this.canvas.imageMode(this.p.CENTER)
        this.canvas.translate(this.position)
        this.canvas.rotate(this.rotation)
        this.canvas.scale(this.scale / this.canvas.width)
        this.canvas.image(this.canvas, 0, 0)

        if (context.drawContour) {
            this.canvas.rectMode(this.p.CENTER)
            this.canvas.noFill()
            this.canvas.stroke(255, 255, 255)
            this.canvas.scale(this.canvas.width / this.scale)
            this.canvas.rect(0, 0, this.scale, this.canvas.height * this.scale / this.canvas.width)
        }
        this.canvas.pop()
    }
}


export let Shapes: (typeof Shape)[] = [Square, Circle, Triangle, Line, Canvas]
export let ShapesNames = Shapes.map((s) => s.name)