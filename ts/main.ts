var glMatrix: any;

namespace visualts {

let view : View;

export class View {
    canvas : HTMLCanvasElement;
    ctx    : CanvasRenderingContext2D;
    eye    : Vec3;

    min = new Vec2(NaN, NaN);
    max = new Vec2(NaN, NaN);

    camDistance : number = 5;
    camTheta : number = 0;
    camPhi   : number = 0;

    camThetaSave : number = 0;
    camPhiSave   : number = 0;

    lastMouseX : number = NaN;
    lastMouseY : number = NaN;

    ProjViewMatrix!               : Float32Array;
    viewMatrix!        : Float32Array;

    frustum : Mat4;

    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas;
        this.eye    = new Vec3(0, 0, - this.camDistance)
        this.ctx = canvas.getContext("2d")!;
        assert(this.ctx != null);

        canvas.addEventListener("pointerdown", this.pointerdown.bind(this));
        canvas.addEventListener('pointermove', this.pointermove.bind(this));
        canvas.addEventListener("pointerup"  , this.pointerup.bind(this));   
        canvas.addEventListener("wheel"      , this.wheel.bind(this) );

        this.ctx.fillStyle = "rgb(200 0 0)";
        this.ctx.fillRect(10, 10, 50, 50);

        this.ctx.fillStyle = "rgb(0 0 200 / 50%)";
        this.ctx.fillRect(30, 30, 50, 50);

        this.frustum = this.makeFrustum();
        msg(`frustum\n${this.frustum.str()}`);
    }

    makeFrustum(){
        const left = -8;
        const right = 8;
        const bottom = -8;
        const top = 8;
        const near = 3;
        const far = 15;
    
        return frustum(left, right, bottom, top, near, far);
    }

    clear(){
        const rc = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rc.width, rc.height);
    }

    updateEye(){
        this.eye.z = this.camDistance * Math.cos(this.camTheta);
        const r = this.camDistance * Math.sin(this.camTheta);

        this.eye.x = r * Math.cos(this.camPhi);
        this.eye.y = r * Math.sin(this.camPhi);

        // msg(`theta:${(this.camTheta * 180 / Math.PI).toFixed(1)} phi:${(this.camPhi * 180 / Math.PI).toFixed(1)}`)
        msg(`eye:${this.eye.str()}`);
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
        this.camPhi   = this.camPhiSave - (newX - this.lastMouseX) / 300;

        $inp("theta").value = Math.round(this.camTheta * 180 / Math.PI).toFixed();
        $inp("phi").value = Math.round(this.camPhi * 180 / Math.PI).toFixed();

        this.updateEye();
    }

    pointerup(ev : PointerEvent){
        this.lastMouseX = NaN;
        this.lastMouseY = NaN;
    }

    wheel(ev : WheelEvent){
        // ホイール操作によるスクロールを無効化する
        ev.preventDefault();
    
        this.camDistance += 0.002 * ev.deltaY;
        this.updateEye();
    }
    

    drawCircle(centerX : number, centerY : number, radius : number, color : string = "red"){
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();       
    }


    getTransformationMatrix() {

        this.setViewMatrix();

        const projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, 1, 1, 100.0);

        this.ProjViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.mul(this.ProjViewMatrix, projectionMatrix, this.viewMatrix);
    }
    
    setViewMatrix() {
        const camY = this.camDistance * Math.cos(this.camTheta);
        const r = this.camDistance * Math.abs(Math.sin(this.camTheta));
        const camZ = r * Math.cos(this.camPhi);
        const camX = r * Math.sin(this.camPhi);

        this.viewMatrix = glMatrix.mat4.create();
        const cameraPosition = [camX, camY, camZ];
        const lookAtPosition = [0, 0, 0];
        const upDirection    = [0, 1, 0];
        glMatrix.mat4.lookAt(this.viewMatrix, cameraPosition, lookAtPosition, upDirection);
    }

    project(pos : Vec3) : Vec3 {
        const w = pos.rotX(this.camTheta).rotY(this.camPhi).sub(this.eye);

        w.x /= - 0.4 * w.z;
        w.y /= - 0.4 * w.z;

        return w;
    }

}

class Circle {
    pos : Vec3;
    color : string;

    constructor(pos : Vec3, color : string){
        this.pos = pos;
        this.color = color;
    }
}

function colorStr(r : number, pos : Vec3){
    const v1 = [pos.x, pos.y, pos.z].map(x => 0.5 * (1 + Math.max(-r , Math.min(r, x)) / r) );
    assert(v1.every(x => 0 <= x && x <= 1));

    const v2 = v1.map(x => Math.floor(255 * x));
    assert(v2.every(x => 0 <= x && x <= 255));

    return `rgb(${v2[0]} ${v2[1]} ${v2[2]})`
}

function makeBall(){
    view.clear();

    view.camTheta = parseInt( $inp("theta").value ) * Math.PI / 180;
    view.camPhi   = parseInt( $inp("phi").value ) * Math.PI / 180;
    view.getTransformationMatrix();

    // view.updateEye();
    view.eye.x = parseInt( $inp("eye-x").value );
    view.eye.y = parseInt( $inp("eye-y").value );
    view.eye.z = parseInt( $inp("eye-z").value );


    const r1 = 5;

    const circles : Circle[] = [];

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

            if(false){
                const v3 = new Float32Array([x, y, z]);
                const out = new Float32Array(3);
                glMatrix.vec3.transformMat4(out, v3, view.ProjViewMatrix);
    
                view.drawCircle(320 + out[0], 320 + out[1], 5);
                continue;    
            }

            const pos = new Vec3(x, y, z);
            const color = colorStr(r1, pos);

            let w : Vec3;

            if(true){
                w = view.project(pos);
                // w = pos.rotX(view.camTheta).rotY(view.camPhi).sub(view.eye);
                // w.x /= - 0.4 * w.z;
                // w.y /= - 0.4 * w.z;
            }
            else{
                const pos2 = pos.sub(view.eye);
                assert(pos2.z < 0);
    
                if(true){

                    w = pos2;
                    w.x /= - 0.4 * w.z;
                    w.y /= - 0.4 * w.z;
                }
                else{


                    const v = pos2.to4();

                    w = view.frustum.dot(v).to3();
                    if(w.x < -1 || 1 < w.x || w.y < -1 || 1 < w.y || w.z < -1 || 1 < w.z){
                        continue;
                    }
                }
            }


            const cx = 320 + w.x * 320;
            const cy = 320 + w.y * 320;
            const circle = new Circle(new Vec3(cx, cy, w.z), color);
            circles.push(circle);
            // view.drawCircle(cx, cy, 5, color);
        }
    }

    circles.sort((a:Circle, b:Circle)=> a.pos.z - b.pos.z);

    circles.forEach(c => view.drawCircle(c.pos.x, c.pos.y, 5, c.color));

    window.requestAnimationFrame(makeBall);
}

export function bodyOnLoad(){
    const canvas = $("canvas") as HTMLCanvasElement;
    view = new View(canvas);
    msg("hello");

    window.requestAnimationFrame(makeBall);
}
}