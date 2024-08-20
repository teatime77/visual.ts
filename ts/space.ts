namespace visualts {
//
/*
図形
・球
・直方体
・立方体
・正四面体

交点



*/

function sortPoints(p1 : Vec3, p2 : Vec3, p3 : Vec3) : [Vec3, Vec3, Vec3] {
    const v12 = p2.sub(p1);
    const v13 = p3.sub(p1);

    const norm = v12.cross(v13);

    if(0 < p1.dot(norm)){
        return [ p1, p2, p3 ];
    }
    else{
        return [ p1, p3, p2 ];
    }

}

function makeRegularIcosahedron(view : View) : [Triangle[], number] {
    var G = (1 + Math.sqrt(5)) / 2;

    // 頂点のリスト
    var points = [
        new Vec3( 1,  G,  0), // 0
        new Vec3( 1, -G,  0), // 1
        new Vec3(-1,  G,  0), // 2
        new Vec3(-1, -G,  0), // 3

        new Vec3( 0,  1,  G), // 4
        new Vec3( 0,  1, -G), // 5
        new Vec3( 0, -1,  G), // 6
        new Vec3( 0, -1, -G), // 7

        new Vec3( G,  0,  1), // 8
        new Vec3(-G,  0,  1), // 9
        new Vec3( G,  0, -1), // 10
        new Vec3(-G,  0, -1), // 11
    ];

    /*
0 2 4
2 0 5
0 4 8
5 0 10
0 8 10
3 1 6
1 3 7
6 1 8
1 7 10
8 1 10
4 2 9
2 5 11
9 2 11
3 6 9
7 3 11
3 9 11
4 6 8
6 4 9
7 5 10
5 7 11        
    */

    var sphere_r = points[0].len();

    assert(points.every(x => Math.abs(sphere_r - x.len()) < 0.001));


    // 三角形のリスト
    var triangles : Triangle[] = []

    for (let i1 = 0; i1 < points.length - 2; i1++) {
        const p1 = points[i1];

        for (let i2 = i1 + 1; i2 < points.length - 1; i2++) {
            const p2 = points[i2];

            if (Math.abs(p1.dist(p2) - 2) < 0.01) {
                for (let i3 = i2 + 1; i3 < points.length; i3++) {
                    const p3 = points[i3];

                    if (Math.abs(p2.dist(p3) - 2) < 0.01 && Math.abs(p1.dist(p3) - 2) < 0.01) {


                        const tri = new Triangle(sortPoints(p1, p2, p3));

                        tri.material = [1, 1, 1];
                        tri.setColor(view);
                        triangles.push(tri);
                    }
                }
            }
        }
    }
    assert(triangles.length == 20);

    return [ triangles, sphere_r];
}

function divideTriangle(view : View, triangles : Triangle[], sphere_r : number) : Triangle[]{
    const edgeToMidPoint : { [carName: string]: Vec3 } = {};

    const new_triangles : Triangle[] = [];

    for(const tri of triangles){
        const mid_points : Vec3[] = [];
        for(let i1 = 0; i1 < 3; i1++){
            const p1 = tri.points3D[i1];
            const p2 = tri.points3D[(i1 + 1) % 3];
            let key = p1.id < p2.id ? `${p1.id}:${p2.id}` : `${p2.id}:${p1.id}`;

            let mid_point : Vec3 | undefined = edgeToMidPoint[key];
            if(mid_point == undefined){
                mid_point = p1.midPoint(p2);
                mid_point = mid_point.mul(sphere_r / mid_point.len());
                edgeToMidPoint[key] = mid_point;
            }

            mid_points.push(mid_point);
        }

        {
            const [p1, p2, p3] = tri.points3D;
            const [m1, m2, m3] = mid_points;

            const tri1 = new Triangle(sortPoints(m1, p2, m2));
            const tri2 = new Triangle(sortPoints(m2, p3, m3));
            const tri3 = new Triangle(sortPoints(m3, p1, m1));
            const tri4 = new Triangle(sortPoints(m1, m2, m3));

            for(const t of [tri1, tri2, tri3, tri4]){
                const p = t.points3D[0];
                const r = Math.round(Math.max(0, Math.min(255, 255 * (p.x + sphere_r) / (2 * sphere_r))));
                const g = Math.round(Math.max(0, Math.min(255, 255 * (p.y + sphere_r) / (2 * sphere_r))));
                const b = Math.round(Math.max(0, Math.min(255, 255 * (p.z + sphere_r) / (2 * sphere_r))));
                t.color = `rgb(${r} ${g} ${b} / 80%)`;
                // t.material = [1, 1, 1];
                // t.setColor();
            }

            new_triangles.push(tri1, tri2, tri3, tri4);
        }
    }

    return new_triangles;
}

export function makeGeodesicPolyhedron(view : View){
    makeAxis(view);

    let [triangles, sphere_r] = makeRegularIcosahedron(view);

    for(const i of range(2)){
        triangles = divideTriangle(view, triangles, sphere_r);
    }

    const scale = 5;
    triangles.forEach(tri => tri.points3D.forEach(p => p.mul(scale)));

    view.shapes.push(...triangles);

}

}