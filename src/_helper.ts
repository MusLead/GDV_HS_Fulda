import Framebuffer from "./framebuffer";

export type Vec3 = [number, number, number];

export type Vec4 = [number, number, number, number];

export type Matrix3 = [
    number, number, number,
    number, number, number,
    number, number, number
]

export type Matrix4 = [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
];

export interface ISphere {
    center: Vec3;
    radius: number;
    color: number[];
}

export interface ILight {
    intensity: number;
    position: Vec3;
}

export function vecAdd(a: Vec3, b: Vec3): Vec3 {
    return a.map((val, i) => val + b[i]) as Vec3;
}

/**
 * (Aufgabe Part_1)
 * @param p 
 * @param dist 
 * @returns 
 */
export function perspDivide(p: Array<number>, dist: number): Array<number> {
    return [(dist* p[0])/p[2], (dist*p[1])/p[2], dist];
}

/**
 * (Aufgabe Part_1)
 * @param v point of the ray
 * @param o origin point
 * @param t_dist 
 * @returns 
 */
export function rayEquationCalc(v: Array<number>, o:Array<number>, t_dist: number): Vec3 {
    return [(v[0] - o[0])*t_dist + o[0], (v[1] - o[1])*t_dist + o[1], (v[2] - o[2])*t_dist + o[2]];
}

/**
 * Multiply a 1x3 vector with a 3x3 matrix (Aufgabe Part_1)
 * @param v 3 Coordinates of a vector
 * @param m one dimensional array representing a 3x3 matrix with length 9
 * @returns the new vector
 */
export function multVecMatrix(v: Array<number>, m: Array<number>){
    if(v.length !== 3 || m.length !== 9) throw new Error("Invalid input");
    return [
        v[0] * m[0] + v[1] * m[3] + v[2] * m[6],
        v[0] * m[1] + v[1] * m[4] + v[2] * m[7],
        v[0] * m[2] + v[1] * m[5] + v[2] * m[8]
    ]
    /*
    In the task above, we ended up using a matrix to transform our point. This matrix is called a transformation matrix.

    "Transformation" is just a word for function or formula - send data in, get an output.

    The transformation type is linear because: all lines remain lines, parallel lines remain parallel and the origin stays fixed in space.
    */
}

/**
 * Multiply a vector with a 4x4 matrix (Aufgabe Linear_Algebra 1)
 * @param v 3 Coordinates of a vector
 * @param m one dimensional array representing a 4x4 matrix with length 16
 * @returns the new vector
 */
export function vecLength(v: Array<number>) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}

/**
 * Give a vector its length into 1 (Aufgabe Linear_Algebra 1)
 * @param v 
 * @returns 
 */
export function vecNormalize(v: Vec3) : Vec3{
    return v.map((x) => vecLength(v) === 0 ? 1 : x/vecLength(v)) as Vec3;
}

/**
 * Vector Dot Product (Aufgabe Linear_Algebra 1)
 * @param a 
 * @param b 
 * @returns 
 */
export function vecDotProduct(a: Array<number>, b: Array<number>){
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

/**
 * Vector Cross Product (Aufgabe Linear_Algebra 1)
 * @param a 
 * @param b 
 * @returns 
 */
export function vecCrossProduct(a: Array<number>, b: Array<number>){
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ];
}

/**
 * Product of two matrrix (Aufgabe Linear_Algebra 2)
 * @param a matrix 3x3
 * @param b matrix 3x3
 * @returns multiplied matrix
 */
export function matrixProduct(a: Array<number>, b: Array<number>){
    if(a.length !== 9 || b.length !== 9) throw new Error("Invalid input");
    return [
        a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
        a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
        a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
        a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
        a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
        a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
        a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
        a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
        a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
    ];
}

/**
 * rotate a vector around the x-axis (Aufgabe Linear_Algebra 2)
 * @param angle in degrees
 * @returns rotated matrix around x-axis
 */
export function rotX(angle: number){
    const rad = angle * (Math.PI/180);
    return [
        1,       0,             0,
        0, Math.cos(rad), Math.sin(rad),
        0, -Math.sin(rad), Math.cos(rad)
    ] as Matrix3;
}

/**
 * rotate a vector around the y-axis (Aufgabe Linear_Algebra 2)
 * @param angle in degrees
 * @returns rotated matrix around y-axis
 */
