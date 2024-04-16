export function perspDivide(p: Array<number>, dist: number): Array<number> {
    return [(dist* p[0])/p[2], (dist*p[1])/p[2], dist];
}

export function rayEquationCalc(v: Array<number>, o:Array<number>, dist: number): Array<number> {
    return [(v[0] - o[0])*dist + o[0], (v[1] - o[1])*dist + o[1], (v[2] - o[2])*dist + o[2]];
}