import type p5 from 'p5'

export interface Symbol{
    char: string;
    params: number[];
}

export interface Production{
    preChar: string;
    condition: (params: number[]) => boolean;
    successor: (params: number[]) => Symbol[];
}

export interface DrawingRule{
    targetChar: string;
    drawing: (params: number[], p : p5) => void;
}

export interface LSystem{
    axiom: Symbol[];
    productions: Production[];
    drawingRules: DrawingRule[];
}