export function rotY(angle: number){
    const rad = angle * (Math.PI/180);
    return [
        Math.cos(rad), 0, -Math.sin(rad),
        0,             1,       0,
        Math.sin(rad), 0, Math.cos(rad)
    ] as Matrix3;
}

/**
 * rotate a vector around the z-axis (Aufgabe Linear_Algebra 2)
 * @param angle in degrees
 * @returns rotated matrix around z-axis
 */
export function rotZ(angle: number){
    const rad = angle * (Math.PI/180);
    return [
        Math.cos(rad), Math.sin(rad), 0,
        -Math.sin(rad), Math.cos(rad), 0,
        0,                  0,        1
    ] as Matrix3;  
}

 
// Revision: swap second row, so that the answer might be correct?
/**
 * Function to apply a shear transformation to a 3Dpoint
 * @param point a point x,y,z
 * @param shearMatrix shear matrix 1D array with length 9
 * @returns a shared x,y,z point
 */
//FIXME: The shear matrix is not correct, compare with multVecMatrix!
export function shearPoint(point: number[], shearMatrix: number[]): number[] {
    return [
        shearMatrix[0] * point[0] + shearMatrix[1] * point[1] + shearMatrix[2] * point[2],
        shearMatrix[6] * point[0] + shearMatrix[7] * point[1] + shearMatrix[8] * point[2],
        shearMatrix[3] * point[0] + shearMatrix[4] * point[1] + shearMatrix[5] * point[2]
    ];
}

/**
 * Homogenous coordinates (Aufgabe Linear_Algebra 2)
 * Matrix x Vector
 * @param v 
 * @param m 
 * @returns 
 */
export function multVec3Matrix4_transpose(v: Vec3, m: Matrix4):Vec4 {
    const v4 = [v[0], v[1], v[2], 1];
    return [
        v4[0] * m[0] + v4[1] * m[1] + v4[2] * m[2] + v4[3] * m[3],
        v4[0] * m[4] + v4[1] * m[5] + v4[2] * m[6] + v4[3] * m[7],
        v4[0] * m[8] + v4[1] * m[9] + v4[2] * m[10] + v4[3] * m[11],
        v4[0] * m[12] + v4[1] * m[13] + v4[2] * m[14] + v4[3] * m[15]
    ];
}

/**
 * Homogenous coordinates (Aufgabe Linear_Algebra 2)
 * Vector x Matrix
 * @param v 
 * @param m 
 * @returns 
 */
export function multVec3Matrix4(v: Vec3, m: Matrix4): Vec4 {
    const v4: Vec4 = [v[0], v[1], v[2], 1]

    // For our use case, we could also just return a Vec3
    return [
        v4[0] * m[0] + v4[1] * m[4] + v4[2] * m[8] + v4[3] * m[12],
        v4[0] * m[1] + v4[1] * m[5] + v4[2] * m[9] + v4[3] * m[13],
        v4[0] * m[2] + v4[1] * m[6] + v4[2] * m[10] + v4[3] * m[14],
        v4[0] * m[3] + v4[1] * m[7] + v4[2] * m[11] + v4[3] * m[15],
    ]
}


/**
 * Multiply a vector with a 4x4 matrix (Aufgabe Linear_Algebra 2)
 * @param a 
 * @param b 
 * @returns 
 */
export function matrix4Product(a: Matrix4, b: Matrix4):Matrix4 {
    return [
        a[0]*b[0] + a[1]*b[4] + a[2]*b[8] + a[3]*b[12],
        a[0]*b[1] + a[1]*b[5] + a[2]*b[9] + a[3]*b[13],
        a[0]*b[2] + a[1]*b[6] + a[2]*b[10] + a[3]*b[14],
        a[0]*b[3] + a[1]*b[7] + a[2]*b[11] + a[3]*b[15],
        
        a[4]*b[0] + a[5]*b[4] + a[6]*b[8] + a[7]*b[12],
        a[4]*b[1] + a[5]*b[5] + a[6]*b[9] + a[7]*b[13],
        a[4]*b[2] + a[5]*b[6] + a[6]*b[10] + a[7]*b[14],
        a[4]*b[3] + a[5]*b[7] + a[6]*b[11] + a[7]*b[15],
        
        a[8]*b[0] + a[9]*b[4] + a[10]*b[8] + a[11]*b[12],
        a[8]*b[1] + a[9]*b[5] + a[10]*b[9] + a[11]*b[13],
        a[8]*b[2] + a[9]*b[6] + a[10]*b[10] + a[11]*b[14],
        a[8]*b[3] + a[9]*b[7] + a[10]*b[11] + a[11]*b[15],
        
        a[12]*b[0] + a[13]*b[4] + a[14]*b[8] + a[15]*b[12],
        a[12]*b[1] + a[13]*b[5] + a[14]*b[9] + a[15]*b[13],
        a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14],
        a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]
    ];
}

