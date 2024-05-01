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
 * 
 * @param v point of the ray
 * @param o origin point
 * @param dist 
 * @returns 
 */
export function rayEquationCalc(v: Array<number>, o:Array<number>, dist: number): Array<number> {
    return [(v[0] - o[0])*dist + o[0], (v[1] - o[1])*dist + o[1], (v[2] - o[2])*dist + o[2]];
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
export function vecNormalize(v: Array<number>){
    return v.map((x) => vecLength(v) === 0 ? 1 : x/vecLength(v));
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
    ];
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
    ];
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
    ];  
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
 * @param v 
 * @param m 
 * @returns 
 */
export function multVec3Matrix4(v: Vec3, m: Matrix4):Vec3 {
    const v4 = [v[0], v[1], v[2], 1];
    return [
        v4[0] * m[0] + v4[1] * m[1] + v4[2] * m[2] + v4[3] * m[3],
        v4[0] * m[4] + v4[1] * m[5] + v4[2] * m[6] + v4[3] * m[7],
        v4[0] * m[8] + v4[1] * m[9] + v4[2] * m[10] + v4[3] * m[11]
    ];
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