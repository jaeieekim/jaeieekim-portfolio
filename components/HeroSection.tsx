"use client";

import { useEffect, useRef, useCallback } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_pixelRatio;
  uniform float u_hoveredStone;

  const int NUM_STONES = 5;
  uniform vec3 u_stonesPos[NUM_STONES];
  uniform float u_stonesTime[NUM_STONES];
  uniform float u_hoverFactor[NUM_STONES];

  const vec3 COLOR_BG     = vec3(0.949, 0.941, 0.914);
  const vec3 COLOR_FG     = vec3(0.039, 0.039, 0.039);
  const vec3 COLOR_ACCENT = vec3(1.0, 0.25, 0.0);

  float snoise(vec3 x) {
    const vec3 step = vec3(110.0, 241.0, 171.0);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(fract(sin(n + dot(step, vec3(0,0,0))) * 43758.5453),
              fract(sin(n + dot(step, vec3(1,0,0))) * 43758.5453), u.x),
          mix(fract(sin(n + dot(step, vec3(0,1,0))) * 43758.5453),
              fract(sin(n + dot(step, vec3(1,1,0))) * 43758.5453), u.x), u.y),
      mix(mix(fract(sin(n + dot(step, vec3(0,0,1))) * 43758.5453),
              fract(sin(n + dot(step, vec3(1,0,1))) * 43758.5453), u.x),
          mix(fract(sin(n + dot(step, vec3(0,1,1))) * 43758.5453),
              fract(sin(n + dot(step, vec3(1,1,1))) * 43758.5453), u.x), u.y), u.z);
  }

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    uv.x -= 0.35;

    vec4 finalColor = vec4(0.0);

    for (int i = 0; i < NUM_STONES; i++) {
      vec2 basePos  = u_stonesPos[i].xy;
      float baseSize = u_stonesPos[i].z;
      float localTime = u_stonesTime[i];
      float hoverAmt  = u_hoverFactor[i];

      float bobOffset = float(i) * 0.5;
      float bob = sin(localTime * 1.5 + bobOffset) * 0.03 * hoverAmt;
      vec2 pos = basePos + vec2(0.0, bob);

      float aspectX = 0.9 + mod(float(i) * 2.1, 0.8);
      float aspectY = 0.6 + mod(float(i) * 3.7, 0.6);
      float rotAngle = (float(i) - 2.0) * 0.18 + sin(localTime * 0.2 + float(i) * 2.3) * 0.025;
      vec2 shapeSize = vec2(baseSize * aspectX, baseSize * aspectY);

      vec2 warpedUv = uv - pos;
      float c = cos(rotAngle);
      float s = sin(rotAngle);
      vec2 rotUv = vec2(warpedUv.x * c - warpedUv.y * s, warpedUv.x * s + warpedUv.y * c);

      float warpNoise = snoise(vec3(rotUv * 3.5, float(i) * 12.0)) * 0.06;
      float edgeNoise = snoise(vec3(rotUv * 8.0, float(i) * 17.0)) * 0.035;
      float fineNoise = snoise(vec3(rotUv * 15.0, float(i) * 23.0)) * 0.015;
      float cornerR   = 0.02 + mod(float(i) * 1.7, 4.0) * 0.025;

      float d = sdRoundBox(rotUv + warpNoise + edgeNoise + fineNoise, shapeSize, cornerR);

      if (d < 0.0) {
        float gridDensity = 160.0;
        vec2 gridPos  = warpedUv * gridDensity;
        vec2 cellId   = floor(gridPos);
        vec2 cellFract = fract(gridPos) - 0.5;

        vec3 noiseSpace = vec3(cellId * 0.15, localTime * 2.0);
        float nVal = snoise(noiseSpace);

        vec3 stoneColor;
        if (u_hoveredStone >= 0.0) {
          stoneColor = (int(u_hoveredStone) == i) ? COLOR_ACCENT : COLOR_FG;
        } else {
          stoneColor = (i == 0) ? COLOR_ACCENT : COLOR_FG;
        }

        float maxRadius = 0.35;
        float radius = 0.0;
        if (nVal > 0.0) {
          radius = maxRadius * (0.3 + 0.7 * nVal);
        }

        float distToCenter = length(cellFract);
        float smoothing = 1.5 / (gridDensity * min(u_resolution.x, u_resolution.y) / 1000.0);
        float dotAlpha = 1.0 - smoothstep(radius - smoothing, radius + smoothing, distToCenter);

        if (dotAlpha > 0.0) {
          finalColor = mix(finalColor, vec4(stoneColor, 1.0), dotAlpha);
        }
      }
    }

    gl_FragColor = finalColor;
  }