export function matrix3ToMatrix4(m: Matrix3): Matrix4 {
    return [
        m[0], m[1], m[2], 0,
        m[3], m[4], m[5], 0,
        m[6], m[7], m[8], 0,
          0,    0,   0,   1
    ];
}

export function vecMultiplyScalar(scalar: number, v: Vec3): Vec3 {
    return v.map(value => value * scalar) as Vec3;
}

/**
 * TODO: write the documentation!
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 * @param z usually the value is negative...
 * @returns 
 */
export function rasterToNDC(x: number, y: number, width: number, height: number, z: number): Vec3 {
    return [
        (x + 0.5) / width,
        (y + 0.5) / height,
        z
    ];
}

export function ndcToScreen(x: number, y: number, z: number): Vec3 {
    return [
        (2 * x - 1),
        1 - 2 * y,
        z
    ];
}

export function ndcToScreenVec(vector: Vec3): Vec3 {
    return [
        2 * vector[0] - 1,
        1 - 2 * vector[1],
        vector[2]
    ];
}

/**
 * 
 * @param x 
 * @param y 
 * @param width the width of the screen
 * @param height the height of the screen
 * @param z usually the value is negative
 * @returns 
 */
export function rasterToScreenSpace(x: number, y: number, width: number, height: number, z: number): Vec3 {
    return ndcToScreenVec(rasterToNDC(x, y, width, height, z));
}

export function easeInOutBounce(x: number): number {
    return x < 0.5
      ? (1 - easeOutBounce(1 - 2 * x)) / 2
      : (1 + easeOutBounce(2 * x - 1)) / 2;
}

export function easeOutBounce(x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

/**
 * (Aufgabe Ray_Tracing2)
 * This funciton calculate the intersection of a ray and a sphere
 * if the discriminant is negative, there is no intersection 
 * between the ray and the sphere
 * 
 * For more intuitive and graphical explanation, please see rayTracing1.ts 
 * For the basis of the formula, please see rayEquation.ts 
 * 
 * @param v point of the ray respected to the image plane
 * @param o the origin point of the ray
 * @param sphere the sphere object
 * @returns two values of t, which are the intersection points
 */
export function raySphereIntersect(v: Vec3, o: Vec3, sphere: ISphere): [number, number] {
    
    const co = o.map((o_val, i) => o_val - sphere.center[i])
    const ov = v.map((v_val, i) => v_val - o[i])
    
    const a = vecDotProduct(ov, ov)
    const b = vecDotProduct(co, ov) * 2
    const c = vecDotProduct(co, co) - Math.pow(sphere.radius, 2) 
    
    const discriminant = b * b - 4 * a * c
    
    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a)
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a)
    
    return [t1, t2]
}

/**
 * (Aufgabe Ray_Tracing2)
 * @returns 
 */
export function lighting(surfPosition: Vec3, surfNormal: Vec3, lights: ILight[]
    //parameters for surface position, normal and array of lights
) {
    let intensity = 0.0;

    lights.forEach(light => {
        const pLight = surfPosition.map((val, i) => light.position[i] - val)
        const incidentVec = vecNormalize(pLight as Vec3) // <--- normalized vector from light to surface
       
        const dotP = vecDotProduct(surfNormal,incidentVec)// <--- dot product between surface normal and incident vector 

        if (dotP > 0) {
            intensity += light.intensity * dotP // <--- scale the lights intensity with the dot product
        }
    });

    return intensity;
}

export function vecSubtract(a: Vec3, b: Vec3): Vec3 {
    return a.map((val, i) => val - b[i]) as Vec3;
}

