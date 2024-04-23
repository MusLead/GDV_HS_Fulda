import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface IVecParams {
    color?: string,
    label?: string,
    labelCenter?: string,
    triangles?: boolean,
    placeAt?: Array<number> | boolean,
    pscale?: number,
    showArrow?: boolean,
    showCone?: boolean
}
export default class Playground {

    private container
    private stats
    public renderer
    public scene
    public camera: THREE.Camera
    public controls
    private gridHelperXY: THREE.GridHelper | null = null
    private gridHelperXZ: THREE.GridHelper | null = null
    private gridHelperYZ: THREE.GridHelper | null = null
    private labelRenderer
    private cubeInstance
    private sphereInstance

    constructor(side = false) {
        // this.clock = new THREE.Clock();
        this.container = document.getElementById('app');
        this.stats = new Stats();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("white");

        if (!side) {
            this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, .1, 50);
            this.camera.position.set(-5, 5, -8);
        } else {
            this.camera = new THREE.OrthographicCamera() as THREE.Camera
            this.camera.position.set(-5, 0, 0);
        }



        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        if (!side) {
            this.controls.target.set(0, 0.5, 0);
        } else {
            this.controls.target.set(0, 0, 0);
        }

        if (!side) {
            // Get camera data from sessionStorage
            const storageCamX = sessionStorage.getItem("camX");
            const storageCamY = sessionStorage.getItem("camY");
            const storageCamZ = sessionStorage.getItem("camZ");
            const storageTargetX = sessionStorage.getItem("targetX");
            const storageTargetY = sessionStorage.getItem("targetY");
            const storageTargetZ = sessionStorage.getItem("targetZ");

            if (storageCamX && storageCamY && storageCamZ) {

                this.camera.position.set(Number(storageCamX), Number(storageCamY), Number(storageCamZ));
                this.controls.target.set(Number(storageTargetX), Number(storageTargetY), Number(storageTargetZ));
            }
        }


        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;

        this.controls.addEventListener("change", this.handleCameraChange.bind(this))


        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.pointerEvents = 'none';

        this.cubeInstance = new THREE.BoxGeometry(1, 1, 1);
        this.sphereInstance = new THREE.SphereGeometry();

