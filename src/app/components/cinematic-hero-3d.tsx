import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { useLang } from "../context/language-context";
import { WingedSunTitleDivider } from "./egyptian-glyphs";
import { LuxuryRippleButton } from "./luxury-ripple-button";
import { cn } from "./ui/utils";

/** Vite base (always ends with /). */
const BASE = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const GLB_PATH = `${BASE}models/tutankhamun-mask.glb`;
const DRACO_PATH = `${BASE}draco/gltf/`;

const MSG_EN = [
  "Loading gold prices...",
  "Syncing currency rates...",
  "Connecting to Egyptian market...",
];
const MSG_AR = [
  "جاري تحميل أسعار الذهب...",
  "مزامنة أسعار العملات...",
  "الاتصال بالسوق المصري...",
];

function disposeObject3D(root: THREE.Object3D) {
  root.traverse((child) => {
    if (child instanceof THREE.LineSegments || child instanceof THREE.Line) {
      child.geometry.dispose();
      (child.material as THREE.Material).dispose();
      return;
    }
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      const mat = child.material;
      const mats = Array.isArray(mat) ? mat : [mat];
      mats.forEach((m) => {
        if (!m) return;
        const std = m as THREE.MeshStandardMaterial;
        if (std.map) std.map.dispose();
        if (std.normalMap) std.normalMap.dispose();
        if (std.emissiveMap) std.emissiveMap.dispose();
        if (std.roughnessMap) std.roughnessMap.dispose();
        if (std.metalnessMap) std.metalnessMap.dispose();
        if (std.aoMap) std.aoMap.dispose();
        m.dispose();
      });
    }
  });
}

function prepMaterials(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    obj.frustumCulled = false;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((m) => {
      if (!m) return;
      m.fog = false;
      m.transparent = false;
      m.opacity = 1;
      m.side = THREE.DoubleSide;
      if (m instanceof THREE.MeshBasicMaterial) {
        if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
        m.needsUpdate = true;
      } else if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
        if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
        m.needsUpdate = true;
      }
    });
  });
}

