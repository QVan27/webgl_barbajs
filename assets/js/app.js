import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragment from "../../shaders/fragment.glsl";
import vertex from "../../shaders/vertex.glsl";
import testTexture from "../../assets/img/water.jpg";

const cameraDistance = 600;

export default class Sketch {
  constructor(options) {
    this.container = options.domElement;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      30,
      this.width / this.height,
      10,
      1000
    );

    this.camera.position.z = cameraDistance;
    this.camera.fov =
      Math.atan(this.height / 2 / cameraDistance) * (180 / Math.PI) * 2;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.resize();
    this.addObjects();
    this.render();

    this.setupResize();
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();

    // Update WebGL images which overlay HTML images
    this.camera.fov =
      Math.atan(this.height / 2 / cameraDistance) * (180 / Math.PI) * 2;
    // this.materials.forEach((m) => {
    //   m.uniforms.uResolution.value.x = this.width;
    //   m.uniforms.uResolution.value.y = this.height;
    // });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  addObjects() {
    this.geometry = new THREE.PlaneBufferGeometry(500, 200, 100, 100);
    // this.geometry = new THREE.SphereBufferGeometry(0.5, 160, 160);
    this.material = new THREE.ShaderMaterial({
      // wireframe: true,
      uniforms: {
        time: { value: 1.0 },
        uTexture: { value: new THREE.TextureLoader().load(testTexture) },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    this.time += 0.01;
    this.material.uniforms.time.value = this.time;
    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  domElement: document.getElementById("container"),
});
