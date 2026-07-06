import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NeuralNetworkBackgroundProps {
  activeTheme: string;
  isDark: boolean;
}

export default function NeuralNetworkBackground({ activeTheme, isDark }: NeuralNetworkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep theme and dark mode states in refs for real-time update in render loop without re-instantiating Three.js
  const themeRef = useRef({ activeTheme, isDark });
  useEffect(() => {
    themeRef.current = { activeTheme, isDark };
  }, [activeTheme, isDark]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // --- SETUP SCENE, CAMERA, RENDERER ---
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Add subtle ambient fog to fade elements into distance
    scene.fog = new THREE.FogExp2(isDark ? 0x09090b : 0xfafbfc, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- GENERATE NEURAL NETWORK PARTICLES ---
    const particleCount = 100;
    const maxDistance = 15; // Max link distance
    const particlesData: Array<{
      pos: THREE.Vector3;
      vel: THREE.Vector3;
      originalPos: THREE.Vector3;
      size: number;
      speedFactor: number;
    }> = [];

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Box bounds for particles to drift in
    const rX = 55;
    const rY = 30;
    const rZ = 25;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * rX;
      const y = (Math.random() - 0.5) * rY;
      const z = (Math.random() - 0.5) * rZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particlesData.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04
        ),
        originalPos: new THREE.Vector3(x, y, z),
        size: Math.random() * 2 + 1,
        speedFactor: 0.5 + Math.random() * 0.5,
      });
    }

    // Nodes geometry & material
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular glowing point texture for nodes using an HTML canvas gradient
    const createCircleTexture = () => {
      const size = 64;
      const canvasTexture = document.createElement('canvas');
      canvasTexture.width = size;
      canvasTexture.height = size;
      const ctx = canvasTexture.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvasTexture);
    };

    const nodeMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodePoints);

    // --- DYNAMIC CONNECTIONS (LINES) SETUP ---
    const maxLines = 450;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineColors = new Float32Array(maxLines * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      linewidth: 1, // Note: WebGL restricts linewidth greater than 1 on most systems
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // --- INTERACTIVE MOUSE AND SCROLL STATE ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const mouse3D = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Interactive plane at z = 0

    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- THEME COLOR MAPPING ---
    const hexToRGB = (hex: number) => {
      const r = ((hex >> 16) & 255) / 255;
      const g = ((hex >> 8) & 255) / 255;
      const b = (hex & 255) / 255;
      return new THREE.Color(r, g, b);
    };

    const getThemeColors = (theme: string, dark: boolean) => {
      if (!dark) {
        // High quality editorial Light Mode colors (Indigo/Slate tones with softer lines)
        return {
          nodeColor: hexToRGB(0x6366f1),      // Indigo
          lineColor: hexToRGB(0xd1d5db),      // Light Grey
          mouseLineColor: hexToRGB(0x10b981), // Emerald interactive accent
          nodeSize: 1.4,
          lineOpacity: 0.25,
        };
      }
      switch (theme) {
        case 'aurora':
          return {
            nodeColor: hexToRGB(0x34d399),      // Emerald
            lineColor: hexToRGB(0x064e3b),      // Deep forest
            mouseLineColor: hexToRGB(0xa78bfa), // Light violet
            nodeSize: 1.8,
            lineOpacity: 0.45,
          };
        case 'cyber-blue':
          return {
            nodeColor: hexToRGB(0x22d3ee),      // Cyan
            lineColor: hexToRGB(0x1e3a8a),      // Deep blue
            mouseLineColor: hexToRGB(0x60a5fa), // Blue-violet
            nodeSize: 1.9,
            lineOpacity: 0.5,
          };
        case 'glass-purple':
          return {
            nodeColor: hexToRGB(0xf472b6),      // Soft pink
            lineColor: hexToRGB(0x581c87),      // Dark purple
            mouseLineColor: hexToRGB(0x818cf8), // Lavender
            nodeSize: 1.8,
            lineOpacity: 0.45,
          };
        case 'emerald-ai':
          return {
            nodeColor: hexToRGB(0x2dd4bf),      // Teal
            lineColor: hexToRGB(0x115e59),      // Dark teal
            mouseLineColor: hexToRGB(0x34d399), // Mint green
            nodeSize: 1.8,
            lineOpacity: 0.45,
          };
        case 'neon-gradient':
          return {
            nodeColor: hexToRGB(0xf43f5e),      // Rose
            lineColor: hexToRGB(0x7c2d12),      // Burnt orange/rust
            mouseLineColor: hexToRGB(0xfb923c), // Orange highlight
            nodeSize: 2.0,
            lineOpacity: 0.5,
          };
        case 'ai-dark':
        default:
          return {
            nodeColor: hexToRGB(0x818cf8),      // Medium Indigo
            lineColor: hexToRGB(0x312e81),      // Indigo dark
            mouseLineColor: hexToRGB(0x34d399), // Emerald highlight
            nodeSize: 1.8,
            lineOpacity: 0.45,
          };
      }
    };

    // --- ANIMATION & PHYSICS LOOP ---
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentTheme = themeRef.current.activeTheme;
      const currentIsDark = themeRef.current.isDark;
      const colorsTheme = getThemeColors(currentTheme, currentIsDark);

      // Interpolate mouse coordinates for fluid camera/force reaction
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.08;

      // Dynamic fog color adjusting to theme background
      scene.fog!.color = colorsTheme.lineColor.clone().multiplyScalar(0.1);

      // Rotate camera subtly based on mouse and scroll
      camera.position.x = mouse.x * 12;
      camera.position.y = mouse.y * 8 - (scrollY * 0.03);
      camera.lookAt(scene.position);

      // Map mouse coordinates to 3D plane coordinates to act as an active node
      raycaster.setFromCamera(new THREE.Vector2(mouse.x, mouse.y), camera);
      raycaster.ray.intersectPlane(plane, mouse3D);

      // Update node size
      nodeMaterial.size = colorsTheme.nodeSize;

      // Update particles position & velocities
      const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute;
      const colorAttr = nodeGeometry.attributes.color as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        const pData = particlesData[i];

        // Gentle drift logic
        pData.pos.add(pData.vel);

        // Interactive mouse gravity: warp nearby particles gently towards mouse
        const distToMouse = pData.pos.distanceTo(mouse3D);
        if (distToMouse < 18) {
          const force = (18 - distToMouse) / 18;
          // Vector towards mouse
          const dir = new THREE.Vector3().subVectors(mouse3D, pData.pos).normalize();
          pData.pos.addScaledVector(dir, force * 0.12);
        }

        // Boundary checks and bounce
        if (pData.pos.x < -rX / 2 || pData.pos.x > rX / 2) pData.vel.x = -pData.vel.x;
        if (pData.pos.y < -rY / 2 || pData.pos.y > rY / 2) pData.vel.y = -pData.vel.y;
        if (pData.pos.z < -rZ / 2 || pData.pos.z > rZ / 2) pData.vel.z = -pData.vel.z;

        // Clip positions to boundaries to prevent drift away
        pData.pos.x = THREE.MathUtils.clamp(pData.pos.x, -rX / 2, rX / 2);
        pData.pos.y = THREE.MathUtils.clamp(pData.pos.y, -rY / 2, rY / 2);
        pData.pos.z = THREE.MathUtils.clamp(pData.pos.z, -rZ / 2, rZ / 2);

        posAttr.setXYZ(i, pData.pos.x, pData.pos.y, pData.pos.z);

        // Nodes glow brighter when close to mouse
        const glowFactor = distToMouse < 15 ? 1.5 - (distToMouse / 15) : 0;
        const finalNodeColor = colorsTheme.nodeColor.clone();
        if (glowFactor > 0) {
          finalNodeColor.lerp(colorsTheme.mouseLineColor, glowFactor * 0.7);
        }

        colorAttr.setXYZ(i, finalNodeColor.r, finalNodeColor.g, finalNodeColor.b);
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;

      // Update lines and connections
      let vertexIdx = 0;
      let colorIdx = 0;
      let lineCount = 0;

      for (let i = 0; i < particleCount; i++) {
        const p1 = particlesData[i];

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particlesData[j];
          const dist = p1.pos.distanceTo(p2.pos);

          if (dist < maxDistance && lineCount < maxLines) {
            // Draw connection line
            const alpha = (1.0 - dist / maxDistance) * colorsTheme.lineOpacity;

            // Node 1 vertex
            linePositions[vertexIdx++] = p1.pos.x;
            linePositions[vertexIdx++] = p1.pos.y;
            linePositions[vertexIdx++] = p1.pos.z;

            // Node 2 vertex
            linePositions[vertexIdx++] = p2.pos.x;
            linePositions[vertexIdx++] = p2.pos.y;
            linePositions[vertexIdx++] = p2.pos.z;

            // Compute line color with alpha using vertex coloring trick
            const c1 = colorsTheme.lineColor.clone().multiplyScalar(alpha);
            const c2 = colorsTheme.lineColor.clone().multiplyScalar(alpha);

            lineColors[colorIdx++] = c1.r;
            lineColors[colorIdx++] = c1.g;
            lineColors[colorIdx++] = c1.b;

            lineColors[colorIdx++] = c2.r;
            lineColors[colorIdx++] = c2.g;
            lineColors[colorIdx++] = c2.b;

            lineCount++;
          }
        }

        // Connect nodes to mouse directly if close, forming a highly interactive web
        const distToMouse = p1.pos.distanceTo(mouse3D);
        if (distToMouse < 15 && lineCount < maxLines) {
          const alpha = (1.0 - distToMouse / 15) * 0.75;

          linePositions[vertexIdx++] = p1.pos.x;
          linePositions[vertexIdx++] = p1.pos.y;
          linePositions[vertexIdx++] = p1.pos.z;

          linePositions[vertexIdx++] = mouse3D.x;
          linePositions[vertexIdx++] = mouse3D.y;
          linePositions[vertexIdx++] = mouse3D.z;

          const c1 = colorsTheme.nodeColor.clone().multiplyScalar(alpha);
          const c2 = colorsTheme.mouseLineColor.clone().multiplyScalar(alpha);

          lineColors[colorIdx++] = c1.r;
          lineColors[colorIdx++] = c1.g;
          lineColors[colorIdx++] = c1.b;

          lineColors[colorIdx++] = c2.r;
          lineColors[colorIdx++] = c2.g;
          lineColors[colorIdx++] = c2.b;

          lineCount++;
        }
      }

      lineGeometry.setDrawRange(0, lineCount * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      // Slow rotation of entire scene for cinematic feel
      scene.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE OBSERVER (Strict Guideline Compliance) ---
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

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();

      // Dispose elements
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