/**
 * (Aufgabe Ray_Tracing3)
 * @param vTransformed 
 * @param oTransformed 
 * @param tNear 
 * @param tFar 
 * @param spheres 
 * @returns closestSphere and closestIntersection
 */
export function getClosestSphereAndIntersection(vTransformed: Vec3, oTransformed: Vec3, tNear: number = 1, tFar: number = 1000, spheres: ISphere[]) {
    let closestSphere = null;
    let closestIntersection = 9999;

    for (let i = 0; i < spheres.length; i++) {

        const [t1, t2] = raySphereIntersect(
            vTransformed,
            oTransformed,
            spheres[i] as ISphere); // <--- Calculate intersections

        if (t1 < closestIntersection && tNear < t1 && t1 < tFar) {
            closestIntersection = t1;
            closestSphere = spheres[i];
        }

        if (t2 < closestIntersection && tNear < t2 && t2 < tFar) {
            closestIntersection = t2;
            closestSphere = spheres[i];
        }
    }
    return { closestSphere, closestIntersection };
}

/**
 * (Aufgabe RayTracing3)
 * @param surfPosition 
 * @param surfNormal 
 * @param lights 
 * @param spheres all spheres represents objects and floor
 * @returns the intensity of each position coordinate
 */
export function lightingWithShadows(surfPosition: Vec3, surfNormal: Vec3, lights: ILight[], spheres: ISphere[]) {
    let intensity = 0.0;

    lights.forEach(light => {
        
        const { closestSphere } = getClosestSphereAndIntersection(
            light.position,
            surfPosition,
            0.01,
            1,
            spheres
        );

         // If in shadow, skip to next light
        if (!closestSphere) {
            const pLight = surfPosition.map((val, i) => light.position[i] - val)
            const incidentVec = vecNormalize(pLight as Vec3) // <--- normalized vector from light to surface
            const dotP = vecDotProduct(surfNormal,incidentVec)// <--- dot product between surface normal and incident vector 

            if (dotP > 0) {
                intensity += light.intensity * dotP // <--- scale the lights intensity with the dot product
            }   
        }

    });


    return intensity;
}

/**
 * 
 * @param surfPosition 
 * @param surfNormal 
 * @param lights 
 * @param spheres 
 * @param viewDirection 
 * @param specExponent by default it is 1
 * @returns 
 */
export function lightingWithShadowsSpec(surfPosition: Vec3, surfNormal: Vec3, lights: ILight[], spheres: ISphere[], viewDirection: Vec3, specExponent: number = 1) {
    let intensity = 0.0;

    lights.forEach(light => {
        
        const { closestSphere } = getClosestSphereAndIntersection(
            light.position,
            surfPosition,
            0.01,
            1,
            spheres
        );

         // If in shadow, skip to next light
        if (!closestSphere) {
            const pLight = surfPosition.map((val, i) => light.position[i] - val)
            const incidentVec = vecNormalize(pLight as Vec3) // <--- normalized vector from light to surface
            const dotP = vecDotProduct(surfNormal,incidentVec)// <--- dot product between surface normal and incident vector 

            if (dotP > 0) {
                intensity += light.intensity * dotP // <--- scale the lights intensity with the dot product
            }   

            const reflected = vecReflect(incidentVec, surfNormal);

            const minusNormViewDirection = vecNormalize(viewDirection.map(val => -val) as Vec3);
            const vDotReflected = vecDotProduct(minusNormViewDirection, vecNormalize(reflected));

            if (vDotReflected > 0) {
                intensity +=
                    light.intensity *
                    Math.pow(vDotReflected, specExponent);
            }
        }
    });

    return intensity;
}
export function vecReflect(incident: Vec3, normal: Vec3):Vec3 {    
    return incident.map((val, i) => val - 2 * normal[i] * vecDotProduct(incident, normal)) as Vec3;
}

/**
 * (Aufgabe Linear_Algebra 3)
 */
export type Matrix2 = [
    number, number,
    number, number,
]

/**
 * (Aufgabe Linear_Algebra 3)
 */
export function matrix2Determinant(m: Matrix2) {
    return m[0] * m[3] - m[1] * m[2]
}

/**
 * (Aufgabe Linear_Algebra 3)
 */
