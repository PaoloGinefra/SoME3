import { Symbol, Production, DrawingRule, LSystem } from "./GPLS_interfaces";
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
    static drawString(p: p5, string: Symbol[], drawingRules: DrawingRule[], t: number = 1) {
        let stepOffset = 1
        let offset = -stepOffset;

        let offsetPeriod = 1
        for (let i = 0; i < string.length; i++) {
            let symbol = string[i];
            if (symbol.char == '(')
                offset += stepOffset;
            else if (symbol.char == ')')
                offset -= stepOffset;

            for (let j = 0; j < drawingRules.length; j++) {
                let drawingRule = drawingRules[j];
                if (drawingRule.targetChars.includes(symbol.char)) {
                    drawingRule.drawing(symbol.params, p, p.constrain(t - offset, 0, 1));
                    break;
                }
            }

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
}