import type p5 from "p5";
import Image from 'next/image'

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
    leaf?: p5.Image
}

export class Square extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.noStroke()
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
        this.canvas.noStroke()

        this.canvas.fill(255, 255, 255)
        this.canvas.circle(this.position.x, this.position.y, this.scale)
    }
}

export class Triangle extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.noStroke()
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
        this.canvas.strokeWeight(10)
        this.canvas.stroke(255, 255, 255)
        this.canvas.push()
        this.canvas.translate(this.position)
        this.canvas.rotate(this.rotation)
        this.canvas.line(0, 0, this.scale, 0)
        this.canvas.pop()
    }
}

export class Leaf extends Shape {
    draw(context: drawContext_interface) {
        this.canvas.push()
        this.canvas.translate(this.position)
        this.canvas.rotate(this.rotation)
        this.canvas.imageMode(this.p.CENTER)
        if (context.leaf != undefined)
            this.canvas.image(context.leaf, 0, 0, this.scale, this.scale * context.leaf.height / context.leaf.width)
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
            this.canvas.strokeWeight(1)
            this.canvas.stroke(255, 255, 255)
            this.canvas.scale(this.canvas.width / this.scale)
            this.canvas.rect(0, 0, this.scale, this.canvas.height * this.scale / this.canvas.width)
        }
        this.canvas.pop()
    }
}


export let Shapes: (typeof Shape)[] = [Canvas, Square, Circle, Triangle, Line, Leaf]
export let ShapesNames = Shapes.map((s) => s.name)
export let ShapesEmojis = ['🖽', '◻️', '⚪', '🛆', '⁄',
    <Image
        src="/assets/DWD/leaf.svg"
        className="m-auto"
        width={25}
        height={25}
        alt="Picture of the author"
    />]