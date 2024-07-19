namespace visualts {

enum DataType {
    One,
    Two,
    Three
}

class Data {

    dims : number[] = [];
    stride : number = 1;
    dt : Float32Array = new Float32Array();

    // at(i : number){
    //     return this.dt[i];
    // }

    // at2(i : number, j : number){
    //     return this.dt[i * this.stride + j];
    // }
}


class Data1x1 extends Data {
    at(i:number) : number {
        return this.dt[i];
    }
}

class Data1x2 extends Data {
    at(i:number) : [number, number] {
        const offset = 2 * i;
        return [ this.dt[offset], this.dt[offset + 1] ];
    }
}

class Data2x1 extends Data {
    at(i:number, j:number) : number {
        const offset = i * this.dims[0] + j;
        return this.dt[offset];
    }
}

class Data2x2 extends Data {
    at(i:number, j:number) : [number, number] {
        const base = 2 * (i * this.dims[0] + j);
        return [this.dt[base], this.dt[base + 1]];
    }
}


class Data3x1 extends Data {
    at(i:number, j:number, k:number) : number {
        const base = (i * this.dims[0] + j) * this.dims[1] + k;
        return this.dt[base];
    }
}

class Data3x2 extends Data {
    at(i:number, j:number, k:number) : [number, number] {
        const base = 2 * ( (i * this.dims[0] + j) * this.dims[1] + k );
        return [this.dt[base], this.dt[base + 1]];
    }
}


export abstract class Shape {
    view : View;
    center : Vec3 = new Vec3(NaN, NaN, NaN);

    abstract draw() : void;
    abstract setProjection() : void;

    constructor(view : View){
        this.view = view;
    }
}

abstract class Primitive extends Shape {

}

/**
 * @description 2D散布図
 */
class Scatter2x0 extends Shape {
    make(X : Data1x2){
        for(const i of range(X.dims[0])){
            const [x, y] = X.at(i);
            this.view.addPoint(x, y, 0);
        }
    }

    setProjection() : void{        
        throw new MyError();
    }

    draw(): void {
        throw new MyError();
    }
}

/**
 * @description 2D円散布図/3D散布図
 */
class Scatter2x1 extends Shape {
    make(X : Data1x2, Y : Data1x1){
        for(const i of range(X.dims[0])){
            const [x, y] = X.at(i);
            const z = Y.at(i);


        }
    }

    setProjection() : void{        
        throw new MyError();
    }

    draw(): void {
        throw new MyError();
    }
}

/**
 * @description 曲線
 */
class Mesh1x1 extends Shape {
    make(X : Data1x1, Y : Data1x1){
        for(const i of range(X.dims[0])){
            const x = X.at(i);
            const y = Y.at(i);
        }
    }

    setProjection() : void{        
        throw new MyError();
    }

    draw(): void {
        throw new MyError();
    }
}

/**
 * @description 曲面
 */
class Mesh2x1 extends Shape {
    make(X : Data2x2, Y : Data2x1){
        assert(Y.dims.length == 2);
        for(const i of range(Y.dims[0])){
            for(const j of range(Y.dims[1])){
                const [x, y] = X.at(i, j);
                const z = Y.at(i, j);
            }
        }
    }

    setProjection() : void{        
        throw new MyError();
    }

    draw(): void {
        throw new MyError();
    }
}

/**
 * @description 2Dベクトル場/色付き曲面
 */
class Mesh2x2 extends Shape {
    make(X : Data2x2, Y : Data2x2){
        assert(Y.dims.length == 2);
        for(const i of range(Y.dims[0])){
            for(const j of range(Y.dims[1])){
                const [x, y] = X.at(i, j);
                const [u, v] = Y.at(i, j);
            }
        }
    }

    setProjection() : void{        
        throw new MyError();
    }

    draw(): void {
        throw new MyError();
    }
}

class Polygon extends Primitive {
    points : Vec3[] = [];

    setProjection() : void{        
        throw new MyError();
    }

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

export class Graph extends Shape {
    xs : Float32Array = new Float32Array();
    

    constructor(view : View){
        super(view);
    }

    setMinMax(){

    }

    setProjection() : void{        
        throw new MyError();
    }

    draw() : void {
        throw new MyError();
    }

}

export class Axis extends Shape {
    min : number = NaN;
    max : number = NaN;

    constructor(view : View){
        super(view);
    }

    setProjection() : void{        
        throw new MyError();
    }

    draw() : void {
        throw new MyError();
    }
}

}