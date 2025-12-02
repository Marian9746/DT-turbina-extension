import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TurbineState } from '@/types';
import './WindTurbine3D.css';

interface WindTurbine3DProps {
  turbineState: TurbineState;
}

export const WindTurbine3D: React.FC<WindTurbine3DProps> = ({ turbineState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bladesRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number>(0);
  const turbineStateRef = useRef(turbineState);

  // Keep turbineStateRef updated with latest turbineState
  useEffect(() => {
    turbineStateRef.current = turbineState;
  }, [turbineState]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 3, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.CircleGeometry(15, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create Wind Turbine
    const turbine = new THREE.Group();

    // Tower
    const towerGeometry = new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = 3;
    tower.castShadow = true;
    turbine.add(tower);

    // Nacelle
    const nacelleGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.8);
    const nacelleMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
    nacelle.position.set(0, 6, 0);
    nacelle.castShadow = true;
    turbine.add(nacelle);

    // Hub
    const hubGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.position.set(0.6, 6, 0);
    hub.castShadow = true;

    // Blades group
    const blades = new THREE.Group();
    blades.position.set(0.6, 6, 0);
    bladesRef.current = blades;

    // Create 3 blades
    const bladeGeometry = new THREE.BoxGeometry(0.15, 3, 0.5);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      blade.position.y = 1.5;
      blade.castShadow = true;

      const bladeGroup = new THREE.Group();
      bladeGroup.add(blade);
      bladeGroup.rotation.z = (i * Math.PI * 2) / 3;

      blades.add(bladeGroup);
    }

    turbine.add(hub);
    turbine.add(blades);
    scene.add(turbine);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Use ref to get current turbineState in animation loop
      const currentState = turbineStateRef.current;
      if (bladesRef.current && currentState.rotationSpeed > 0.001) {
        bladesRef.current.rotation.x += currentState.rotationSpeed * 0.1; // si quiero que vaya mas rapido poner 0.3
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="wind-turbine-3d" />;
};
