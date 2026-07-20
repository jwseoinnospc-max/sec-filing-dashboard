/* eslint-disable react/no-unknown-property */
"use client";
import { Suspense, useRef, useLayoutEffect, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree, invalidate } from "@react-three/fiber";
import { useProgress, Html, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

const deg2rad = (d: number) => (d * Math.PI) / 180;
const ROTATE_SPEED = 0.005;
const INERTIA = 0.925;

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span style={{ color: "#94a3b8", fontSize: 12, fontFamily: "monospace", whiteSpace: "nowrap" }}>
        Loading {Math.round(progress)}%
      </span>
    </Html>
  );
}

function OBJModel({
  url,
  initPitch,
  initYaw,
  autoRotate,
  autoRotateSpeed,
  enableManualRotation,
  onLoaded,
}: {
  url: string;
  initPitch: number;
  initYaw: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableManualRotation: boolean;
  onLoaded?: () => void;
}) {
  const raw = useLoader(OBJLoader, url);
  const { gl } = useThree();

  const obj = useMemo(() => {
    const cloned = raw.clone(true);
    const defaultMat = new THREE.MeshStandardMaterial({
      color: 0xc0c8d0,
      metalness: 0.55,
      roughness: 0.35,
    });
    cloned.traverse((o: THREE.Object3D) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Use default if material is missing or pitch-black
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        if (!mat || (mat as THREE.MeshPhongMaterial).color?.getHex() === 0) {
          mesh.material = defaultMat;
        }
      }
    });
    // Normalize size
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim;
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    return cloned;
  }, [raw]);

  const groupRef = useRef<THREE.Group>(null!);
  const vel = useRef({ x: 0, y: 0 });
  const loadedRef = useRef(false);

  useLayoutEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.set(initPitch, initYaw, 0);
    if (!loadedRef.current) {
      loadedRef.current = true;
      onLoaded?.();
    }
  }, [obj, initPitch, initYaw, onLoaded]);

  // Manual drag rotation
  useEffect(() => {
    if (!enableManualRotation) return;
    const el = gl.domElement;
    let dragging = false, lx = 0, ly = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true; lx = e.clientX; ly = e.clientY;
      window.addEventListener("pointerup", onUp);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      groupRef.current.rotation.y += dx * ROTATE_SPEED;
      groupRef.current.rotation.x += dy * ROTATE_SPEED;
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED };
      invalidate();
    };
    const onUp = () => { dragging = false; window.removeEventListener("pointerup", onUp); };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    return () => { el.removeEventListener("pointerdown", onDown); el.removeEventListener("pointermove", onMove); };
  }, [gl, enableManualRotation]);

  useFrame((_, dt) => {
    let need = false;
    if (autoRotate) {
      groupRef.current.rotation.y += autoRotateSpeed * dt;
      need = true;
    }
    groupRef.current.rotation.y += vel.current.x;
    groupRef.current.rotation.x += vel.current.y;
    vel.current.x *= INERTIA;
    vel.current.y *= INERTIA;
    if (Math.abs(vel.current.x) > 1e-4 || Math.abs(vel.current.y) > 1e-4) need = true;
    if (need) invalidate();
  });

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
}

export interface ModelViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableManualRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  showScreenshotButton?: boolean;
  fadeIn?: boolean;
  onModelLoaded?: () => void;
}

export default function ModelViewer({
  url,
  width = 400,
  height = 400,
  defaultRotationX = 0,
  defaultRotationY = 0,
  defaultZoom = 2.5,
  minZoomDistance = 0.5,
  maxZoomDistance = 10,
  enableManualRotation = true,
  enableManualZoom = true,
  ambientIntensity = 0.6,
  keyLightIntensity = 1.4,
  fillLightIntensity = 0.7,
  rimLightIntensity = 1.0,
  environmentPreset = "city",
  autoRotate = false,
  autoRotateSpeed = 0.35,
  showScreenshotButton = false,
  onModelLoaded,
}: ModelViewerProps) {
  const initPitch = deg2rad(defaultRotationX);
  const initYaw = deg2rad(defaultRotationY);

  return (
    <div style={{ width, height, position: "relative" }}>
      <Canvas
        shadows
        frameloop="demand"
        camera={{ fov: 45, position: [0, 0, defaultZoom], near: 0.01, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#04080f"]} />

        {environmentPreset !== "none" && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Environment preset={environmentPreset as any} background={false} />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[4, 6, 4]} intensity={keyLightIntensity} castShadow />
        <directionalLight position={[-4, 2, 4]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 5, -4]} intensity={rimLightIntensity} color="#a0c8ff" />

        <ContactShadows position={[0, -0.55, 0]} opacity={0.4} scale={4} blur={2} />

        <Suspense fallback={<Loader />}>
          <OBJModel
            url={url}
            initPitch={initPitch}
            initYaw={initYaw}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enableManualRotation={enableManualRotation}
            onLoaded={onModelLoaded}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableRotate={false}
          enableZoom={enableManualZoom}
          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
        />
      </Canvas>
    </div>
  );
}
