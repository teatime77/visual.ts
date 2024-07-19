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

export class Arrow extends Shape {
    pos : Vec3 = Vec3.nan();
    vec : Vec3 = Vec3.nan();
    color : string;
    points : Vec2[] = [];

    constructor(view : View, pos : Vec3, vec : Vec3, color : string){
        super(view);
        this.pos = pos;
        this.vec = vec;
        this.color = color;
    }
    
    setProjection() : void{
        const st = this.view.project(this.pos);
        const ed = this.view.project(this.pos.add(this.vec));

        this.center = st.add(ed).mul(0.5);

        const st2 = new Vec2(st.x, st.y);
        const ed2 = new Vec2(ed.x, ed.y);


        // 矢印の向き
        const e1 = (new Vec2(ed.x - st.x, ed.y - st.y)).unit();

        // 矢印の向きから90°回転
        const e2 = e1.rot90();

        // 矢印の向きから150°回転
        const e3 = e1.rot(Math.PI * 5 / 6);

        // 矢印の正三角形の辺の長さ
        const l1 = 20;

        // 矢印の正三角形の辺の1/3の長さ
        const l2 = l1 / 3;

        const p1 = ed2.add(e3.mul(l1));

        const p2 = p1.add( e2.mul(-l2) );

        const p3 = st2.add(e2.mul(l1 / 6));

        const p4 = st2.add(e2.mul(- l1 / 6));

        const p5 = p1.add(e2.mul(-l1 * 2 / 3));

        const p6 = p1.add(e2.mul(-l1));

        this.points = [ ed2, p1, p2, p3, p4, p5, p6 ];
    }



    draw() : void {
        const ctx = this.view.ctx;

        ctx.beginPath();
        for(const [i, p] of this.points.entries()){
            if(i == 0){

                ctx.moveTo(p.x, p.y);
            }
            else{

                ctx.lineTo(p.x, p.y);
            }
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

}