namespace visualts {

let view : View;

class View {
    canvas : HTMLCanvasElement;
    ctx    : CanvasRenderingContext2D;
    eye    : Vec3;

    camDistance : number = 5;
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

        canvas.addEventListener("pointerdown", this.pointerdown.bind(this));
        canvas.addEventListener('pointermove', this.pointermove.bind(this));
        canvas.addEventListener("pointerup"  , this.pointerup.bind(this));   
        canvas.addEventListener("wheel"      , this.wheel.bind(this) );

        this.ctx.fillStyle = "rgb(200 0 0)";
        this.ctx.fillRect(10, 10, 50, 50);

        this.ctx.fillStyle = "rgb(0 0 200 / 50%)";
        this.ctx.fillRect(30, 30, 50, 50);
    }

    updateEye(){
        this.eye.z = this.camDistance * Math.cos(this.camTheta);
        const r = this.camDistance * Math.sin(this.camTheta);

        this.eye.x = r * Math.cos(this.camPhi);
        this.eye.y = r * Math.sin(this.camPhi);
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
    }

    pointerup(ev : PointerEvent){
        this.lastMouseX = NaN;
        this.lastMouseY = NaN;
    }

    wheel(ev : WheelEvent){
        // ホイール操作によるスクロールを無効化する
        ev.preventDefault();
    
        this.camDistance += 0.002 * ev.deltaY;
    }
    

    drawCircle(centerX : number, centerY : number, radius : number){
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        // this.ctx.fillStyle = 'green';
        // this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'red';
        this.ctx.stroke();       
    }
}

function makeBall(){
    const r1 = 5;

    const left = -8;
    const right = 8;
    const bottom = -8;
    const top = 8;
    const near = 3;
    const far = 15;

    const m1 = frustum(left, right, bottom, top, near, far);
    m1.print();

    for(const i of range(8)){
        const th = Math.PI * i / 8;
        const z  = 8 + r1 * Math.cos(th);
        const r2 = r1 * Math.sin(th);

        for(const j  of range(16)){
            const ph = 2 * Math.PI * j / 16;
            const x = r2 * Math.cos(ph);
            const y = r2 * Math.sin(ph);

            const v = new Vec3(x, y, z).to4();
            v.print();

            const w = m1.dot(v).to3();
            w.print();
            msg("");

            const cx = 300 + w.x * 200;
            const cy = 300 + w.y * 200;
            view.drawCircle(cx, cy, 5);
        }
    }
}

export function bodyOnLoad(){
    const canvas = $("canvas") as HTMLCanvasElement;
    view = new View(canvas);
    msg("hello");
    makeBall();
}
}