export function matrix3Determinant(m: Matrix3) {
    const m1: Matrix2 = [
        m[4], m[5],
        m[7], m[8]
    ]
    const m2: Matrix2 = [
        m[3], m[5],
        m[6], m[8]
    ]
    const m3: Matrix2 = [
        m[3], m[4],
        m[6], m[7]
    ]

    return m[0] * matrix2Determinant(m1) - m[1] * matrix2Determinant(m2) + m[2] * matrix2Determinant(m3)

}

/**
 * (Aufgabe Linear_Algebra 3)
 */
export function matrix4Determinant(m: Matrix4) {
    const m1: Matrix3 = [
        m[5], m[6], m[7],
        m[9], m[10], m[11],
        m[13], m[14], m[15]
    ]
    const m2: Matrix3 = [
        m[4], m[6], m[7],
        m[8], m[10], m[11],
        m[12], m[14], m[15]
    ]
    const m3: Matrix3 = [
        m[4], m[5], m[7],
        m[8], m[9], m[11],
        m[12], m[13], m[15]
    ]
    const m4: Matrix3 = [
        m[4], m[5], m[6],
        m[8], m[9], m[10],
        m[12], m[13], m[14]
    ]

    return m[0] * matrix3Determinant(m1) -
        m[1] * matrix3Determinant(m2) +
        m[2] * matrix3Determinant(m3) -
        m[3] * matrix3Determinant(m4)
}

/**
 * (Aufgabe Linear_Algebra 3)
 */
export function matrix3Invert(m: Matrix3) {

    // Create matrix of minors
    const detM00 = matrix2Determinant([m[4], m[5], m[7], m[8]]);
    const detM01 = matrix2Determinant([m[3], m[5], m[6], m[8]]);
    const detM02 = matrix2Determinant([m[3], m[4], m[6], m[7]]);

    const detM10 = matrix2Determinant([m[1], m[2], m[7], m[8]]);
    const detM11 = matrix2Determinant([m[0], m[2], m[6], m[8]]);
    const detM12 = matrix2Determinant([m[0], m[1], m[6], m[7]]);

    const detM20 = matrix2Determinant([m[1], m[2], m[4], m[5]]);
    const detM21 = matrix2Determinant([m[0], m[2], m[3], m[5]]);
    const detM22 = matrix2Determinant([m[0], m[1], m[3], m[4]]);

    // Cofactor matrix
    // TODO: create a function of transpose instead writing mAdj manually
    // const mCo = [
    //     detM00, -detM01, detM02,
    //     -detM10, detM11, -detM12,
    //     detM20, -detM21, detM22
    // ]

    // Adjoint matrix (transpose of cofactor matrix)
    const mAdj = [
        detM00, -detM10, detM20,
        -detM01, detM11, -detM21,
        detM02, -detM12, detM22
    ]

    // divide by determinant of original matrix. We mulitply by the inverse
    // so we only divide once:
    const detInv = 1 / matrix3Determinant(m);
    return [
        mAdj[0] * detInv, mAdj[1] * detInv, mAdj[2] * detInv,
        mAdj[3] * detInv, mAdj[4] * detInv, mAdj[5] * detInv,
        mAdj[6] * detInv, mAdj[7] * detInv, mAdj[8] * detInv,
    ]

}

/**
 * (Aufgabe Linear_Algebra 3)
 */
