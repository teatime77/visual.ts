namespace visualts {

export let aView : View;

export class View {
    canvas : HTMLCanvasElement;
    ctx    : CanvasRenderingContext2D;

    canvasHalfW : number;
    canvasHalfH : number;

    shapes : Shape[] = [];

    lightDir = new Vec3(0, 0, 1);

    FoV : number = toRadian(60);
    tanHalfFoV : number = Math.tan(0.5 * this.FoV);
    aspectRatio : number;

    eye    : Vec3;
    eyeR!  : Mat3;
    target : Vec3 = new Vec3(0, 0, 0);

    camDistance : number = 30;
    camTheta : number = 0;
    camPhi   : number = 0;

    camThetaSave : number = 0;
    camPhiSave   : number = 0;

    lastMouseX : number = NaN;
    lastMouseY : number = NaN;

    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas;
        this.eye    = new Vec3(0, 0, - this.camDistance)
        this.ctx = canvas.getContext("2d")!;
        assert(this.ctx != null);

        const rc = canvas.getBoundingClientRect();
        this.canvasHalfW = rc.width  / 2;
        this.canvasHalfH = rc.height / 2;

        this.aspectRatio = rc.width / rc.height;

        this.updateEye();

        viewEvent(this);
    }

    drawShapes(){
        this.clear();

        this.shapes.forEach(c => c.setProjection());    
        this.shapes.sort((a:Shape, b:Shape)=> b.centerZ - a.centerZ);

        this.shapes.forEach(c => c.draw());    

        window.requestAnimationFrame(this.drawShapes.bind(this));
    }

    clear(){
        const rc = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rc.width, rc.height);
    }

    updateEye(){
        this.eye = new Vec3(0, 0, - this.camDistance).rotY(this.camPhi).rotX(this.camTheta);

        $inp("eye-x").value = this.eye.x.toFixed();
        $inp("eye-y").value = this.eye.y.toFixed();
        $inp("eye-z").value = this.eye.z.toFixed();

        this.updateViewMatrix();
    }

    updateViewMatrix(){
        // 視点の上向き
        const up = new Vec3(0, 1, 0);

        const ez = this.target.sub(this.eye).unit();
        const ex = up.cross(ez).unit();
        const ey = ez.cross(ex);

        this.eyeR = new Mat3([
            [ ex.x, ex.y, ex.z ],
            [ ey.x, ey.y, ey.z ],
            [ ez.x, ez.y, ez.z ],
        ]);
    }

    pointerdown(ev : PointerEvent){
        this.lastMouseX = ev.clientX;
        this.lastMouseY = ev.clientY;

        this.camThetaSave = this.camTheta;
        this.camPhiSave   = this.camPhi;
    }

    pointermove(ev : PointerEvent){
        // タッチによる画面スクロールを止める
        ev.preventDefault(); 

        if(ev.buttons == 0 || isNaN(this.lastMouseX)){
            return;
        }


        var newX = ev.clientX;
        var newY = ev.clientY;

        this.camTheta = this.camThetaSave + (newY - this.lastMouseY) / 300;
        this.camPhi   = this.camPhiSave + (newX - this.lastMouseX) / 300;

        $inp("theta").value = Math.round(toDegree(this.camTheta)).toFixed();
        $inp("phi").value = Math.round(toDegree(this.camPhi)).toFixed();

        this.updateEye();
    }

    pointerup(ev : PointerEvent){
        this.lastMouseX = NaN;
        this.lastMouseY = NaN;
    }

    wheel(ev : WheelEvent){
        this.camDistance += 0.002 * ev.deltaY;
        $inp("eye-z").value = Math.round(this.camDistance).toFixed();

        this.updateEye();
    }

    project(pos : Vec3) : Vec3 {
        const pos2 = this.eyeR.dot(pos.sub(this.eye));

        // height = distance * tan(0.5 * FoV) 
        const h1 = Math.abs(pos2.z) * this.tanHalfFoV;
        const w1 = h1 * this.aspectRatio;

        const y = this.canvasHalfH - this.canvasHalfH * pos2.y / h1;
        const x = this.canvasHalfW + this.canvasHalfW * pos2.x / w1;

        return new Vec3(x, y, pos2.z);
    }

    addPoint(x: number, y: number, z:number, color : string = "black"){
        const circle = new Circle(this, new Vec3(x, y, z), 1, color);
        this.shapes.push(circle);
    }
}

