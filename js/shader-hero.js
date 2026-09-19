/* Aktenlage — eigener WebGL-Hintergrund für den Startseiten-Hero.
   Keine Bibliotheken, keine externen Aufrufe, kein Tracking. */
(function () {
  "use strict";

  var canvas = document.querySelector("[data-shader]");
  if (!canvas) return;

  var gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: "high-performance"
  });

  if (!gl) {
    canvas.classList.add("is-fallback");
    return;
  }

  var vertexSource = [
    "attribute vec2 a_position;",
    "void main() {",
    "  gl_Position = vec4(a_position, 0.0, 1.0);",
    "}"
  ].join("\n");

  var fragmentSource = [
    "precision highp float;",
    "uniform vec2 u_resolution;",
    "uniform vec2 u_pointer;",
    "uniform float u_time;",
    "",
    "float hash(vec2 p) {",
    "  p = fract(p * vec2(123.34, 456.21));",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",
    "",
    "float noise(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  f = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),",
    "             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);",
    "}",
    "",
    "float fbm(vec2 p) {",
    "  float value = 0.0;",
    "  float amplitude = 0.5;",
    "  for (int i = 0; i < 5; i++) {",
    "    value += amplitude * noise(p);",
    "    p = p * 2.03 + 13.17;",
    "    amplitude *= 0.5;",
    "  }",
    "  return value;",
    "}",
    "",
    "float streak(vec2 p, float baseY, float speed, float offset, float wave) {",
    "  float head = mod(u_time * speed + offset, 3.4) - 1.7;",
    "  float y = baseY + sin(p.x * 2.5 + u_time * 0.28 + offset) * wave;",
    "  float core = exp(-abs(p.y - y) * 145.0);",
    "  float halo = exp(-abs(p.y - y) * 28.0);",
    "  float tail = exp(-max(0.0, head - p.x) * 1.65) * step(p.x, head);",
    "  float tip = exp(-length(vec2((p.x - head) * 2.2, (p.y - y) * 8.0)) * 14.0);",
    "  return core * tail * 0.9 + halo * tail * 0.18 + tip * 1.8;",
    "}",
    "",
    "void main() {",
    "  vec2 frag = gl_FragCoord.xy;",
    "  vec2 uv = (frag - 0.5 * u_resolution.xy) / u_resolution.y;",
    "  vec2 pointer = (u_pointer - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);",
    "  float t = u_time * 0.10;",
    "",
    "  float cloud = fbm(uv * 1.75 + vec2(t * 0.22, -t * 0.12));",
    "  float detail = fbm(uv * 4.2 - vec2(t * 0.08, t * 0.15));",
    "  vec3 navy = vec3(0.018, 0.025, 0.085);",
    "  vec3 indigo = vec3(0.075, 0.035, 0.20);",
    "  vec3 color = mix(navy, indigo, smoothstep(0.18, 0.88, cloud));",
    "  color += vec3(0.015, 0.025, 0.075) * detail;",
    "",
    "  float horizon = exp(-abs(uv.y + 0.015) * 2.4) * 0.12;",
    "  color += vec3(0.10, 0.12, 0.32) * horizon;",
    "",
    "  float s1 = streak(uv, 0.23, 0.23, 0.25, 0.012);",
    "  float s2 = streak(uv, -0.02, 0.17, 1.48, 0.018);",
    "  float s3 = streak(uv, -0.29, 0.27, 2.31, 0.010);",
    "  color += vec3(0.16, 0.78, 1.00) * s1;",
    "  color += vec3(0.47, 0.30, 1.00) * s2;",
    "  color += vec3(1.00, 0.22, 0.62) * s3 * 0.82;",
    "",
    "  float bloomA = exp(-length(uv - vec2(0.52 + sin(t) * 0.12, 0.20)) * 3.2);",
    "  float bloomB = exp(-length(uv - vec2(-0.48 + cos(t * 0.8) * 0.10, -0.24)) * 3.8);",
    "  float pointerGlow = exp(-length(uv - pointer) * 5.0) * 0.10;",
    "  color += vec3(0.10, 0.42, 0.95) * bloomA * 0.32;",
    "  color += vec3(0.58, 0.16, 0.82) * bloomB * 0.28;",
    "  color += vec3(0.30, 0.46, 1.00) * pointerGlow;",
    "",
    "  float vignette = smoothstep(1.15, 0.18, length(uv * vec2(0.82, 1.0)));",
    "  color *= 0.60 + 0.50 * vignette;",
    "  color += (hash(frag + u_time) - 0.5) * 0.016;",
    "  color = color / (1.0 + color);",
    "  color = pow(color, vec3(0.86));",
    "  gl_FragColor = vec4(color, 1.0);",
    "}"
  ].join("\n");

  function shader(type, source) {
    var result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      gl.deleteShader(result);
      return null;
    }
    return result;
  }

  var vertex = shader(gl.VERTEX_SHADER, vertexSource);
  var fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    canvas.classList.add("is-fallback");
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.classList.add("is-fallback");
    return;
  }

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  gl.useProgram(program);
  var position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var pointerLocation = gl.getUniformLocation(program, "u_pointer");
  var timeLocation = gl.getUniformLocation(program, "u_time");
  var pointerTarget = { x: 0.5, y: 0.5 };
  var pointerCurrent = { x: 0.5, y: 0.5 };
  var start = performance.now();
  var frame = 0;
  var visible = true;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    var ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    var width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    var height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function draw(now) {
    resize();
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.035;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.035;
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(pointerLocation, pointerCurrent.x, pointerCurrent.y);
    gl.uniform1f(timeLocation, reducedMotion ? 18.0 : (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!reducedMotion && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function startAnimation() {
    if (frame || reducedMotion || !visible || document.hidden) return;
    start = performance.now();
    frame = requestAnimationFrame(draw);
  }

  function stopAnimation() {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  canvas.parentElement.addEventListener("pointermove", function (event) {
    var rect = canvas.getBoundingClientRect();
    pointerTarget.x = (event.clientX - rect.left) / rect.width;
    pointerTarget.y = 1 - (event.clientY - rect.top) / rect.height;
  }, { passive: true });

  canvas.parentElement.addEventListener("pointerleave", function () {
    pointerTarget.x = 0.5;
    pointerTarget.y = 0.5;
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) startAnimation(); else stopAnimation();
    }, { threshold: 0.01 }).observe(canvas);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAnimation(); else startAnimation();
  });

  window.addEventListener("resize", resize, { passive: true });
  draw(reducedMotion ? 0 : performance.now());
})();
