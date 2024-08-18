namespace visualts {

export function bodyOnLoad(){
    const canvas = $("canvas") as HTMLCanvasElement;
    aView = new View(canvas);

    $("view-item").addEventListener("change", onChange)
    msg("hello");

    makeBall();
    window.requestAnimationFrame(aView.drawShapes.bind(aView));
}

export function viewEvent(view : View){
    view.canvas.addEventListener("pointerdown", view.pointerdown.bind(view));
    view.canvas.addEventListener('pointermove', view.pointermove.bind(view));
    view.canvas.addEventListener("pointerup"  , view.pointerup.bind(view));   

    // Passive event listeners
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    view.canvas.addEventListener("wheel"      , view.wheel.bind(view), {"passive" : true } );

    $inp("theta").addEventListener("change", (ev:Event)=>{
        view.camTheta = toRadian(parseInt($inp("theta").value));
        view.updateEye();
    });

    $inp("phi").addEventListener("change", (ev:Event)=>{
        view.camPhi = toRadian(parseInt($inp("phi").value));
        view.updateEye()
    });

    $inp("eye-x").addEventListener("change", (ev:Event)=>{
        view.eye.x = parseFloat($inp("eye-x").value);
        view.updateViewMatrix()
    });

    $inp("eye-y").addEventListener("change", (ev:Event)=>{
        view.eye.y = parseFloat($inp("eye-y").value);
        view.updateViewMatrix()
    });

    $inp("eye-z").addEventListener("change", (ev:Event)=>{
        view.eye.z = parseFloat($inp("eye-z").value);
        view.updateViewMatrix()
    });


}

}