export function colorStr(r : number, pos : Vec3){
    const v1 = [pos.x, pos.y, pos.z].map(x => 0.5 * (1 + Math.max(-r , Math.min(r, x)) / r) );
    assert(v1.every(x => 0 <= x && x <= 1));

    const v2 = v1.map(x => Math.floor(255 * x));
    assert(v2.every(x => 0 <= x && x <= 255));

    return `rgb(${v2[0]} ${v2[1]} ${v2[2]})`
}

export function makeAxis(){
    aView.shapes = [];

    const axis_len = 5.0;
    const x_axis = new Arrow(aView, Vec3.zero(), new Vec3(axis_len, 0, 0), "red");
    const y_axis = new Arrow(aView, Vec3.zero(), new Vec3(0, axis_len, 0), "green");
    const z_axis = new Arrow(aView, Vec3.zero(), new Vec3(0, 0, axis_len), "blue");

    aView.shapes.push(x_axis, y_axis, z_axis);
}

export function makeBall(){
    aView.shapes = [];
    
    const r1 = 5;

    const n1 = 16;
    const n2 = 32;

    for(const i of range(n1)){
        const th = Math.PI * i / n1;
        const z  = r1 * Math.cos(th);
        const r2 = r1 * Math.sin(th);

        for(const j  of range(n2)){
            const ph = 2 * Math.PI * j / n2;
            const x = r2 * Math.cos(ph);
            const y = r2 * Math.sin(ph);

            const pos = new Vec3(x, y, z);
            const color = colorStr(r1, pos);

            const circle = new Circle(aView, new Vec3(pos.x, pos.y, pos.z), 5, color);
            aView.shapes.push(circle);
        }
    }
}

function makeArrows(){
    aView.shapes = [];
    const r1 = 5;

    const n1 = 8;
    const n2 = 16;

    for(const i of range(n1)){
        const th = Math.PI * i / n1;
        const z  = r1 * Math.cos(th);
        const r2 = r1 * Math.sin(th);

        for(const j  of range(n2)){
            const ph = 2 * Math.PI * j / n2;
            const x = r2 * Math.cos(ph);
            const y = r2 * Math.sin(ph);

            const pos = new Vec3(x, y, z);
            const vec = new Vec3(x, y, z);
            const color = colorStr(r1, pos);

            const arrow = new Arrow(aView, pos, vec, color);
            aView.shapes.push(arrow);
        }
    }
}

function makeWave(){
    const r1 = 5;
    const n = 32;

    const X = new Array2x2(n, n);
    const Y = new Array2x1(n, n);
    for(const i of range(n)){
        for(const j of range(n)){
            const th  = 2 * Math.PI * i / n - Math.PI;
            const phi = 2 * Math.PI * j / n - Math.PI;
            const x = r1 * th;
            const y = r1 * phi;
            const z = r1 * (Math.cos(th) + Math.sin(phi));

            X.set(i, j, x, y);

            Y.set(i, j, z);
        }    
    }

    const surface = new Surface(X, Y);
    surface.make(aView);
    aView.shapes = surface.polygons;

    // for(const poly of surface.polygons){
    //     const pos  = poly.points3D[1];
    //     const norm = poly.norm().mul(1);

    //     const color = colorStr(r1, pos);
    //     const arrow = new Arrow(view, pos, norm, color);
    //     view.shapes.push(arrow);
    // }

}

export function onChange(){
    msg(`sel:${$sel("view-item").value}`);
    switch($sel("view-item").value){
    case "Ball": makeBall(); break;
    case "Axis": makeAxis(); break;
    case "Arrow": makeArrows(); break;
    case "Wave": makeWave(); break;
    }
}
}