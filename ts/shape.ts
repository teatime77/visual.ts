namespace visualts {

class Data {

    dims : number[];
    dt : Float32Array = new Float32Array();

    constructor(dims : number[]){
        this.dims = dims;
        const size = dims.reduce((acc, cur) => acc * cur, 1);
        this.dt = new Float32Array(size);
    }
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
    static maxId = 0;
    id : number;
    centerZ : number = NaN;

    abstract draw(view : View) : void;
    abstract setProjection(view : View) : void;

    constructor(view : View){
        this.id = Shape.maxId++;
        view = view;
    }
}

abstract class Primitive extends Shape {

}

/**
 * @description 2D散布図
 */
class Scatter2x0 extends Shape {
    make(view : View, X : Array1x2){
        for(const i of range(X.dims[0])){
            const [x, y] = X.at(i);
            view.addPoint(x, y, 0);
        }
    }

    setProjection(view : View) : void{        
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

    setProjection(view : View) : void{        
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

    setProjection(view : View) : void{        
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

    setProjection(view : View) : void{        
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

    setProjection(view : View) : void{        
        throw new MyError();
    }

    draw(): void {
        throw new MyError();
    }
}

export class Circle extends Shape {
    pos : Vec3;
    posPrj : Vec3 = Vec3.nan();
    radius : number;
    color : string;

    constructor(view : View, pos : Vec3, radius : number, color : string){
        super(view);
        this.pos = pos;
        this.radius = radius;
        this.color = color;
    }

    setProjection(view : View) : void{        
        this.posPrj = view.project(this.pos);
        this.centerZ = this.posPrj.z;
    }

    draw(view : View) : void {
        const ctx = view.ctx;
        
        ctx.beginPath();
        ctx.arc(this.posPrj.x, this.posPrj.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.stroke();       
    }
}

class Polygon extends Primitive {
    points3D : Vec3[];
    points2D : Vec2[] = [];
    material : [number, number, number] = [0, 0, 0];
    color : string = "black";

    constructor(view : View, points3d : Vec3[], color : string = "black"){
        super(view);
        this.points3D = points3d.slice();
        this.color = color;
    }

    setProjection(view : View) : void{        
        const vs = this.points3D.map(x => view.project(x));

        const z = sum(vs.map(p => p.z));
        this.centerZ = z / vs.length;

        this.points2D = vs.map(p => new Vec2(p.x, p.y));
    }

    draw(view : View) : void {
        const ctx = view.ctx;

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
        ctx.strokeStyle = this.color;
        ctx.stroke();       
    }

    norm() : Vec3 {
        const a = this.points3D[2].sub(this.points3D[1]);
        const b = this.points3D[0].sub(this.points3D[1]);

        return a.cross(b).unit();
    }

    setColor(view : View){
        const l = this.norm().dot(view.lightDir);
        const rgb = this.material.map(x => Math.max(0, Math.min(255, 255 * x * l)).toFixed() );
        this.color = `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;

    }
}

export class Triangle extends Polygon {
    constructor(view : View, points3d:Vec3[], color : string = "black"){
        super(view, points3d, color);
    }

    setColor(view : View){
        const l = this.norm().dot(view.lightDir);
        const rgb = this.material.map(x => Math.max(0, Math.min(255, 255 * x * l)).toFixed() );
        this.color = `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;

    }

}

export class Graph extends Shape {
    xs : Float32Array = new Float32Array();
    

    constructor(view : View){
        super(view);
    }

    setMinMax(){

    }

    setProjection(view : View) : void{        
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

    setProjection(view : View) : void{        
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
        super(view, [], color);
        this.pos = pos;
        this.vec = vec;
    }
    
    setProjection(view : View) : void{
        const st = view.project(this.pos);
        const ed = view.project(this.pos.add(this.vec));

        this.centerZ = (st.z + ed.z) / 2;

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

        // 正三角形の高さ
        const h = l1 * Math.sqrt(3) / 2;

        const len = ed2.sub(st2).len();
        if(len < h){

            // 正三角形の底辺の1/2
            const d = h / Math.sqrt(3);

            const p3 = st2.add(e2.mul(d));

            const p4 = st2.add(e2.mul(- d));

            this.points2D = [ ed2, p3, p4 ];
        }
        else{

            const p1 = ed2.add(e3.mul(l1));

            const p2 = p1.add( e2.mul(-l2) );

            const p3 = st2.add(e2.mul(l1 / 6));

            const p4 = st2.add(e2.mul(- l1 / 6));

            const p5 = p1.add(e2.mul(-l1 * 2 / 3));

            const p6 = p1.add(e2.mul(-l1));

            this.points2D = [ ed2, p1, p2, p3, p4, p5, p6 ];
        }

    }
}

export class Surface {
    X : Array2x2;
    Y : Array2x1;
    polygons : Polygon[] = [];

    constructor(X : Array2x2, Y : Array2x1){
        this.X = X;
        this.Y = Y;
    }

    make(view : View){
        const min = Math.min(... this.Y.dt);
        const max = Math.max(... this.Y.dt);

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

                const polygon = new Polygon(view, [p00, p10, p11, p01]);

                const z = sum([z00, z01, z10, z11]) / 4;
                const n = (z - min) / (max - min);

                polygon.material = pseudoColor(n);
                polygon.setColor(view);

                this.polygons.push(polygon);
            }
        }
    }
}

}