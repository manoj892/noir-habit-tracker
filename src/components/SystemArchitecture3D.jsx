import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SystemArchitecture3D.css";

gsap.registerPlugin(ScrollTrigger);

export default function SystemArchitecture3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const blocksRef = useRef([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4effe4, 0.6);
    pointLight.position.set(-5, 5, 3);
    scene.add(pointLight);

    // Block data
    const blockData = [
      { label: "Premium motion", color: 0x4788ff, pitch: 380 },
      { label: "Kinetic architecture", color: 0x4788ff, pitch: 300 },
      { label: "Mobile depth", color: 0x4788ff, pitch: 220 },
      { label: "Brand system", color: 0x4788ff, pitch: 140 },
      { label: "Visual Rhythm", color: 0x4788ff, pitch: 60 },
      { label: "Seamless State", color: 0x4788ff, pitch: -20 },
    ];

    // Create 3D blocks
    const blocks = [];
    blockData.forEach((data, index) => {
      const geometry = new THREE.BoxGeometry(3, 1.5, 0.5);

      // Create material with gradient-like effect
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      // Create gradient on canvas
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(78, 255, 228, 0.3)");
      gradient.addColorStop(0.5, "rgba(69, 137, 255, 0.4)");
      gradient.addColorStop(1, "rgba(78, 255, 228, 0.3)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(data.label.split(" ")[0], canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 100,
        emissive: 0x1a5f7f,
        emissiveIntensity: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = {
        baseAngle: (index * 60) % 360,
        radius: 3,
        pitch: data.pitch,
        label: data.label,
      };

      blocks.push(mesh);
      scene.add(mesh);
    });

    blocksRef.current = blocks;

    // Animation state
    let scrollProgress = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate and position blocks in spiral
      const rotation = scrollProgress * 720; // 2 full rotations
      const upwardTravel = scrollProgress * 8; // Travel up through scene

      blocks.forEach((block, index) => {
        const baseAngle = (index * 60) % 360;
        const totalAngle = baseAngle + rotation;
        const angleRad = (totalAngle * Math.PI) / 180;

        const x = Math.cos(angleRad) * 3;
        const z = Math.sin(angleRad) * 3;
        const y = upwardTravel - index * 0.3;

        block.position.set(x, y, z);

        // Rotation for 3D effect
        block.rotation.x = Math.sin(angleRad) * 0.3;
        block.rotation.y = angleRad;
        block.rotation.z = Math.cos(angleRad) * 0.2;

        // Opacity based on depth
        const frontness = (z + 3) / 6;
        const opacity = 0.3 + frontness * 0.7;
        block.material.opacity = opacity;

        // Scale based on depth
        block.scale.z = 0.5 + frontness * 1.5;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Scroll animation
    const scrollTrigger = gsap.to(
      { progress: 0 },
      {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1200",
          scrub: 1,
          onUpdate: (self) => {
            scrollProgress = self.progress;
          },
        },
      }
    );

    // Handle window resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      scrollTrigger.kill();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="system-architecture-3d">
      <div className="architecture-header">
        <p className="eyebrow">System architecture</p>
        <h2>The product language rises like a living signal.</h2>
        <p className="future-text small-text">
          Each message block is rendered as true 3D geometry. As you scroll, they spiral upward,
          revealing depth and dimension naturally.
        </p>
      </div>
      <div className="architecture-canvas" ref={containerRef} />
    </div>
  );
}
