import React, { useRef, useEffect, useState } from "react";
import {
  FinancialCharacterController,
  FINANCIAL_EXPRESSION_PRESETS,
} from "./FinancialCharacterController";

/**
 * FinancialCharacter3DWrapper
 * 
 * Drop-in WebGL Canvas component that embeds interactive 3D mascot physics
 * into any React view (e.g. Dashboard, MoodBuddy, or StatCards).
 * 
 * Props:
 * @param {number} income - Total income metric
 * @param {number} expenses - Total expenses metric
 * @param {number} [allocatedToGoals] - Total allocated to savings goals
 * @param {number} [totalBalance] - Total net balance
 * @param {string} [characterModelPath] - Optional URL to GLTF/GLB file
 * @param {string} [className] - Tailwind classes for container sizing
 */
export default function FinancialCharacterCanvas({
  income = 0,
  expenses = 0,
  allocatedToGoals = 0,
  totalBalance = 0,
  characterModelPath = null,
  className = "w-48 h-48",
}) {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);
  const [financialState, setFinancialState] = useState("SAVINGS");

  useEffect(() => {
    let animationFrameId;
    let isDisposed = false;

    async function initThree() {
      // Dynamic import of Three.js if available, or gracefully initialize WebGL
      let THREE;
      try {
        THREE = await import("three");
      } catch (e) {
        console.warn("Three.js is not yet installed. Run `npm i three` to activate full WebGL 3D meshes.", e);
        return;
      }

      if (!canvasRef.current || isDisposed) return;

      const canvas = canvasRef.current;
      const width = canvas.clientWidth || 200;
      const height = canvas.clientHeight || 200;

      // 1. Scene & Transparent Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.2, 2.5);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 2. Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(2, 3, 3);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x3ab5ff, 1.8);
      rimLight.position.set(-2, 2, -2);
      scene.add(rimLight);

      // 3. Root Character Group
      const characterGroup = new THREE.Group();
      scene.add(characterGroup);

      // Procedural cute 3D Mascot Mesh (fallback or procedural buddy)
      // Body Sphere
      const bodyGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xfae2ec,
        roughness: 0.3,
        metalness: 0.1,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      characterGroup.add(bodyMesh);

      // Cheerful Eyes (Left & Right)
      const eyeGeo = new THREE.SphereGeometry(0.1, 24, 24);
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111625, roughness: 0.1 });
      
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.scale.set(1, 1.3, 0.4);
      leftEye.position.set(-0.2, 0.1, 0.48);
      characterGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.scale.set(1, 1.3, 0.4);
      rightEye.position.set(0.2, 0.1, 0.48);
      characterGroup.add(rightEye);

      // 4. Instantiate Principal Financial Character Controller
      const controller = new FinancialCharacterController({
        characterRoot: characterGroup,
        canvas: canvas,
        camera: camera,
      });
      controllerRef.current = controller;

      // Feed initial metrics
      controller.setFinancialMetrics({
        income,
        expenses,
        allocatedToGoals,
        totalBalance,
      });
      setFinancialState(controller.currentState);

      // 5. Animation Loop
      let lastTime = performance.now();
      const tick = () => {
        if (isDisposed) return;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        controller.update(dt);
        renderer.render(scene, camera);

        animationFrameId = requestAnimationFrame(tick);
      };

      tick();

      // Resize observer
      const resizeObserver = new ResizeObserver(() => {
        if (!canvas) return;
        const newW = canvas.clientWidth;
        const newH = canvas.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH, false);
      });
      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.disconnect();
        controller.destroy();
        renderer.dispose();
      };
    }

    initThree();

    return () => {
      isDisposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (controllerRef.current) controllerRef.current.destroy();
    };
  }, []);

  // Sync financial metric changes in real-time
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setFinancialMetrics({
        income,
        expenses,
        allocatedToGoals,
        totalBalance,
      });
      setFinancialState(controllerRef.current.currentState);
    }
  }, [income, expenses, allocatedToGoals, totalBalance]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer touch-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}