export function matrix4Invert(m: Matrix4):Matrix4 {
    // Create matrix of minors
    const detM00 = matrix3Determinant([
        m[5], m[6], m[7],
        m[9], m[10], m[11],
        m[13], m[14], m[15]
    ]);
    const detM01 = matrix3Determinant([
        m[4], m[6], m[7],
        m[8], m[10], m[11],
        m[12], m[14], m[15]
    ])
    const detM02 = matrix3Determinant([
        m[4], m[5], m[7],
        m[8], m[9], m[11],
        m[12], m[13], m[15]
    ])
    const detM03 = matrix3Determinant([
        m[4], m[5], m[6],
        m[8], m[9], m[10],
        m[12], m[13], m[14]
    ])
    // 
    const detM10 = matrix3Determinant([
        m[1], m[2], m[3],
        m[9], m[10], m[11],
        m[13], m[14], m[15]
    ]);
    const detM11 = matrix3Determinant([
        m[0], m[2], m[3],
        m[8], m[10], m[11],
        m[12], m[14], m[15]
    ]);
    const detM12 = matrix3Determinant([
        m[0], m[1], m[3],
        m[8], m[9], m[11],
        m[12], m[13], m[15]
    ]);
    const detM13 = matrix3Determinant([
        m[0], m[1], m[2],
        m[8], m[9], m[10],
        m[12], m[13], m[14]
    ])
    //
    const detM20 = matrix3Determinant([
        m[1], m[2], m[3],
        m[5], m[6], m[7],
        m[13], m[14], m[15]
    ]);
    const detM21 = matrix3Determinant([
        m[0], m[2], m[3],
        m[4], m[6], m[7],
        m[12], m[14], m[15]
    ]);
    const detM22 = matrix3Determinant([
        m[0], m[1], m[3],
        m[4], m[5], m[7],
        m[12], m[13], m[15]
    ]);
    const detM23 = matrix3Determinant([
        m[0], m[1], m[2],
        m[4], m[5], m[6],
        m[12], m[13], m[14]
    ]);
    //
    const detM30 = matrix3Determinant([
        m[1], m[2], m[3],
        m[5], m[6], m[7],
        m[9], m[10], m[11]
    ]);
    const detM31 = matrix3Determinant([
        m[0], m[2], m[3],
        m[4], m[6], m[7],
        m[8], m[10], m[11]
    ]);
    const detM32 = matrix3Determinant([
        m[0], m[1], m[3],
        m[4], m[5], m[7],
        m[8], m[9], m[11]
    ]);
    const detM33 = matrix3Determinant([
        m[0], m[1], m[2],
        m[4], m[5], m[6],
        m[8], m[9], m[10]
    ]);

    // Cofactor matrix
    // TODO: create a function of transpose instead writing mAdj manually
    // const mCo = [
    //     detM00, -detM01, detM02, -detM03,
    //     -detM10, detM11, -detM12, detM13,
    //     detM20, -detM21, detM22, -detM23,
    //     -detM30, detM31, -detM32, detM33,

    // ]
    // Adjoint matrix
    const mAdj = [
        detM00, -detM10, detM20, -detM30,
        -detM01, detM11, -detM21, detM31,
        detM02, -detM12, detM22, -detM32,
        -detM03, detM13, -detM23, detM33,

    ]

    // divide by determinant of original matrix. We mulitply by the inverse
    // so we only divide once:
    const detInv = 1 / matrix4Determinant(m);
    return [
        mAdj[0] * detInv, mAdj[1] * detInv, mAdj[2] * detInv, mAdj[3] * detInv,
        mAdj[4] * detInv, mAdj[5] * detInv, mAdj[6] * detInv, mAdj[7] * detInv,
        mAdj[8] * detInv, mAdj[9] * detInv, mAdj[10] * detInv, mAdj[11] * detInv,
        mAdj[12] * detInv, mAdj[13] * detInv, mAdj[14] * detInv, mAdj[15] * detInv,

    ]
}

/**
 * (Aufgabe Linear_Algebra 3)
 */
export function matrix4Transpose(m: Matrix4): Matrix4 {
    return [
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15],
    ]

}

/**
 * (Aufgabe Raseterization 1)
 * @param v 
 * @param width 
 * @param height 
 * @returns 
 */
export function screenToRasterspace(v: Vec3, width: number, height: number) {
    // to NDC
    const ndcX = (v[0] + 1) / 2
    const ndcY = (1 - v[1]) / 2

    // to raster
    const rasterX = ndcX * width;
    const rasterY = ndcY * height;
    return [Math.round(rasterX), Math.round(rasterY)]

}

/**
 * (Aufgabe Raseterization 1)
 * this is ray equation approach to draw a line
 * @param start 
 * @param end 
 * @param fb 
 */
