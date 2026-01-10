import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setAllTimeline, setPageScrollAnimations } from "../utils/GsapScroll";

gsap.registerPlugin(ScrollTrigger);

// Helper component to handle camera setup
const SceneSetup = () => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
};

const LanfeustModel = () => {
  const ref = useRef<THREE.Group>(null);
  
  // Load model - error handled by React Three Fiber's built-in error handling
  const { scene } = useGLTF("/models/lanfeust.glb");
  
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Enable transparency for fade effect
        if (mesh.material) {
          (mesh.material as THREE.Material).transparent = true;
          (mesh.material as THREE.Material).needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Scroll Animation
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      id: "lanfeust-model",
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top", 
      scrub: 1, // Smooth scrub
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Move down as we scroll
        el.position.y = -2.5 - progress * 5; 
        
        // Fade out
        scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
                mat.opacity = Math.max(0, 1 - progress * 1.5);
                mesh.visible = mat.opacity > 0;
            }
          }
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [scene]);
  
  useFrame((_state, delta) => {
    if(ref.current) {
        ref.current.rotation.y += delta * 0.2; // Slower idle rotation for better performance
    }
  });

  return (
    <primitive 
        ref={ref}
        object={scene} 
        scale={1.5} 
        position={[0, -2.5, 0]} 
        rotation={[0, Math.PI / 4, 0]}
    />
  );
}

const HammerScene = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    let progress = setProgress((value) => setLoading(value));
    progress.loaded();
    
    const workTrigger = ScrollTrigger.getById("work");
    const lanfeustTrigger = ScrollTrigger.getById("lanfeust-model");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger !== workTrigger && trigger !== lanfeustTrigger) {
        trigger.kill();
      }
    });

    setAllTimeline();
    setPageScrollAnimations();

    return () => {
      progress.clear();
    };
  }, [setLoading]);

  return (
    <div className="hammer-scene-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 0, 
      pointerEvents: 'none',
      overflow: 'visible'
    }}>
      <Canvas
        camera={{ position: [0, -0.5, 4], fov: 45 }}
        style={{ pointerEvents: 'auto' }}
        gl={{ alpha: true, antialias: false, toneMapping: THREE.NoToneMapping, toneMappingExposure: 1.0, stencil: false }}
        shadows
      >
        <SceneSetup />
        
        {/* Environment for Reflections */}
        <Environment 
          files="/models/char_enviorment.hdr" 
          environmentIntensity={1}
          blur={0.5} 
        />

        {/* Optimized Lighting Setup */}
        {/* Key Light: Strongest, from front-right */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize={[512, 512]} 
        />
        
        {/* Fill Light: Weaker, from opposite side (left) to soften shadows */}
        <pointLight 
          position={[-5, 0, 5]} 
          intensity={0.3} 
          color="#eef" // Slightly cool fill
        />
        
        {/* Local "Charged" Effect Light */}
        <pointLight 
          position={[0, 1, 0]} 
          color="#4488ff" 
          intensity={1} 
          distance={5} 
          decay={2} 
        />
        
        <LanfeustModel />
      </Canvas>
    </div>
  );
};

export default HammerScene;
