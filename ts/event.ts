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
}

}