        if (this.container) {
            this.container.appendChild(this.stats.dom);
            this.container.appendChild(this.renderer.domElement);
            this.container.appendChild(this.labelRenderer.domElement);

            window.onresize = this.handleResize.bind(this);
            this.animate();
        }


        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);

    }

    handleCameraChange() {
        //-console.info(this.controls.target)
        sessionStorage.setItem("camX", this.controls.object.position.x.toString());
        sessionStorage.setItem("camY", this.controls.object.position.y.toString());
        sessionStorage.setItem("camZ", this.controls.object.position.z.toString());

        sessionStorage.setItem("targetX", this.controls.target.x.toString());
        sessionStorage.setItem("targetY", this.controls.target.y.toString());
        sessionStorage.setItem("targetZ", this.controls.target.z.toString());


        this.controls.target
    }

    gridXY(size = 10, divisions = 10): void {
        this.gridHelperXY = new THREE.GridHelper(size, divisions);
        this.gridHelperXY.rotation.x = Math.PI / 2;
        this.scene.add(this.gridHelperXY);
    }

    gridXZ(size = 10, divisions = 10): void {
        this.gridHelperXZ = new THREE.GridHelper(size, divisions);
        this.scene.add(this.gridHelperXZ);
    }

    gridYZ(size = 10, divisions = 10): void {
        this.gridHelperYZ = new THREE.GridHelper(size, divisions);
        this.gridHelperYZ.rotation.x = Math.PI / 2;
        this.gridHelperYZ.rotation.z = Math.PI / 2;
        this.scene.add(this.gridHelperYZ);
    }

    circle(radius = 1) {
        const curve = new THREE.EllipseCurve(
            0, 0,             // X, Y
            radius, radius,   // radius
            0, 2 * Math.PI,   // StartAngle, EndAngle
            false,            // Clockwise
            0                 // Rotation
        );
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        const ellipse = new THREE.Line(geometry, material);
        return ellipse
    }

    unitCircleXY() {
        const circle = this.circle();
        circle.rotation.x = Math.PI / 2;
        this.scene.add(circle);
    }
    unitCircleXZ() {
        const circle = this.circle();
        this.scene.add(circle);
    }

    unitCircleYZ() {
        const circle = this.circle();
        circle.rotation.y = Math.PI / 2;
        circle.rotation.z = Math.PI / 2;
        this.scene.add(circle);
    }

    private visAsVectorOrPoint(p = [1, 1, 1],
        parameters?: IVecParams, asPoint = false) {
        const defaults: IVecParams = {
            color: "gray",
            label: "",
            labelCenter: "",
            triangles: false,
            placeAt: false,
            pscale: 0.01,
            showArrow: true,
            showCone: true
        }

        const params = { ...defaults, ...parameters };

        const pVec = new THREE.Vector3(p[0], p[1], p[2]);
        const endPos = new THREE.Vector3();
        const placeVec = new THREE.Vector3(0, 0, 0);

        if (Array.isArray(params.placeAt)) {
            placeVec.set(params.placeAt[0], params.placeAt[1], params.placeAt[2])
        }

        const dir = pVec.clone();

        const vecLength = dir.length();
        dir.normalize();

        if (params.showArrow) {
            const arrowHelper = new THREE.ArrowHelper(dir, placeVec, vecLength, 0.0, 0.2 * Number(params.showCone));
            arrowHelper.setColor(new THREE.Color(params.color));
            //arrowHelper.cone.visible = false;

            this.scene.add(arrowHelper);
        }


        endPos.addVectors(pVec, placeVec);
        if (asPoint) {
            const material = new THREE.MeshBasicMaterial({ color: params.color });
            const mesh = new THREE.InstancedMesh(this.sphereInstance, material, 1);
            mesh.scale.set(params.pscale, params.pscale, params.pscale);
            mesh.position.set(endPos.x, endPos.y, endPos.z)
            this.scene.add(mesh);
        }
        // center is placeAt + (pVec * 0.5)
        const centerPos = pVec.clone();
        centerPos.multiplyScalar(0.5).add(placeVec);

        this.addLabel(endPos, params.label, params.color);
        this.addLabel(centerPos, params.labelCenter, params.color);

        if (params.triangles) {
            this.visTriangle(
                [0, 0, 0],
                [p[0], 0, p[2]],
                [0, 0, p[2]],
                "red", 0.1)

            this.visTriangle(
                [0, 0, 0],
                [0, p[1], p[2]],
                [0, 0, p[2]],
                "green", 0.1)
        }
    }

    visVector(
        p = [1, 1, 1],
        parameters?: IVecParams
    ) {
        const defaults: IVecParams = {
            color: "gray",
            label: "",
            labelCenter: "",
            triangles: false,
            placeAt: false,
            showArrow: true,
            showCone: true
        }

        const params = { ...defaults, ...parameters };
        this.visAsVectorOrPoint(p, params)
    }

    visPoint(p = [1, 1, 1],
        parameters?: IVecParams) {

        const defaults: IVecParams = {
            color: "gray",
            label: "",
            labelCenter: "",
            triangles: false,
            placeAt: false,
            showArrow: false,
            showCone: false,
            pscale: 0.01
        }

        const params = { ...defaults, ...parameters }
        this.visAsVectorOrPoint(p, params, true)

    }

    addLabel(toPosition: THREE.Vector3Like, textContent = "", color: string) {
        if (textContent == "") return;

        const textContainer = document.createElement('div');

        const textEl = document.createElement('div');
        textEl.className = 'label';
        textEl.style.position = 'absolute';
        textEl.style.backgroundColor = 'rgba(255,255,255,0.4)';
        textEl.style.padding = ".1rem";
        textEl.style.fontSize = "1.5rem";
        textEl.style.fontWeight = "300";
        textEl.style.whiteSpace = "nowrap";
        textEl.style.color = color;

        textEl.textContent = textContent;
        textContainer.appendChild(textEl);

        const label = new CSS2DObject(textContainer);
        label.position.copy(toPosition);
        this.scene.add(label);
    }

    visCamera(distImagePlane = -1.0) {
        const geometry = new THREE.BufferGeometry();

        // A camera points down -Z
        const reversedDistImagePlane = distImagePlane;


        const vertices = new Float32Array([
            0, 0, 0, // v0
            -reversedDistImagePlane, -reversedDistImagePlane, reversedDistImagePlane, // v1
            reversedDistImagePlane, -reversedDistImagePlane, reversedDistImagePlane, // v2
            reversedDistImagePlane, reversedDistImagePlane, reversedDistImagePlane, // v3
            -reversedDistImagePlane, reversedDistImagePlane, reversedDistImagePlane, // v4
        ]);

        const indices = [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 1, 4
        ];

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        // @ts-ignore
        line.material.color = new THREE.Color("red");
        // @ts-ignore
        line.material.depthTest = false;
        // @ts-ignore
        line.material.opacity = 1;
        // @ts-ignore
        line.material.transparent = false;

        this.scene.add(line)

    }


    private visTriangle(
        p0 = [0, 0, 0],
        p1 = [-1, 0, 1],
        p2 = [0, 0, 1],
        color = "rgb(10, 200, 10)",
        opc = 0.25) {


        const geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array([
            p0[0], p0[1], p0[2], // v0
            p1[0], p1[1], p1[2], // v1
            p2[0], p2[1], p2[2] // v2
        ]);

        const indices = [
            0, 1, 2,

        ];

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
            depthTest: false,
            transparent: true,
            opacity: opc,
            side: THREE.DoubleSide

        });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh)
    }

    handleResize() {
        (this.camera as THREE.PerspectiveCamera).aspect = window.innerWidth / window.innerHeight;
        (this.camera as THREE.PerspectiveCamera).updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        //const delta = this.clock.getDelta();
        this.controls.update();
        this.stats.update();
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
    }
}