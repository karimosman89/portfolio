import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DataWaveBackgroundProps {
  activeTheme?: string;
  isDark?: boolean;
}

export default function DataWaveBackground({ activeTheme = 'ai-dark', isDark = true }: DataWaveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef({ activeTheme, isDark });

  useEffect(() => {
    themeRef.current = { activeTheme, isDark };
  }, [activeTheme, isDark]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Grid geometry
    const segmentsX = 40;
    const segmentsY = 40;
    const sizeX = 200;
    const sizeY = 200;
    
    const geometry = new THREE.PlaneGeometry(sizeX, sizeY, segmentsX, segmentsY);
    geometry.rotateX(-Math.PI / 2); // Lay flat

    // Create points
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    
    const points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);

    // Create lines (wireframe)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.15,
    });
    
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      lineMaterial
    );
    scene.add(wireframe);

    // Clock for animation
    const clock = new THREE.Clock();
    
    // Mouse interaction
    let targetCameraX = 0;
    let targetCameraY = 30;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = x * 20;
      targetCameraY = 30 + y * 10;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Theme color helper
    const updateColors = () => {
      const isDarkNow = themeRef.current.isDark;
      const primaryColor = isDarkNow ? 0x6366f1 : 0x4338ca;
      const fogColor = isDarkNow ? 0x09090b : 0xffffff;
      
      pointsMaterial.color.setHex(primaryColor);
      lineMaterial.color.setHex(primaryColor);
      scene.fog!.color.setHex(fogColor);
      
      if (!isDarkNow) {
        scene.fog!.density = 0.01;
        pointsMaterial.opacity = 0.6;
        lineMaterial.opacity = 0.1;
      } else {
        scene.fog!.density = 0.015;
        pointsMaterial.opacity = 0.8;
        lineMaterial.opacity = 0.15;
      }
    };

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      updateColors();
      
      const time = clock.getElapsedTime() * 0.5;
      
      // Animate vertices to create a wave effect
      const positionAttribute = geometry.attributes.position;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const z = positionAttribute.getZ(i);
        
        // Complex wave using multiple sine functions
        const y = Math.sin(x * 0.05 + time) * 3 + 
                  Math.cos(z * 0.05 + time * 0.8) * 3 +
                  Math.sin((x + z) * 0.02 + time * 1.2) * 2;
                  
        positionAttribute.setY(i, y);
      }
      positionAttribute.needsUpdate = true;
      
      // Smooth camera movement
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      geometry.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Subtle overlay gradient to blend with the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/10 to-zinc-50 dark:via-zinc-950/10 dark:to-zinc-950 pointer-events-none"></div>
    </div>
  );
}
