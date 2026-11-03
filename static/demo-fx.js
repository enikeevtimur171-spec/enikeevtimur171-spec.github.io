// Демо-сайт (03.11): живой фон первого экрана на чистом WebGL, без библиотек, около 3 КБ.
// Режим по группе ниши: silk (красота), chrome (машины), ember (кафе), aurora (услуги).
// Под холстом всегда лежит статичный CSS-градиент: на слабом телефоне, при «уменьшить движение»
// и без WebGL страница выглядит так же, только без движения. Запускается после первого кадра страницы.
(function () {
  var cv = document.getElementById('fx');
  if (!cv) return;
  var slow = (navigator.deviceMemory && navigator.deviceMemory < 3) ||
             (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  if (slow || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function hex(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); }
  var MODES = { silk: 0, chrome: 1, ember: 2, aurora: 3 };

  var FS = [
    'precision mediump float;',
    'uniform vec2 r; uniform float t, m; uniform vec3 a, b, c;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
    ' return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,s=.5;for(int i=0;i<4;i++){v+=s*n(p);p=p*2.03+7.1;s*=.5;}return v;}',
    'void main(){',
    ' vec2 p=gl_FragCoord.xy/r; p.x*=r.x/r.y; vec3 col;',
    ' if(m<.5){', // шёлк: мягкие складки ткани
    '  float w=sin(p.x*2.6+p.y*1.4+fbm(p*1.6+t*.04)*5.+t*.18);',
    '  float s=smoothstep(-.4,1.,w); col=mix(a,mix(b,c,.35),s); col=mix(col,c,pow(s,4.)*.55);',
    '  col+=vec3(1.)*pow(s,10.)*.25;', // блик на складке
    ' }else if(m<1.5){', // хром: блики по тёмному металлу
    '  float f=fbm(p*1.8+vec2(t*.05,0.));',
    '  float s=pow(abs(sin(p.x*1.7-p.y*1.1+f*4.+t*.22)),6.);',
    '  col=a+b*1.2*f+mix(c,vec3(1.),.4)*s*.85;',
    ' }else if(m<2.5){', // жар: тёплое свечение снизу
    '  float g=fbm(p*1.6+vec2(0.,-t*.08))*(1.45-p.y);',
    '  col=mix(a,b*1.6,smoothstep(.1,.6,g)); col+=c*pow(max(g,0.),2.)*1.1;',
    ' }else{', // сияние: спокойные полосы света
    '  float g=fbm(vec2(p.x*1.6+t*.04,p.y*.8-t*.03));',
    '  float band=smoothstep(.3,.7,g)*(1.15-abs(p.y-.7)*1.2);',
    '  col=mix(a,b,clamp(band*1.3,0.,1.)); col=mix(col,c,clamp(band*band*.8,0.,.7));',
    ' }',
    ' gl_FragColor=vec4(col,1.);}'
  ].join('\n');

  function start() {
    var gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 v;void main(){gl_Position=vec4(v,0.,1.);}'));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var U = function (k) { return gl.getUniformLocation(pr, k); };
    var d = cv.dataset;
    gl.uniform3fv(U('a'), hex(d.c1)); gl.uniform3fv(U('b'), hex(d.c2)); gl.uniform3fv(U('c'), hex(d.c3));
    gl.uniform1f(U('m'), MODES[d.mode] || 0);
    var uT = U('t'), uR = U('r'), on = true, t0 = performance.now(), shown = false;

    function size() {  // половина разрешения: градиенту резкость не нужна, а батарее легче
      var k = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      cv.width = Math.max(1, cv.clientWidth * k | 0); cv.height = Math.max(1, cv.clientHeight * k | 0);
      gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(uR, cv.width, cv.height);
    }
    function frame(now) {
      if (!on) return;
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) { shown = true; cv.classList.add('on'); }
      requestAnimationFrame(frame);
    }
    function run(v) { if (v && !on) { on = true; requestAnimationFrame(frame); } else if (!v) on = false; }
    size();
    addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { run(e[0].isIntersecting); }).observe(cv);
    document.addEventListener('visibilitychange', function () { run(!document.hidden); });
    requestAnimationFrame(frame);
  }
  var go = function () {
    if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 600 }); else setTimeout(start, 200);
  };
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();
