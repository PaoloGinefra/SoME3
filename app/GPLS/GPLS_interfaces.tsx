import type p5 from 'p5'

export interface Symbol {
    char: string;
    params: number[];
}

export interface Production {
    preChar: string;
    condition: (params: number[]) => boolean;
    successor: (params: number[]) => Symbol[];
}

export interface DrawingRule {
    targetChars: string;
    drawing: (params: number[], p: p5, t?: number) => void;
}

export interface LSystem {
    axiom: Symbol[];
    productions: Production[];
    drawingRules: DrawingRule[];
}