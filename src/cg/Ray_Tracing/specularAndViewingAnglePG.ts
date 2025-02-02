import { Vec3, vecDotProduct, vecMultiplyScalar, vecNormalize, vecSubtract } from "../../_helper";
import Playground from "../../playground";

const pg = new Playground();

const n = [.23, .44, 0]
const i = [-1, -1, 1]
const v = [1,1,1] // viewing vector (y -> -.5)

pg.gridXZ();
pg.visVector(v, { color: "blue", label: "V" });
pg.visVector(n, { color: "dodgerblue", label: "N" });
pg.visVector(i, { color: "orangered",  placeAt: vecMultiplyScalar(-1, i as Vec3), label: "I" });

// relfection
const reflected =
    vecSubtract(
        vecNormalize(i as Vec3),
        vecMultiplyScalar(
            vecDotProduct(vecNormalize(n as Vec3), vecNormalize(i as Vec3)),
            vecMultiplyScalar(2, vecNormalize(n as Vec3) as Vec3)
        )
    )

pg.visVector(reflected, { color: "orange", label: "reflected" });




// Visualize view angle and specular
const cosViewAngle = vecDotProduct(vecNormalize(reflected),vecNormalize(v as Vec3));
pg.visVector(vecMultiplyScalar(cosViewAngle, vecNormalize(v as Vec3)),{color:"red",label:"specular"})