export function CinematicHero3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const [exploreFade, setExploreFade] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [displayLine, setDisplayLine] = useState("");
  const msgIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimers();
    const list = lang === "ar" ? MSG_AR : MSG_EN;
    msgIndexRef.current = 0;
    charIndexRef.current = 0;
    setDisplayLine("");

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const step = () => {
        setDisplayLine(list[msgIndexRef.current % list.length]);
        msgIndexRef.current += 1;
        timeoutRef.current = setTimeout(step, 2200);
      };
      step();
      return clearTimers;
    }

    const typeNext = () => {
      const msg = list[msgIndexRef.current % list.length];
      if (charIndexRef.current <= msg.length) {
        setDisplayLine(msg.slice(0, charIndexRef.current));
        charIndexRef.current += 1;
        timeoutRef.current = setTimeout(typeNext, 40);
      } else {
        timeoutRef.current = setTimeout(() => {
          msgIndexRef.current += 1;
          charIndexRef.current = 0;
          setDisplayLine("");
          typeNext();
        }, 1800);
      }
    };
    typeNext();
    return clearTimers;
  }, [lang, clearTimers]);

  /** Minimal Three.js viewer — fixed-height mount so canvas never gets h=0 (h-full bug). */
  useLayoutEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
    camera.position.set(0, 0, 4.55);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.error("[Hero3D] WebGL not available:", e);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    const canvasEl = renderer.domElement;
    canvasEl.style.position = "absolute";
    canvasEl.style.top = "0";
    canvasEl.style.left = "0";
    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";
    canvasEl.style.zIndex = "2";
    canvasEl.style.background = "transparent";
    el.appendChild(canvasEl);

    const ambient = new THREE.AmbientLight(0xffffff, 0.98);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff5e0, 1.25);
    key.position.set(4, 6, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xaac8ff, 0.35);
    fill.position.set(-5, 2, -4);
    scene.add(fill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let meshHolder: THREE.Object3D | null = null;
    let raf = 0;
    let disposed = false;

    const clearModel = () => {
      if (meshHolder) {
        pivot.remove(meshHolder);
        disposeObject3D(meshHolder);
        meshHolder = null;
      }
    };

    const resize = () => {
      const w = el.clientWidth;
      const h = Math.max(el.clientHeight, 4);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
    };

    const onWinResize = () => resize();
    window.addEventListener("resize", onWinResize);

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const fitAndAdd = (obj: THREE.Object3D) => {
      clearModel();
      prepMaterials(obj);
      obj.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(obj);
      if (box.isEmpty()) return;
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);
      const maxD = Math.max(size.x, size.y, size.z, 0.001);
      obj.scale.setScalar(2.4 / maxD);
      pivot.add(obj);
      meshHolder = obj;
      camera.position.set(0, 0, 4.55);
      camera.lookAt(0, 0, 0);
    };

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_PATH);
    dracoLoader.setDecoderConfig({ type: "js" });
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      GLB_PATH,
      (gltf) => {
        if (disposed) return;
        fitAndAdd(gltf.scene);
        setModelLoaded(true);
      },
      undefined,
      (err) => {
        if (disposed) return;
        console.error("[Hero3D] Could not load GLB:", GLB_PATH, err);
        const geo = new THREE.BoxGeometry(1.2, 1.6, 0.45);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.25,
          roughness: 0.45,
        });
        const boxMesh = new THREE.Mesh(geo, mat);
        fitAndAdd(boxMesh);
      }
    );

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;
      ambient.intensity = 0.98 + Math.sin(time * 0.55) * 0.035;
      key.intensity = 1.25 + Math.sin(time * 0.82 + 0.4) * 0.075;
      fill.intensity = 0.35 + Math.cos(time * 0.68 + 1.0) * 0.06;
      pivot.rotation.y += 0.007;
      renderer.render(scene, camera);
    };
    tick();

    if (import.meta.env.DEV) {
      console.info("[Hero3D] GLB path:", GLB_PATH);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onWinResize);
      ro.disconnect();
      clearModel();
      dracoLoader.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  const handleExplore = (e: SyntheticEvent) => {
    e.preventDefault();
    clearTimers();
    setExploreFade(true);
    setTimeout(() => {
      document.getElementById("prices")?.scrollIntoView({ behavior: "smooth" });
    }, 450);
  };

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-visible transition-opacity duration-700 ease-out",
        "bg-transparent",
        exploreFade && "opacity-75"
      )}
    >
      <div className="relative z-0 flex w-full flex-col items-center px-4 pb-16 pt-24 md:pb-20 md:pt-28">
        {/*
          CRITICAL: explicit pixel height on the mount — percentage height collapses and WebGL canvas becomes 0px tall.
        */}
        <div
          ref={mountRef}
          className={cn(
            "relative z-[2] mx-auto w-full max-w-lg overflow-hidden",
            "h-[360px] max-h-[400px] min-h-[300px] sm:h-[380px]",
            "mb-10"
          )}
          aria-label={lang === "ar" ? "نموذج القناع ثلاثي الأبعاد" : "3D Tutankhamun mask"}
        >
          {!modelLoaded && (
            <div className="absolute inset-0 z-[3] flex items-center justify-center">
              <div className="h-48 w-36 animate-pulse rounded-xl bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]/20" />
            </div>
          )}
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center gap-7 text-center md:gap-10">
          <div className="luxury-hero-title-cinematic">
            <div className="luxury-hero-main-title-wrap">
              <h1 lang="en" className="luxury-hero-pharaonic-title text-center">
                Asaar Masr
              </h1>
            </div>
            <WingedSunTitleDivider className="mt-1 max-w-[min(540px,94vw)]" />
          </div>

          <p
            className="font-sans text-[10px] font-light uppercase tracking-[0.42em] text-[#D4AF37] sm:text-xs md:tracking-[0.48em]"
            lang="en"
          >
            Gold &amp; Currency Tracker Egypt
          </p>

          <div
            className="flex min-h-[1.75rem] items-center justify-center font-mono text-sm text-[#D4AF37] md:text-base"
            aria-live="polite"
          >
            <span>{displayLine}</span>
            <span className="ms-0.5 inline-block h-4 w-px animate-pulse bg-[#FFD700]/85" />
          </div>

          <LuxuryRippleButton
            type="button"
            onClick={handleExplore}
            className={cn(
              "luxury-btn-outline-glow rounded-2xl border border-[#D4AF37]/45 bg-white/[0.06] px-10 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.28em] text-[#FFD700]",
              "hover:border-[#FFD700]/65 hover:bg-[#D4AF37]/12",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
            )}
          >
            {lang === "ar" ? "استكشف الآن" : "Explore Now"}
          </LuxuryRippleButton>
        </div>
      </div>
    </section>
  );
}
