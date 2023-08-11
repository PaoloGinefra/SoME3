import { Symbol, Production, DrawingRule, LSystem } from "./GPLS_interfaces";
import type { Point } from "../L_Maker/Inreface/PointSequenceEditor";
import type p5 from "p5";

export default class GPLS {
    /**
     * Convert a symbol to a string
     * @param symbol
     * @returns
     * @example
     * symbol2Str({char: "F", params: [1, 2]})
     * // F(1,2)
     */
    static symbol2Str(symbol: Symbol): string {
        return symbol.char + (symbol.params.length > 0 ? '(' + symbol.params.join(',') + ')' : '');
    }

    /**
     * Print a string
     * @param string
     * @returns
     * @example
     * printString([{char: "F", params: [1, 2]}, {char: "+", params: [1]}])
     * // F(1,2)+(1)
     */
    static printString(string: Symbol[]) {
        let str = "";
        for (let i = 0; i < string.length; i++) {
            str += this.symbol2Str(string[i]);
        }
        console.log(str);
    }


    /**
     * Apply a production to a string
     * @param string
     * @param productions
     * @returns
     * @example
     * applyProduction(
     * [{char: "F", params: [0]}],
     * [
     * {preChar: "F",
     * condition: (params) => true,
     * successor: (params) => [
     * {char: "F", params: [params[0]/2, params[1]/2]},
     * {char: "+", params: [params[0]/2]},]
     * },
     * ])
     * // [{char: "F", params: [0.5, 1]}, {char: "+", params: [0.5]}]
     * // F(0.5,1)+(0.5)
     */
    static applyProductions(string: Symbol[], productions: Production[]): Symbol[] {
        let newString: Symbol[] = [];
        for (let i = 0; i < string.length; i++) {
            let symbol = string[i];
            let found = false;
            for (let j = 0; j < productions.length; j++) {
                let production = productions[j];
                if (symbol.char == production.preChar && production.condition(symbol.params)) {
                    newString = newString.concat(production.successor(symbol.params));
                    found = true;
                    break;
                }
            }
            if (!found) {
                newString.push(symbol);
            }
        }
        return newString;
    }

    /**
     * Draws a string
     * @param p
     * @param string
     * @param drawingRules
     * @returns
     */
    static drawString(p: p5, string: Symbol[], drawingRules: DrawingRule[], t: number = 1, increasingOffest: boolean = true) {
        if (string.length == 0) return;

        let stepOffset = 1
        let offset = 0;

        let offsetPeriod = 1
        for (let i = 0; i < string.length; i++) {
            let symbol = string[i];
            if (symbol.char == '[' && increasingOffest)
                offset += stepOffset;
            else if (symbol.char == ']' && increasingOffest)
                offset -= stepOffset;

            for (let j = 0; j < drawingRules.length; j++) {
                let drawingRule = drawingRules[j];
                if (drawingRule.targetChars.includes(symbol.char)) {
                    drawingRule.drawing(symbol.params, p, p.constrain(t - offset, 0, 1));
                    break;
                }
            }

            if (increasingOffest && (symbol.char == 'F' || symbol.char == '+'))
                offset += offsetPeriod * 5 / string.length;
        }
    }

    static drawStringGradually(p: p5, string: Symbol[], drawingRules: DrawingRule[], t: number = 1) {
        t = Math.min(t, string.length);
        for (let i = 0; i < t; i++) {
            let symbol = string[i];
            for (let j = 0; j < drawingRules.length; j++) {
                let drawingRule = drawingRules[j];
                if (symbol.char == drawingRule.targetChars) {
                    drawingRule.drawing(symbol.params, p, t);
                    break;
                }
            }
        }
    }

    static pointSequence2String(pointSequence: Point[]): Symbol[] {
        if (pointSequence.length == 0) return [];
        let axiom: Symbol[] = [];
        let prevPosition = pointSequence[0].position.copy();
        let prevHeading = 0;
        let headingStack: number[] = [];
        let positionStack: p5.Vector[] = [];
        for (let i = 1; i < pointSequence.length; i++) {
            let v = pointSequence[i].position.copy().sub(prevPosition);
            if (v.heading() - prevHeading != 0)
                axiom.push({ char: '+', params: [v.heading() - prevHeading] });
            if (v.mag() != 0)
                axiom.push({ char: pointSequence[i].char, params: [v.mag()] });
            if (pointSequence[i].push) {
                axiom.push({ char: '[', params: [] });
                headingStack.push(v.heading());
                positionStack.push(pointSequence[i].position.copy())
            }
            if (pointSequence[i].pop) {
                axiom.push({ char: ']', params: [] });
                prevHeading = headingStack.pop() ?? 0;
                prevPosition = positionStack.pop() ?? pointSequence[i].position.copy();
            }
            else {
                prevHeading = v.heading();
                prevPosition = pointSequence[i].position.copy();
            }
        }
        console.log(axiom)
        return axiom;
    }

    static String2PointSequence(p: p5, string: Symbol[], startingPoint: p5.Vector, scale: number, startingHeading: number, alphabet: string): Point[] {
        if (string.length == 0) return [];

        let position = startingPoint.copy();
        let pointSequence: Point[] = [
            { position: startingPoint.copy(), push: false, pop: false, char: string[0].char }
        ];
        let heading = startingHeading;
        let positionStack: p5.Vector[] = [];
        let headingStack: number[] = [];
        for (let i = 0; i < string.length; i++) {
            let symbol = string[i];
            if (alphabet.includes(symbol.char)) {
                let v = p.createVector(symbol.params[0], 0).rotate(heading).mult(scale);
                position.add(v);
                pointSequence.push({ position: position.copy(), push: false, pop: false, char: symbol.char });
            }
            if (symbol.char == '+') {
                heading += symbol.params[0];
            }
            if (symbol.char == '[') {
                positionStack.push(position.copy());
                headingStack.push(heading);
                pointSequence[pointSequence.length - 1].push = true;
            }
            if (symbol.char == ']') {
                position = positionStack.pop() ?? position.copy();
                heading = headingStack.pop() ?? heading;
                pointSequence[pointSequence.length - 1].pop = true;
            }

        }
        return pointSequence;
    }

    static SerializeProductions(productions: Production[]): string {
        if (productions.length == 0) return JSON.stringify([]);
        let str = '';
        for (let i = 0; i < productions.length; i++) {
            let production = productions[i];
            str += production.preChar + '_:_';
            str += production.condition.toString() + '_:_';
            str += production.successor.toString() + '_;_';
        }
        console.log('Serialize', str)
        return str;
    }

    static DeserializeProductions(str: string): Production[] {
        if (str == '') return [];
        let productions: Production[] = [];
        let productionStrs = str.split('_;_');
        for (let i = 0; i < productionStrs.length; i++) {
            let productionStr = productionStrs[i];
            if (productionStr == '') continue;

            let production: Production = {
                preChar: '',
                condition: (params: number[]) => true,
                successor: (params: number[]) => []
            };
            let parts = productionStr.split('_:_');
            production.preChar = parts[0];
            production.condition = eval('(' + parts[1] + ')');
            production.successor = eval('(' + parts[2] + ')');
            productions.push(production);
        }
        return productions;
    }
}