export function drawLine(start: Array<number>, end: Array<number>, fb: Framebuffer) {
    let startX = start[0]
    let startY = start[1]
    let endX = end[0]
    let endY = end[1]
    let steep = false;


    if (Math.abs(endX - startX) < Math.abs(endY - startY)) {
        // is steep -> switch x and y
        [startX, startY] = [startY, startX];
        [endX, endY] = [endY, endX]
        steep = true;
    }

    if (startX > endX) {
        [startX, endX] = [endX, startX];
        [startY, endY] = [endY, startY];
    }

    for (let x = startX; x <= endX; x++) {
        const t = (x - startX) / (endX - startX)
        const y = (endY - startY) * t + startY;

        if (steep) {
            //console.info("Is steep")
            fb.draw(Math.round(y), Math.round(x), [0, 200, 0])
        } else {
            //console.info("Is flat")
            fb.draw(Math.round(x), Math.round(y), [200, 0, 0])
        }
    }
}

/**
 * (Aufgabe Rasterization 1)
 * @param start 
 * @param end 
 * @param fb 
 */
export function drawLineBresenham(start: Array<number>, end: Array<number>, fb: Framebuffer) {

    let startX = start[0]
    let startY = start[1]
    let endX = end[0]
    let endY = end[1]
    let steep = false;

    if (Math.abs(endX - startX ) < Math.abs(endY - startY )) {
        [startX, startY] = [startY, startX];
        [endX, endY] = [endY, endX];
        steep = true;
    }

    if (startX > endX) {
        [startX, endX] = [endX, startX];
        [startY, endY] = [endY, startY];
    }

    const dX = Math.abs(endX - startX);
    const dY = Math.abs(endY - startY);

    let error = dX * 0.5; 
    let y = startY;

    for (let x = startX; x <= endX; x++) {
        error -= dY
        
        if (error < 0) {
            // Increment Y depending on slope
            y += endY > startY ? 1 : -1;
            // reset error
            error += dX;
        }

        if (steep) {
            fb.draw(y, x, [0, 200, 0])
        } else {
            fb.draw(x, y, [200, 0, 0])
        }
    }
}

/**
 * Aufgabe Rasterization 1
 * @param origin 
 * @param x 
 * @param y 
 * @returns 
 */
export function determinantFromPoints(origin: number[], x: number[], y: number[]) {
    const m = [
        x[0] - origin[0], x[1] - origin[1],
        y[0] - origin[0], y[1] - origin[1]
    ]

    return matrix2Determinant(m as Matrix2)
}

export function bbox(faceVertices: number[][], width: number, height: number, fb: Framebuffer, show = false) {
    const bboxmin = [width, height]
    const bboxmax = [0, 0]

    for (let v of faceVertices) {
        bboxmin[0] = Math.min(bboxmin[0], v[0]);
        bboxmin[1] = Math.min(bboxmin[1], v[1]);
        bboxmax[0] = Math.max(bboxmax[0], v[0]);
        bboxmax[1] = Math.max(bboxmax[1], v[1]);

    }

    if (show) {

        drawLineBresenham(bboxmin, [bboxmax[0], bboxmin[1]], fb)
        drawLineBresenham(bboxmin, [bboxmin[0], bboxmax[1]], fb)
        drawLineBresenham(bboxmax, [bboxmin[0], bboxmax[1]], fb)
        drawLineBresenham(bboxmax, [bboxmax[0], bboxmin[1]], fb)
    }

    return [bboxmin, bboxmax]
}

/**
 * (Aufgabe Rasterization 2)
 * 04.08.2024 =  Rendering took 4637.000000000001 milliseconds for a frame
 * @param faceVertices 
 * @param dot 
 * @param width 
 * @param height 
 * @param fb 
 */
export function fillTriangle(faceVertices: number[][], dot: number, width: number, height: number, fb: Framebuffer) {

    const a = faceVertices[0];
    const b = faceVertices[1];
    const c = faceVertices[2];

    // const face = determinantFromPoints(a, c, b);
    // const faceArea = 1 / (face * 0.5)

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const p = [x, y]
            
            // let inside = true;
            const apb = determinantFromPoints(a, p, b)
            const bpc = determinantFromPoints(b, p, c)
            const cpa = determinantFromPoints(c, p, a)

            if (apb >= 0 && bpc >= 0 && cpa >= 0) {
                //console.info(apb)
                // const w3 = (apb * 0.5) * faceArea
                // const w1 = (bpc * 0.5) * faceArea
                // const w2 = 1 - w3 - w1

                if (dot <= 0) {
                    fb.draw(p[0], p[1], [0, 0, 0])
                } else {
                    fb.draw(p[0], p[1], [dot * 180, dot * 180, dot * 180])
                }
            }
        }
    }
}

