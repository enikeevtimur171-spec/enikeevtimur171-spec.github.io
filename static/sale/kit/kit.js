(()=>{const{animate,inView,scroll,stagger}=window.Motion||{},calm=matchMedia('(prefers-reduced-motion:reduce)').matches||location.search=='?still',E=[.22,1,.36,1];
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
if(animate&&!calm){
$$('[data-lines]').forEach(h=>{const l=$$('.ln>i',h);l.forEach(x=>x.style.transform='translateY(110%)');inView(h,()=>{animate(l,{y:['110%','0%']},{duration:1,ease:E,delay:stagger(.09)})},{amount:.1})});
$$('[data-r]').forEach(e=>{e.style.opacity=0;inView(e,()=>{animate(e,{opacity:[0,1],y:[28,0]},{duration:.8,ease:E,delay:+e.dataset.r||0})},{amount:.05})});
$$('[data-shut]').forEach(e=>{e.style.clipPath='inset(100% 0 0 0)';inView(e.parentElement,()=>{animate(e,{clipPath:['inset(100% 0 0 0)','inset(0% 0 0 0)']},{duration:1.1,ease:E})},{amount:.01})});
$$('[data-px]').forEach(e=>{const d=+e.dataset.px||60;scroll(animate(e,{y:[-d,d]},{ease:'linear'}),{target:e.parentElement,offset:['start end','end start']})});
}
$$('[data-count]').forEach(e=>{const to=+e.dataset.count;if(!animate||calm){e.textContent=to.toLocaleString('ru');return}inView(e,()=>{animate(0,to,{duration:1.4,ease:E,onUpdate:v=>e.textContent=Math.round(v).toLocaleString('ru')})})});
const FS=`precision highp float;uniform vec2 r;uniform float t,k;uniform vec2 m;uniform vec3 a,b,c;void main(){vec2 p=gl_FragCoord.xy/r.y*1.5;for(float i=1.;i<6.;i++){p.x+=.62/i*sin(i*2.1*p.y+t*.32+m.x*1.2);p.y+=.62/i*cos(i*1.7*p.x+t*.26+m.y*1.2);}float v=.5+.5*sin(p.x+p.y);vec3 s=mix(a,b,smoothstep(0.,.62,v));s=mix(s,c,smoothstep(.62,1.,v));float w=.5+.5*sin(7.*(p.x-p.y));vec3 h=mix(a,b,pow(w,1.6));h=mix(h,c,pow(w,9.));gl_FragColor=vec4(mix(s,h,k),1.);}`;
const hex=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255);
$$('canvas[data-shader]').forEach(cv=>{const g=cv.getContext('webgl',{antialias:false,powerPreference:'low-power'});if(!g)return;
const sh=(y,s)=>{const o=g.createShader(y);g.shaderSource(o,s);g.compileShader(o);return o},P=g.createProgram();g.attachShader(P,sh(g.VERTEX_SHADER,'attribute vec2 q;void main(){gl_Position=vec4(q,0.,1.);}'));g.attachShader(P,sh(g.FRAGMENT_SHADER,FS));g.linkProgram(P);g.useProgram(P);
g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer());g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);g.enableVertexAttribArray(0);g.bindAttribLocation(P,0,'q');g.vertexAttribPointer(g.getAttribLocation(P,'q'),2,g.FLOAT,false,0,0);
const U=n=>g.getUniformLocation(P,n),[A,B,C]=cv.dataset.shader.split(',').map(hex);g.uniform3fv(U('a'),A);g.uniform3fv(U('b'),B);g.uniform3fv(U('c'),C);g.uniform1f(U('k'),+cv.dataset.metal||0);
let mx=0,my=0,tx=0,ty=0,on=true;addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
const fit=()=>{const d=Math.min(devicePixelRatio,1.5),w=cv.clientWidth*d|0,h=cv.clientHeight*d|0;if(cv.width!=w||cv.height!=h){cv.width=w;cv.height=h;g.viewport(0,0,w,h);g.uniform2f(U('r'),w,h)}};
const f=n=>{fit();mx+=(tx-mx)*.04;my+=(ty-my)*.04;g.uniform1f(U('t'),n/1000+40);g.uniform2f(U('m'),mx,my);g.drawArrays(g.TRIANGLES,0,3);if(on&&!calm)requestAnimationFrame(f)};
new IntersectionObserver(([e])=>{const w=on;on=e.isIntersecting;if(on&&!w)requestAnimationFrame(f)}).observe(cv);requestAnimationFrame(f);addEventListener('resize',()=>calm&&requestAnimationFrame(f))});
if(!document.body.dataset.nodemo){const d=document.createElement('div');d.className='demo';d.innerHTML='<span>Демонстрационный сайт: компания, цены и контакты вымышлены.</span><span><a href="credits.html">Авторы фото</a> · <a href="index.html">Все работы</a></span>';document.body.append(d)}
})();
