import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface PanoramicImage {
    image: string;
}

const PanoramaViewer: React.FC<PanoramicImage> = ({ image }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Create the scene
        const scene = new THREE.Scene();

        // Create the camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 0.1);

        // Create the renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current!,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(
            canvasRef.current!.clientWidth,
            canvasRef.current!.clientHeight
        );
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create the sphere
        const geometry = new THREE.SphereGeometry(50, 32, 32);
        geometry.scale(-1, 1, 1);

        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Add the orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = -0.5;

        // Render the scene
        const render = () => {
            requestAnimationFrame(render);
            controls.update();
            renderer.render(scene, camera);
        };
        render();
    }, [texture]);

    useEffect(() => {
        setLoading(true);
        const loader = new THREE.TextureLoader();
        loader.load(
            image,
            texture => {
                setTexture(texture);
                setLoading(false);
            },
            xhr => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            error => {
                console.log("An error happened: " + error);
                setLoading(false);
            }
        );
    }, [image]);

    return (
        <div className="w-full h-auto aspect-square -z-10">
            <canvas ref={canvasRef} className="w-full h-full aspect-video" />
            {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-75">
                    <p className="text-white font-bold text-xl">Loading...</p>
                </div>
            )}
        </div>
    );
};

export default PanoramaViewer;