`;

const STONE_DEFINITIONS = [
  { x:  0.00, y: -0.28, size: 0.13 },
  { x:  0.02, y: -0.09, size: 0.11 },
  { x: -0.01, y:  0.07, size: 0.09 },
  { x:  0.03, y:  0.20, size: 0.07 },
  { x: -0.02, y:  0.32, size: 0.05 },
];

const SECTIONS = [
  { id: "main",    label: "01F. Main" },
  { id: "project", label: "02F. Project" },
  { id: "about",   label: "03F. About me" },
  { id: "contact", label: "04F. Contact" },
];

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);
  const hoveredStoneRef = useRef(-1);
  const stoneSpeedsRef = useRef(new Float32Array(5).fill(1));
  const targetSpeedsRef = useRef(new Float32Array(5).fill(1));
  const stonesTimeRef = useRef(new Float32Array(5));
  const hoverFactorsRef = useRef(new Float32Array(5).fill(1));
  const rafRef = useRef<number>(0);

  const positionLabels = useCallback((width: number, height: number) => {
    const container = labelContainerRef.current;
    if (!container) return;
    const minDim = Math.min(width, height);
    const labels = container.querySelectorAll<HTMLDivElement>("[data-stone]");
    let leftmost = Infinity;
    for (const s of STONE_DEFINITIONS) {
      const edge = (s.x + 0.35 - s.size * 1.5) * minDim + 0.5 * width;
      if (edge < leftmost) leftmost = edge;
    }
    const labelX = leftmost - 20;
    // 라벨 0(MAIN)=가장 아래, 라벨 3(CONTACT)=가장 위에 고정하고 사이 간격을 균등 분배
    const bottomCssY = 0.5 * height - STONE_DEFINITIONS[0].y * minDim - 8 + 40;
    const topCssY    = 0.5 * height - STONE_DEFINITIONS[3].y * minDim - 8 + 40;
    const step = (bottomCssY - topCssY) / (SECTIONS.length - 1) - 10;
    labels.forEach((label, i) => {
      const cssY = topCssY + (SECTIONS.length - 1 - i) * step;
      label.style.left = `${labelX}px`;
      label.style.top  = `${cssY}px`;
      label.style.transform = "translateX(-100%)";
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;
    const program = createProgram(gl, vs, fs);
    if (!program) return;

    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1,  1,
      -1,  1,  1, -1,   1,  1,
    ]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes        = gl.getUniformLocation(program, "u_resolution");
    const uPixelRatio = gl.getUniformLocation(program, "u_pixelRatio");
    const uStonesPos  = gl.getUniformLocation(program, "u_stonesPos");
    const uStonesTime = gl.getUniformLocation(program, "u_stonesTime");
    const uHoverFactor = gl.getUniformLocation(program, "u_hoverFactor");
    const uHoveredStone = gl.getUniformLocation(program, "u_hoveredStone");

    const stonesPosFlat = new Float32Array(STONE_DEFINITIONS.flatMap(s => [s.x, s.y, s.size]));

    let width = 0, height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uPixelRatio, dpr);
      positionLabels(width, height);
    };
    resize();
    // Label 0 is active by default, matching stone 0 being orange
    labelContainerRef.current?.querySelectorAll<HTMLDivElement>("[data-stone]").forEach((el, i) => {
      if (i === 0) el.classList.add("label-active");
    });
    window.addEventListener("resize", resize);

    let lastTime = 0;
    const render = (now: number) => {
      now *= 0.001;
      const dt = now - lastTime;
      lastTime = now;

      const speeds = stoneSpeedsRef.current;
      const targets = targetSpeedsRef.current;
      const times = stonesTimeRef.current;
      const hovers = hoverFactorsRef.current;

      for (let i = 0; i < 5; i++) {
        speeds[i] += (targets[i] - speeds[i]) * 0.1;
        times[i]  += dt * speeds[i];
        hovers[i]  = speeds[i];
      }

      gl.uniform3fv(uStonesPos, stonesPosFlat);
      gl.uniform1fv(uStonesTime, times);
      gl.uniform1fv(uHoverFactor, hovers);
      gl.uniform1f(uHoveredStone, hoveredStoneRef.current);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    // Mouse move — canvas proximity hover
    const onMouseMove = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-stone]")) return;
      const minDim = Math.min(width, height);
      let nx = (e.clientX - width  / 2 - 30) / minDim - 0.35;
      let ny = -(e.clientY - height / 2) / minDim;

      let closest = -1, minDist = 999;
      for (let i = 0; i < STONE_DEFINITIONS.length; i++) {
        const s = STONE_DEFINITIONS[i];
        if (nx > s.x - s.size * 1.4 - 0.05 && nx < s.x + s.size * 1.4 + 0.05 &&
            ny > s.y - s.size * 0.8 - 0.05 && ny < s.y + s.size * 0.8 + 0.05) {
          const d = (nx - s.x) ** 2 + (ny - s.y) ** 2;
          if (d < minDist) { minDist = d; closest = i; }
        }
      }
      for (let i = 0; i < 5; i++) targetSpeedsRef.current[i] = closest === i ? 0 : 1;
      hoveredStoneRef.current = closest;

      labelContainerRef.current?.querySelectorAll<HTMLDivElement>("[data-stone]").forEach((el, i) => {
        el.classList.toggle("label-hovered", i === closest);
        el.classList.toggle("label-active", closest < 0 && i === 0);
      });
    };

    const onMouseLeave = () => {
      targetSpeedsRef.current.fill(1);
      hoveredStoneRef.current = -1;
      labelContainerRef.current?.querySelectorAll<HTMLDivElement>("[data-stone]").forEach((el, i) => {
        el.classList.remove("label-hovered");
        el.classList.toggle("label-active", i === 0);
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [positionLabels]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "100vh" }}>

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10"
        style={{ width: "100%", height: "100%", transform: "translateX(30px)" }}
      />

      {/* Floor labels (absolute-positioned by JS) */}
      <div ref={labelContainerRef} className="absolute inset-0 z-30 pointer-events-none" style={{ transform: "translateX(30px)" }}>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            data-stone={i}
            onClick={() => scrollTo(s.id)}
            className="absolute pointer-events-auto cursor-pointer bg-transparent border-0 p-0 text-left floor-label"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "var(--letter-spacing-label)",
              color: "var(--color-fg)",
              transition: "color 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={() => {
              targetSpeedsRef.current[i] = 0;
              hoveredStoneRef.current = i;
              labelContainerRef.current?.querySelectorAll<HTMLDivElement>("[data-stone]").forEach((el, j) => {
                el.classList.toggle("label-hovered", j === i);
                el.classList.remove("label-active");
              });
            }}
            onMouseLeave={() => {
              targetSpeedsRef.current[i] = 1;
              hoveredStoneRef.current = -1;
              labelContainerRef.current?.querySelectorAll<HTMLDivElement>("[data-stone]").forEach((el, j) => {
                el.classList.remove("label-hovered");
                el.classList.toggle("label-active", j === 0);
              });
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Label active/hover color via injected style */}
      <style>{`
        .floor-label.label-hovered,
        .floor-label.label-active { color: var(--color-accent) !important; }
      `}</style>
    </div>
  );
}