/**
 * (Aufgabe Rasterization 2)
 * using bounding box concept to optimize the rendering time of fillTriangle function
 * 04.08.2024 = Rendering took 29 milliseconds for a frame.
 * @param faceVertices 
 * @param dot 
 * @param width 
 * @param height 
 * @param fb 
 */
export function fillTriangleOptimized(faceVertices: number[][], dot: number, width: number, height: number, fb: Framebuffer, showBox = false) {

    const [bboxmin, bboxmax] = bbox(faceVertices, width, height, fb, showBox);

    const a = faceVertices[0];
    const b = faceVertices[1];
    const c = faceVertices[2];

    // const face = determinantFromPoints(a, c, b);
    // const faceArea = 1 / (face * 0.5)

    for (let x = bboxmin[0]; x < bboxmax[0]; x++) {
       for (let y = bboxmin[1]; y < bboxmax[1]; y++) {
            const p = [x, y]
            // let inside = true;
            const apb = determinantFromPoints(a, p, b)
            const bpc = determinantFromPoints(b, p, c)
            const cpa = determinantFromPoints(c, p, a)

            if (apb >= 0 && bpc >= 0 && cpa >= 0) {
                // console.info(apb)
                // const w3 = (apb * 0.5) * faceArea
                // const w1 = (bpc * 0.5) * faceArea
                // const w2 = 1 - w3 - w1

                if (dot <= 0) {
                    fb.draw(p[0], p[1], [0, 0, 0])
                } else {
                    fb.draw(p[0], p[1], [dot * 180, dot * 180, dot * 180])
                }
            }
        }
    }
}

/**
 * (Aufgabe Rasterization 2)
 * @param vertices2D 
 * @param vertices3D 
 * @param dot 
 * @param depthBuffer 
 * @param width 
 * @param height 
 * @param fb 
 */
export function fillTriangleDepthBuffer(vertices2D: number[][], vertices3D: number[][], dot: number, depthBuffer: number[], width: number, height: number, fb: Framebuffer) {

    const [bboxmin, bboxmax] = bbox(vertices2D, width, height,fb, false);

    // Verteces2D is an array of triangle vertices in 2D space
    const a = vertices2D[0]; // point A
    const b = vertices2D[1]; // point B
    const c = vertices2D[2]; // point C

    // we take the absolute value of the z-coordinate of the vertices to ensure non-negative values
    const aZ = Math.abs(vertices3D[0][2]);
    const bZ = Math.abs(vertices3D[1][2]);
    const cZ = Math.abs(vertices3D[2][2]);

    const face = determinantFromPoints(a, c, b);
    const faceArea = 1 / (face * 0.5)

    for (let x = bboxmin[0]; x < bboxmax[0]; x++) {
        for (let y = bboxmin[1]; y < bboxmax[1]; y++) {
            const p = [x, y]
            // let inside = true;
            const apb = determinantFromPoints(a, p, b)
            const bpc = determinantFromPoints(b, p, c)
            const cpa = determinantFromPoints(c, p, a)

            if (apb >= 0 && bpc >= 0 && cpa >= 0) {

                // barycentric coordinates (weights)
                const w3 = (apb * 0.5) * faceArea;
                const w1 = (bpc * 0.5) * faceArea;
                const w2 = 1 - w3 - w1;

                const zInterp = aZ * w1 + bZ * w2 + cZ * w3;
                const depthBufferIndex = x + width * y; // locate the pixel in the depth buffer

                // the deptBuffer might be called again in the future for other faces.
                // we want to make sure that the triangle does not overlap with other triangles
                // so we check if the z value of the current pixel is greater than the interpolated z value
                // if so, update the depth buffer and draw the pixel
                const currentZ = depthBuffer[depthBufferIndex];
                if (currentZ > zInterp) {
                    depthBuffer[depthBufferIndex] = zInterp;
                    if (dot <= 0) {
                        fb.draw(p[0], p[1], [0, 0, 0])
                    } else {
                        fb.draw(p[0], p[1], [dot * 180, dot * 180, dot * 180])
                    }
                    // Visualize depth buffer:
                    // fb.draw(p[0], p[1], [zInterp * 120, zInterp * 120, zInterp * 120])
                } 
            }
        }
    }
}