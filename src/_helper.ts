
/**
 * 
 * @param p 
 * @param dist 
 * @returns 
 */
export function perspDivide(p: Array<number>, dist: number): Array<number> {
    return [(dist* p[0])/p[2], (dist*p[1])/p[2], dist];
}

/**
 * 
 * @param v 
 * @param o 
 * @param dist 
 * @returns 
 */
export function rayEquationCalc(v: Array<number>, o:Array<number>, dist: number): Array<number> {
    return [(v[0] - o[0])*dist + o[0], (v[1] - o[1])*dist + o[1], (v[2] - o[2])*dist + o[2]];
}

/**
 * Multiply a vector with a 3x3 matrix (Aufgabe Part_1)
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