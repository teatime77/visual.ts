namespace visualts {

enum DataType {
    One,
    Two,
    Three
}

class Data {

    dims : number[];
    stride : number = 1;
    dt : Float32Array = new Float32Array();

    constructor(dims : number[]){
        this.dims = dims;
        const size = dims.reduce((acc, cur) => acc * cur, 1);
        this.dt = new Float32Array(size);
    }

    // at(i : number){
    //     return this.dt[i];
    // }

    // at2(i : number, j : number){
    //     return this.dt[i * this.stride + j];
    // }
}

class Pair {

}

class Pair2x2 extends Pair {
    dt : [number, number, number, number][] = [];

    add(x:number, y:number, u:number, v:number){
        this.dt.push([x, y, u, v]);
    }
}

class Pair3x3 extends Pair {
    dt : [number, number, number, number, number, number][] = [];

    add(x:number, y:number, z:number, u:number, v:number, w:number){
        this.dt.push([x, y, z, u, v, w]);
    }
}

class Array1x1 extends Data {
    at(i:number) : number {
        return this.dt[i];
    }
}

class Array1x2 extends Data {
    at(i:number) : [number, number] {
        const offset = 2 * i;
        return [ this.dt[offset], this.dt[offset + 1] ];
    }
}

export class Array2x1 extends Data {
    constructor(m:number, n:number){
        super([m, n, 1]);
    }

    at(i:number, j:number) : number {
        const offset = i * this.dims[0] + j;
        return this.dt[offset];
    }

    set(i:number, j:number, x:number){
        const offset = i * this.dims[0] + j;
        
        this.dt[offset] = x;
    }
}

export class Array2x2 extends Data {
    constructor(m:number, n:number){
        super([m, n, 2]);
    }

    at(i:number, j:number) : [number, number] {
        const base = 2 * (i * this.dims[0] + j);
        return [this.dt[base], this.dt[base + 1]];
    }
    
    set(i:number, j:number, x:number, y:number){
        const base = 2 * (i * this.dims[0] + j);
 
        this.dt[base    ] = x;
        this.dt[base + 1] = y;
    }
}


class Array3x1 extends Data {
    at(i:number, j:number, k:number) : number {
        const base = (i * this.dims[0] + j) * this.dims[1] + k;
        return this.dt[base];
    }
}

class Array3x2 extends Data {
    at(i:number, j:number, k:number) : [number, number] {
        const base = 2 * ( (i * this.dims[0] + j) * this.dims[1] + k );
        return [this.dt[base], this.dt[base + 1]];
    }
}

class Array3x3 extends Data {
    at(i:number, j:number, k:number) : [number, number, number] {
        const base = 3 * ( (i * this.dims[0] + j) * this.dims[1] + k );
        return [this.dt[base], this.dt[base + 1], this.dt[base + 2]];
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
    make(X : Array1x2){
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
    make(X : Array1x2, Y : Array1x1){
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
    make(X : Array1x1, Y : Array1x1){
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
    make(X : Array2x2, Y : Array2x1){
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
    make(X : Array2x2, Y : Array2x2){
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
    points3D : Vec3[] = [];
    points2D : Vec2[] = [];
    color : string;

    constructor(view : View, color : string = "black"){
        super(view);
        this.color = color;
    }

    setProjection() : void{        
        const vs = this.points3D.map(x => this.view.project(x));

        const x = sum(vs.map(p => p.x));
        const y = sum(vs.map(p => p.y));
        const z = sum(vs.map(p => p.z));
        this.center = new Vec3(x / vs.length, y / vs.length, z / vs.length);

        this.points2D = vs.map(p => new Vec2(p.x, p.y));
    }

    draw() : void {
        const ctx = this.view.ctx;

        ctx.beginPath();
        for(const [i, p] of this.points2D.entries()){
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

export class Arrow extends Polygon {
    pos : Vec3 = Vec3.nan();
    vec : Vec3 = Vec3.nan();

    constructor(view : View, pos : Vec3, vec : Vec3, color : string){
        super(view, color);
        this.pos = pos;
        this.vec = vec;
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

        this.points2D = [ ed2, p1, p2, p3, p4, p5, p6 ];
    }
}

export class Surface extends Shape {
    X : Array2x2;
    Y : Array2x1;
    polygons : Polygon[] = [];

    constructor(view : View, X : Array2x2, Y : Array2x1){
        super(view);
        this.X = X;
        this.Y = Y;
    }

    make(){
        for(const i of range(this.X.dims[0] - 1)){
            for(const j of range(this.X.dims[1] - 1)){
                const [x00, y00] = this.X.at(i    , j    );
                const [x01, y01] = this.X.at(i    , j + 1);
                const [x10, y10] = this.X.at(i + 1, j    );
                const [x11, y11] = this.X.at(i + 1, j + 1);

                const z00 = this.Y.at(i    , j    );
                const z01 = this.Y.at(i    , j + 1);
                const z10 = this.Y.at(i + 1, j    );
                const z11 = this.Y.at(i + 1, j + 1);

                const p00 = new Vec3(x00, y00, z00);
                const p01 = new Vec3(x01, y01, z01);
                const p10 = new Vec3(x10, y10, z10);
                const p11 = new Vec3(x11, y11, z11);

                const polygon = new Polygon(this.view);
                polygon.points3D = [p00, p10, p11, p01];

                this.polygons.push(polygon);
            }
        }
    }

    setProjection() : void{        
        this.polygons.forEach(p => p.setProjection());
    }

    draw(): void {
        this.polygons.forEach(p => p.draw());
    }

}

}