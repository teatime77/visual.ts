namespace visualts {

export class Vec2 {
    static maxId = 0;
    id : number;
    typeName: string = "Vec2";
    x: number;
    y: number;

    constructor(x:number, y: number){
        this.id = Vec2.maxId++;
        this.x = x;
        this.y = y;
    }

/*+++
    app() : App {
        return new App(operator("vec"), [new ConstNum(this.x), new ConstNum(this.y)]);
    }
*/

    copy(){
        return new Vec2(this.x, this.y);
    }

    equals(pt: Vec2): boolean {
        return this.x == pt.x && this.y == pt.y;
    }

    add(pt: Vec2) : Vec2{
        return new Vec2(this.x + pt.x, this.y + pt.y);
    }

    sub(pt: Vec2) : Vec2{
        return new Vec2(this.x - pt.x, this.y - pt.y);
    }

    mul(c: number) : Vec2 {
        return new Vec2(c * this.x, c * this.y);
    }

    len2(): number {
        return this.x * this.x + this.y * this.y;
    }

    len(): number {
        return Math.hypot(this.x, this.y);
    }

    dist(pt:Vec2) : number {
        const dx = pt.x - this.x;
        const dy = pt.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    dot(pt:Vec2) : number{
        return this.x * pt.x + this.y * pt.y;
    }

    unit() : Vec2{
        const d = this.len();

        if(d == 0){

            return new Vec2(0, 0);
        }

        return new Vec2(this.x / d, this.y / d);
    }

    divide(t: number, pt: Vec2) : Vec2 {
        const x = (1 - t) * this.x + t * pt.x;
        const y = (1 - t) * this.y + t * pt.y;

        return new Vec2(x, y);
    }

    rot(th : number) : Vec2 {
        const cs = Math.cos(th);
        const sn = Math.sin(th);

        return new Vec2(this.x * cs - this.y * sn, this.x * sn + this.y * cs);
    }

    rot90() : Vec2 {
        return new Vec2(- this.y, this.x);
    }

    rot45() : Vec2 {
        const cs = Math.cos(Math.PI / 4);

        return new Vec2(cs * (this.x - this.y), cs * (this.x + this.y));
    }

}

export class Vec3 extends Vec2 {
    typeName: string = "Vec3";
    z: number;

    static nan() : Vec3 {
        return new Vec3(NaN, NaN, NaN);
    }

    static zero() : Vec3 {
        return new Vec3(0, 0, 0);
    }

    static ex() : Vec3 {
        return new Vec3(1, 0, 0);
    }

    static ey() : Vec3 {
        return new Vec3(0, 1, 0);
    }

    static ez() : Vec3 {
        return new Vec3(0, 0, 1);
    }

    static fromArray(v:number[]) : Vec3 {
        return new Vec3(v[0], v[1], v[2]);
    }

    constructor(x:number, y: number, z: number){
        super(x, y);
        this.z = z;
    }

    to4() : Vec4 {
        return new Vec4(this.x, this.y, this.z, 1);
    }

    str(){
        return `[ ${this.x.toFixed(1)}, ${this.y.toFixed(1)}, ${this.z.toFixed(1)}  ]`;
    }

    copy(){
        return new Vec3(this.x, this.y, this.z);
    }

    equals(pt: Vec3): boolean {
        return this.x == pt.x && this.y == pt.y && this.z == pt.z;
    }

    add(pt: Vec3) : Vec3{
        return new Vec3(this.x + pt.x, this.y + pt.y, this.z + pt.z);
    }

    sub(pt: Vec3) : Vec3{
        return new Vec3(this.x - pt.x, this.y - pt.y, this.z - pt.z);
    }

    mul(c: number) : Vec3 {
        return new Vec3(c * this.x, c * this.y, c * this.z);
    }

    len(): number {
        return Math.hypot(this.x, this.y, this.z);
    }

    len2(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    dist(pt:Vec3) : number {
        return Math.hypot(pt.x - this.x, pt.y - this.y, pt.z - this.z);
    }

    dot(pt:Vec3) : number{
        return this.x * pt.x + this.y * pt.y + this.z * pt.z;
    }

    unit() : Vec3{
        const d = this.len();

        if(d == 0){

            return new Vec3(0, 0, 0);
        }

        return new Vec3(this.x / d, this.y / d, this.z / d);
    }

    midPoint(pt:Vec3) : Vec3 {
        return new Vec3((this.x + pt.x) / 2, (this.y + pt.y) / 2, (this.z + pt.z) / 2);
    }

    divide(t: number, pt: Vec3) : Vec3 {
        const x = (1 - t) * this.x + t * pt.x;
        const y = (1 - t) * this.y + t * pt.y;
        const z = (1 - t) * this.z + t * pt.z;

        return new Vec3(x, y, z);
    }

    rotX(th : number) : Vec3 {
        return Mat3.rotX(th).dot(this);
    }

    rotY(th : number) : Vec3 {
        return Mat3.rotY(th).dot(this);
    }

    rotZ(th : number) : Vec3 {
        return Mat3.rotZ(th).dot(this);
    }

    cross(v : Vec3) : Vec3 {
        return new Vec3(
            this.y * v.z - this.z * v.y, 
            this.z * v.x - this.x * v.z, 
            this.x * v.y - this.y * v.x
        );
    }
}

export class Vec4 extends Vec3 {
    typeName: string = "Vec4";
    w: number;

    constructor(x:number, y: number, z: number, w: number){
        super(x, y, z);
        this.w = w;
    }

    print(){
        msg(`[ ${this.x.toFixed(1)}, ${this.y.toFixed(1)}, ${this.z.toFixed(1)}, ${this.w.toFixed(1)}  ]`);
    }

    normalize() : Vec4 {
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
        this.w = 1;

        return this;
    }

    to3() : Vec3 {
        this.normalize();
        return new Vec3(this.x, this.y, this.z);
    }
}

export class Mat {
    dt: (number[])[];

    constructor(dt: (number[])[] | undefined = undefined){
        this.dt = this.zeroDt();

        if(dt == undefined){
            return;
        }
        for(let i = 0; i < dt.length; i++){
            for(let j = 0; j < dt[0].length; j++){
                this.dt[i][j] = dt[i][j];
            }
        }
    }

    dim(){
        return [ NaN, NaN];
    }

    zeroDt(){
        let [nrow, ncol] = this.dim();
        return range(nrow).map(x => range(ncol).map(y => 0) );
    }

    zeros() : Mat {
        if(this instanceof Mat2){
            return new Mat2(this.zeroDt());

        }
        else if(this instanceof Mat3){
            return new Mat3(this.zeroDt());
            
        }
        else if(this instanceof Mat4){
            return new Mat4(this.zeroDt());            
        }

        throw new MyError();
    }

    copy() : Mat2 | Mat3{
        let [nrow, ncol] = this.dim();
        let m : Mat2 | Mat3 = (nrow == 3 ? new Mat3() : new Mat2());

        for(let r = 0; r < nrow; r++){
            for(let c = 0; c < ncol; c++){
                m.dt[r][c] = this.dt[r][c];
            }
        }

        return m;
    }

    print(name:string = ""){
        if(name != ""){
            msg(`${name} = [`)
        }
        else{
            msg("[");
        }

        let [nrow, ncol] = this.dim();
        for(let r = 0; r < nrow; r++){
            let s = this.dt[r].map(x => x.toFixed(5)).join(", ");
            msg(`\t[ ${s} ]`);
        }
    }

    mul(x : Mat | number) : Mat {
        let [nrow, ncol] = this.dim();

        if(typeof(x) == "number"){
            let m = this.copy();
            for(let r = 0; r < nrow; r++){
                for(let c = 0; c < ncol; c++){
                    m.dt[r][c] *= x;
                }
            }
    
            return m;
        }
        else{
            let m = this.zeros();

            for(let r = 0; r < nrow; r++){
                for(let c = 0; c < ncol; c++){
                    let sum = 0;

                    for(let k = 0; k < ncol; k++){
                        sum += this.dt[r][k] * x.dt[k][c];
                    }

                    m.dt[r][c] = sum;
                }
            }
    
            return m;
        }
    }
}

export class Mat2 extends Mat {
    dim(){
        return [2,2];
    }

    det(){
        return this.dt[0][0] * this.dt[1][1] - this.dt[0][1] * this.dt[1][0];
    }

    dot(v:Vec2) : Vec2{
        return new Vec2(this.dt[0][0] * v.x + this.dt[0][1] * v.y, this.dt[1][0] * v.x + this.dt[1][1] * v.y);
    }

    inv() : Mat2 {
        const det = this.det();
        console.assert(det != 0);

        return new Mat2([[this.dt[1][1] / det, - this.dt[0][1] / det], [- this.dt[1][0] / det, this.dt[0][0] / det]])
    }
}

export class Mat3 extends Mat {
    static rotX(th : number) : Mat3 {
        const m = new Mat3();
        m.dt[0][0] = 1;

        m.dt[1][1] =   Math.cos(th);
        m.dt[1][2] = - Math.sin(th);
    
        m.dt[2][1] = Math.sin(th);
        m.dt[2][2] = Math.cos(th);
    
        return m;
    }

    static rotY(th : number) : Mat3 {
        const m = new Mat3();
        m.dt[0][0] = Math.cos(th);
        m.dt[0][2] = Math.sin(th);

        m.dt[1][1] = 1;

        m.dt[2][0] = - Math.sin(th);
        m.dt[2][2] =   Math.cos(th);
    
    
        return m;
    }

    static rotZ(th : number) : Mat3 {
        const m = new Mat3();
        m.dt[0][0] =   Math.cos(th);
        m.dt[0][1] = - Math.sin(th);
    
        m.dt[1][0] = Math.sin(th);
        m.dt[1][1] = Math.cos(th);
    
        m.dt[2][2] = 1;
        return m;
    }

    dim(){
        return [3,3];
    }

    dot(v:Vec3) : Vec3 {
        return new Vec3(
            dot3(this.dt[0], v), 
            dot3(this.dt[1], v), 
            dot3(this.dt[2], v), 
        );
    }
    

    det(){
        return (
            this.dt[0][0] * (this.dt[1][1] * this.dt[2][2] - this.dt[1][2] * this.dt[2][1]) +
            this.dt[0][1] * (this.dt[1][2] * this.dt[2][0] - this.dt[1][0] * this.dt[2][2]) +
            this.dt[0][2] * (this.dt[1][0] * this.dt[2][1] - this.dt[1][1] * this.dt[2][0])
        );
        /*
        00 01 02 
        10 11 12
        20 21 22
        */
    }

    minor(){
        let m = new Mat3();

        for(let r = 0; r < 3; r++){
            let ri! : number[];

            switch(r){
                case 0: ri = [ 1, 2]; break;
                case 1: ri = [ 2, 0]; break;
                case 2: ri = [ 0, 1]; break;
            }

            for(let c = 0; c < 3; c++){

                let ci! : number[];
                switch(c){
                    case 0: ci = [ 1, 2]; break;
                    case 1: ci = [ 2, 0]; break;
                    case 2: ci = [ 0, 1]; break;
                }

                let a = this.dt[ri[0]][ci[0]] * this.dt[ri[1]][ci[1]] - this.dt[ri[0]][ci[1]] * this.dt[ri[1]][ci[0]];
                m.dt[r][c] = a;
            }
        }

        return m;
    }

    // forEach(fnc:(r:number,c:number)=>void){
    //     for(let r = 0; r < 3; r++){
    //         for(let c = 0; c < 3; c++){
    //             fnc(r,c);
    //         }
    //     }
    // }

    inv(){
        let d = this.det();
        let m = this.minor();

        let n = new Mat3([
            [ m.dt[0][0], m.dt[1][0], m.dt[2][0] ],
            [ m.dt[0][1], m.dt[1][1], m.dt[2][1] ],
            [ m.dt[0][2], m.dt[1][2], m.dt[2][2] ],
        ]);

        return n.mul(1/d);
    }
}

function dot3(a:number[], b : Vec3){
    return a[0] * b.x + a[1] * b.y + a[2] * b.z;
}

function dot4(a:number[], b : Vec4){
    return a[0] * b.x + a[1] * b.y + a[2] * b.z + a[3] * b.w;
}

export class Mat4 extends Mat {
    dim(){
        return [4,4];
    }

    t() : Mat4 {
        const m = new Mat4();
        for(const i of range(4)){
            for(const j of range(4)){
                m.dt[i][j] = this.dt[j][i];
            }
        }

        return m;
    }

    dot(v:Vec4){
        return new Vec4(
            dot4(this.dt[0], v), 
            dot4(this.dt[1], v), 
            dot4(this.dt[2], v), 
            dot4(this.dt[3], v)
        );
    }

    str(){
        return this.dt.map(row => `[ ${row.map(x => x.toFixed(1)).join(", ") } ]`).join("\n");
    }
}

}