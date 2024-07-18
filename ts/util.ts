namespace visualts {

const $dic = new Map<string, HTMLElement>();

export function $(id : string) : HTMLElement {
    let ele = $dic.get(id);
    if(ele == undefined){
        ele = document.getElementById(id)!;
        $dic.set(id, ele);
    }

    return ele;
}

export function $inp(id : string) : HTMLInputElement {
    return $(id) as HTMLInputElement;
}
        
export class MyError extends Error {
    constructor(text : string = ""){
        super();
    }
}

export function assert(b : boolean, msg : string = ""){
    if(!b){
        throw new MyError(msg);
    }
}    

export function msg(txt : string){
    console.log(txt);
}

export function range(n: number) : number[]{
    return [...Array(n).keys()];
}

export function last<T>(v : Array<T>) : T {
    return v[v.length - 1];
}

export function unique<T>(v : Array<T>) : T[] {
    let set = new Set<T>();
    const ret : T[] = [];
    for(const x of v){
        if(!set.has(x)){
            set.add(x);
            ret.push(x);
        }
    }
    return ret;
}

export function remove<T>(v : Array<T>, x : T){
    const idx = v.indexOf(x);
    assert(idx != undefined);
    v.splice(idx, 1);
}



export function sum(v : number[]) : number {
    return v.reduce((acc, cur) => acc + cur, 0);
}


}