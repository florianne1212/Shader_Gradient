import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'

let palette = [
    "#382f32",
    "#000000",
    "#4f5269",
    "#272462",
    "#525984"
]
console.log(palette)
palette = palette.map((color)=> new THREE.Color(color))
console.log(palette)

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Use OrthographicCamera to fill the screen
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
camera.position.z = 1
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

const updateSize = () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    material.uniforms.pixels.value.set(sizes.width, sizes.height)
}

/**
 * Test mesh
 */
// Geometry - Create fullscreen plane geometry
const geometry = new THREE.PlaneGeometry(2, 2, 300, 300) 

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        time: { value: 0 },
        uColor: {value: palette},
        uSpeed: { value: 3.0 },
        uNoiseHeight: { value: 0.2 },
        pixels: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        progress: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        texture1: { value: null }
    }
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

updateSize()

/**
 * GUI Controls
 */
const params = {
    speed: 3.0,
    noiseHeight: 0.2,
    color0: palette[0].getHex(),
    color1: palette[1].getHex(),
    color2: palette[2].getHex(),
    color3: palette[3].getHex(),
    color4: palette[4].getHex()
}

// Animation controls
const animationFolder = gui.addFolder('Animation')
animationFolder.add(params, 'speed', 0, 25, 0.1).onChange((value) => {
    material.uniforms.uSpeed.value = value
}).name('Speed')

animationFolder.add(params, 'noiseHeight', 0, 1, 0.01).onChange((value) => {
    material.uniforms.uNoiseHeight.value = value
}).name('Noise Height')

animationFolder.open()

// Color controls
const colorFolder = gui.addFolder('Colors')
colorFolder.addColor(params, 'color0').onChange((value) => {
    material.uniforms.uColor.value[0].setHex(value)
}).name('Color 1')

colorFolder.addColor(params, 'color1').onChange((value) => {
    material.uniforms.uColor.value[1].setHex(value)
}).name('Color 2')

colorFolder.addColor(params, 'color2').onChange((value) => {
    material.uniforms.uColor.value[2].setHex(value)
}).name('Color 3')

colorFolder.addColor(params, 'color3').onChange((value) => {
    material.uniforms.uColor.value[3].setHex(value)
}).name('Color 4')

colorFolder.addColor(params, 'color4').onChange((value) => {
    material.uniforms.uColor.value[4].setHex(value)
}).name('Color 5')

colorFolder.open()

/**
 * Window Resize
 */
window.addEventListener('resize', () => {
    updateSize()
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.time.value = elapsedTime * 0.01

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()