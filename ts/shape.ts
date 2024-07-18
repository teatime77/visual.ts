namespace visualts {

export abstract class Shape {
    view : View;
    abstract draw() : void;

    constructor(view : View){
        this.view = view;
    }
}

abstract class Primitive extends Shape {

}

class Polygon extends Primitive {
    draw() : void {
        const ctx = this.view.ctx;
        
        ctx.beginPath();
        ctx.moveTo(75, 50);
        ctx.lineTo(100, 75);
        ctx.lineTo(100, 25);
        ctx.fill();        
    }
}

type Fnc = (num: number) => number;
type Data = number[] | Fnc;

export class Graph extends Shape {
    xs : Float32Array = new Float32Array();
    ys : Data[] = [];
    

    constructor(view : View){
        super(view);

        this.ys.push(Math.sin);
    }

    addData(y : Data){
        this.ys.push(y);
    }

    setMinMax(){

    }

    draw() : void {
    }

}

export class Axis extends Shape {
    min : number = NaN;
    max : number = NaN;

    constructor(view : View){
        super(view);
    }

    draw() : void {
    }
}

}