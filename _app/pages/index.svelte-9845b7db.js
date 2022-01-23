import{U as ye,S as N,i as U,s as J,e as k,c as M,a as R,d as h,b as m,f as ue,g as C,V as te,W as pe,X as _e,q as E,n as de,o as F,p as fe,L as O,M as Q,Y as ke,Z as he,_ as me,$ as Me,a0 as ve,O as S,H as x,I as K,w as X,k as re,t as G,x as $,m as oe,h as z,y as Y,J as j,a1 as V,B as Z,a2 as Re,v as Se,C as De,z as Be,A as Ae}from"../chunks/vendor-2fb89ece.js";import{d as we,i as ge}from"../chunks/i18n-738d18c5.js";import{S as je}from"../chunks/StoryCardList-836aec1d.js";import{H as Ie}from"../chunks/Helmet-fa6b2b32.js";import"../chunks/image-15d1cba6.js";const Pe=(e,r,t)=>{const n=[],o=[],i=[],c=[];for(let s=0;s<=r;s+=1){const u=Math.PI/r*s;for(let a=0;a<=t;a+=1){const l=Math.PI*2/t*a,_=[Math.sin(u)*Math.cos(l),Math.sin(u)*Math.sin(l),Math.cos(u)];c.push(_),n.push(_.map(v=>v*e)),i.push([1-a/t,s/r]),s<r&&a<t&&o.push([s*(t+1)+a,(s+1)*(t+1)+a,(s+1)*(t+1)+a+1],[s*(t+1)+a,(s+1)*(t+1)+a+1,s*(t+1)+a+1])}}return{vertices:n,faces:o,uvs:i,normals:c}},ie=Pe(1,30,60),Te={0:"#3288bd",.1:"#66c2a5",.2:"#abdda4",.3:"#e6f598",.4:"#fee08b",.5:"#fdae61",.6:"#f46d43",1:"#d53e4f"},q=192,Ce=e=>{const r=document.createElement("canvas");r.width=256,r.height=1;const t=r.getContext("2d"),n=t.createLinearGradient(0,0,256,0);for(const o in e)n.addColorStop(+o,e[o]);return t.fillStyle=n,t.fillRect(0,0,256,1),new Uint8Array(t.getImageData(0,0,256,1).data)},ee=q**2,xe=new Uint8Array(ee*4).fill(null).map(()=>Math.floor(Math.random()*256));var Ee=(e,r,t,n,o)=>{const i=e.texture({data:Ce(Te),width:16,height:16,mag:"linear",min:"linear"}),c=[e.texture({data:xe,width:q,height:q,mag:"nearest",min:"nearest"}),e.texture({data:xe,width:q,height:q,mag:"nearest",min:"nearest"})],s=e.framebuffer({depthStencil:!1,colorCount:1,colorFormat:"rgba",colorType:"uint8"}),u=e.buffer(new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1])),a=new Float32Array(ee);for(let g=0;g<ee;g+=1)a[g]=g;const l=e.buffer(a),_=e({frag:`
      precision highp float;
      
      uniform sampler2D u_particles;
      uniform sampler2D u_wind;
      uniform vec2 u_wind_res;
      uniform vec2 u_wind_min;
      uniform vec2 u_wind_max;
      uniform float u_rand_seed;
      uniform float u_speed_factor;
      uniform float u_drop_rate;
      uniform float u_drop_rate_bump;
      
      varying vec2 v_tex_pos;
      
      const vec2 bitEnc = vec2(1.,255.);
      const vec2 bitDec = 1./bitEnc;
      
      // decode particle position from pixel RGBA
      vec2 fromRGBA(const vec4 color) {
        vec4 rounded_color = floor(color * 255.0 + 0.5) / 255.0;
        float x = dot(rounded_color.rg, bitDec);
        float y = dot(rounded_color.ba, bitDec);
        return vec2(x, y);
      }
      
      // encode particle position to pixel RGBA
      vec4 toRGBA (const vec2 pos) {
        vec2 rg = bitEnc * pos.x;
        rg = fract(rg);
        rg -= rg.yy * vec2(1. / 255., 0.);
      
        vec2 ba = bitEnc * pos.y;
        ba = fract(ba);
        ba -= ba.yy * vec2(1. / 255., 0.);
      
        return vec4(rg, ba);
      }
      
      // pseudo-random generator
      const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
      float rand(const vec2 co) {
        float t = dot(rand_constants.xy, co);
        return fract(sin(t) * (rand_constants.z + t));
      }
  
      // wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
      vec2 lookup_wind(const vec2 uv) {
        // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
        vec2 px = 1.0 / u_wind_res;
        vec2 vc = (floor(uv * u_wind_res)) * px;
        vec2 f = fract(uv * u_wind_res);
        vec2 tl = texture2D(u_wind, vc).rg;
        vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;
        vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;
        vec2 br = texture2D(u_wind, vc + px).rg;
        return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
      }
    
      void main() {
        vec4 color = texture2D(u_particles, v_tex_pos);
    
        vec2 pos = fromRGBA(color);
    
        vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
        float speed_t = length(velocity) / length(u_wind_max);
    
        // take EPSG:4236 distortion into account for calculating where the particle moved
        float distortion = 1.0; //cos(radians(pos.y * 180.0 - 90.0));
        vec2 offset = vec2(velocity.x / distortion, -velocity.y) * 0.0001 * u_speed_factor;
    
        // update particle position, wrapping around the date line
        pos = fract(1.0 + pos + offset);
    
        // a random seed to use for the particle drop
        vec2 seed = (pos + v_tex_pos) * u_rand_seed;
    
        // drop rate is a chance a particle will restart at random position, to avoid degeneration
        float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
        float drop = step(1.0 - drop_rate, rand(seed));
    
        vec2 random_pos = vec2(
            rand(seed + 1.3),
            rand(seed + 2.1));
        pos = mix(pos, random_pos, drop);
    
        // encode the new particle position back into RGBA
        gl_FragColor = toRGBA(pos);
      }`,vert:`
      precision mediump float;
      attribute vec2 a_pos;
      varying vec2 v_tex_pos;
      
      void main() {
        v_tex_pos = a_pos;
        gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
      }`,primitive:"triangles",count:6,viewport:{width:q,height:q},depth:{enable:!1},stencil:{enable:!1},attributes:{a_pos:e.prop("quadBuffer")},uniforms:{u_wind:e.prop("windTexture"),u_particles:e.prop("particleStateTexture"),u_rand_seed:()=>Math.random(),u_wind_res:e.prop("windRes"),u_wind_min:e.prop("windMin"),u_wind_max:e.prop("windMax"),u_speed_factor:e.prop("speedFactor"),u_drop_rate:e.prop("dropRate"),u_drop_rate_bump:e.prop("dropRateBump")}}),v=()=>{s({color:c[1]}),s.use(()=>{_({quadBuffer:u,windTexture:e.texture(t),particleStateTexture:c[0],windRes:[n.width,n.height],windMin:[n.uMin,n.vMin],windMax:[n.uMax,n.vMax],speedFactor:.25,dropRate:.003,dropRateBump:.01})});const g=c[0];c[0]=c[1],c[1]=g},y=new Uint8Array(o.width*o.height*4),d=[e.texture({data:y,mag:"nearest",min:"nearest",width:o.width,height:o.height}),e.texture({data:y,mag:"nearest",min:"nearest",width:o.width,height:o.height})],D=e({primitive:"points",count:ee,viewport:{width:o.width,height:o.height},depth:{enable:!1},stencil:{enable:!1},vert:`
      precision highp float;
      
      attribute float a_index;
      
      uniform sampler2D u_particles;
      uniform float u_particles_res;
      
      varying vec2 v_particle_pos;
      
      const vec2 bitEnc = vec2(1.,255.);
      const vec2 bitDec = 1./bitEnc;
      
      // decode particle position from pixel RGBA
      vec2 fromRGBA(const vec4 color) {
        vec4 rounded_color = floor(color * 255.0 + 0.5) / 255.0;
        float x = dot(rounded_color.rg, bitDec);
        float y = dot(rounded_color.ba, bitDec);
        return vec2(x, y);
      }
       
      void main() {
        vec4 color = texture2D(u_particles, vec2(
          fract(a_index / u_particles_res),
          floor(a_index / u_particles_res) / u_particles_res));
      
        // decode current particle position from the pixel's RGBA value
        v_particle_pos = fromRGBA(color);
      
        gl_PointSize = 1.0;
        gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);
      }`,frag:`
      precision highp float;
  
      uniform sampler2D u_wind;
      uniform vec2 u_wind_min;
      uniform vec2 u_wind_max;
      uniform sampler2D u_color_ramp;
      
      varying vec2 v_particle_pos;
      
      void main() {
        vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);
        float speed_t = length(velocity) / length(u_wind_max);
      
        // color ramp is encoded in a 16x16 texture
        vec2 ramp_pos = vec2(
          fract(16.0 * speed_t),
          floor(16.0 * speed_t) / 16.0);
      
        gl_FragColor = texture2D(u_color_ramp, ramp_pos);
      }`,attributes:{a_index:e.prop("particleIndexBuffer")},uniforms:{u_wind:e.prop("windTexture"),u_particles:e.prop("particleStateTexture"),u_color_ramp:e.prop("colorRampTexture"),u_particles_res:e.prop("particleStateResolution"),u_wind_min:e.prop("windMin"),u_wind_max:e.prop("windMax")}}),B=e({frag:`
      precision highp float;
  
      uniform sampler2D u_screen;
      uniform float u_opacity;
  
      varying vec2 v_tex_pos;
  
      void main() {
        vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);
        // a hack to guarantee opacity fade out even with a value close to 1.0
        gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
      }`,vert:`
      precision mediump float;
      attribute vec2 a_pos;
      varying vec2 v_tex_pos;
  
      void main() {
        v_tex_pos = a_pos;
        gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
      }`,blend:{enable:e.prop("blend"),func:{srcRGB:"src alpha",srcAlpha:1,dstRGB:"one minus src alpha",dstAlpha:1}},viewport:{width:o.width,height:o.height},depth:{enable:!1},stencil:{enable:!1},attributes:{a_pos:e.prop("quadBuffer")},uniforms:{u_opacity:e.prop("opacity"),u_screen:e.prop("texture")},primitive:"triangles",count:6}),f=()=>{const g=d[0],W=d[1];s({color:W}),s.use(()=>{B({texture:g,blend:!1,opacity:.95,quadBuffer:u}),D({particleStateResolution:q,windMin:[n.uMin,n.vMin],windMax:[n.uMax,n.vMax],colorRampTexture:i,particleStateTexture:c[0],windTexture:e.texture(t),particleIndexBuffer:l})});const P=g;d[0]=W,d[1]=P},I=e({frag:`
      precision mediump float;
      varying vec2 vertex;
      uniform sampler2D tex, texScreen;
  
      void main () {
        gl_FragColor = texture2D(tex, vertex) + texture2D(texScreen, vec2(vertex.x, 1.0 - vertex.y)) / 1.4;
      }`,vert:`
      precision mediump float;
      attribute vec2 uv;
      attribute vec3 position;
      varying vec2 vertex;
      uniform float tick;
      uniform vec3 axis;
      uniform mat4 projection, view;
      const float PI = 3.14159;
  
      vec3 quatRotate(vec3 v){
        float turn = -0.05 * tick * PI / 180.0;
        vec4 q = vec4(axis * sin(turn), cos(turn));
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
      }
  
      void main () {
        vertex = uv.xy;
        gl_Position = projection * view * vec4(quatRotate(position.xzy), 1.0);
      }`,attributes:{position:ie.vertices,uv:ie.uvs},uniforms:{tex:e.texture(r),texScreen:e.prop("texScreen"),tick:e.prop("tick"),axis:[0,1,0]},elements:ie.faces});let A=0;const w=ye(e,{center:[0,0,0],theta:-Math.PI/2,phi:Math.PI/12,distance:3.5,damping:.5,renderOnDirty:!1,zoomSpeed:0,mouse:!1});e.frame(()=>{w(()=>{e.clear({color:[0,0,0,0]}),v(),f(),I({tick:A,texScreen:d[0]}),A+=1})})};function be(e){let r,t,n,o,i=`${e[2]}px`,c;return{c(){r=k("canvas"),this.h()},l(s){r=M(s,"CANVAS",{width:!0,height:!0}),R(r).forEach(h),this.h()},h(){m(r,"width",t=e[2]*e[3]),m(r,"height",n=e[2]*e[3]),ue(r,"width",i,!1)},m(s,u){C(s,r,u),e[12](r),c=!0},p(s,u){(!c||u&12&&t!==(t=s[2]*s[3]))&&m(r,"width",t),(!c||u&12&&n!==(n=s[2]*s[3]))&&m(r,"height",n),u&4&&i!==(i=`${s[2]}px`)&&ue(r,"width",i,!1)},i(s){c||(te(()=>{o||(o=pe(r,he,{},!0)),o.run(1)}),c=!0)},o(s){o||(o=pe(r,he,{},!1)),o.run(0),c=!1},d(s){s&&h(r),e[12](null),s&&o&&o.end()}}}function Ge(e){let r,t,n,o=e[1]&&e[2]&&be(e);return{c(){r=k("div"),o&&o.c(),this.h()},l(i){r=M(i,"DIV",{class:!0});var c=R(r);o&&o.l(c),c.forEach(h),this.h()},h(){m(r,"class","wrapper svelte-xh1wgb"),te(()=>e[13].call(r))},m(i,c){C(i,r,c),o&&o.m(r,null),t=_e(r,e[13].bind(r)),n=!0},p(i,[c]){i[1]&&i[2]?o?(o.p(i,c),c&6&&E(o,1)):(o=be(i),o.c(),E(o,1),o.m(r,null)):o&&(de(),F(o,1,1,()=>{o=null}),fe())},i(i){n||(E(o),n=!0)},o(i){F(o),n=!1},d(i){i&&h(r),o&&o.d(),t()}}}function ze(e,r,t){let n,o,i,c=0,s=0,u;const a=O("theme");Q(e,a,w=>t(11,i=w));let l,_,v,y;const d=new Image;d.src="/covers/earth-base-dark.jpg",d.onload=()=>{t(5,l=d)};const D=new Image;D.src="/covers/earth-base-light.jpg",D.onload=()=>{t(6,_=D)};const B=new Image;B.src="/covers/earth-wind.png",B.onload=()=>{t(7,v=B)},fetch("/covers/earth-wind.json").then(w=>w.json()).then(w=>{t(8,y=w)});let f;ke(()=>{f&&f.destroy()});function I(w){me[w?"unshift":"push"](()=>{u=w,t(0,u)})}function A(){c=this.clientWidth,s=this.clientHeight,t(1,c),t(2,s)}return e.$$.update=()=>{e.$$.dirty&2144&&t(10,o=i==="dark"?l:_),e.$$.dirty&1921&&u&&o&&v&&y&&!f&&(t(9,f=Me(u)),Ee(f,o,v,y,u))},t(3,n=typeof window=="object"&&window.devicePixelRatio||1),[u,c,s,n,a,l,_,v,y,f,o,i,I,A]}class qe extends N{constructor(r){super();U(this,r,ze,Ge,J,{})}}function Fe(e){let r,t,n;return{c(){r=k("div"),t=k("img"),this.h()},l(o){r=M(o,"DIV",{class:!0});var i=R(r);t=M(i,"IMG",{class:!0,src:!0,alt:!0}),i.forEach(h),this.h()},h(){m(t,"class","taipei-map svelte-npe1bx"),ve(t.src,n="covers/taipei_streets_"+(e[2]==="dark"?"white":"black")+".svg")||m(t,"src",n),m(t,"alt","Taipei Map"),S(t,"prioritizeWidth",e[0]),m(r,"class","wrapper svelte-npe1bx")},m(o,i){C(o,r,i),x(r,t),e[6](r)},p(o,[i]){i&4&&!ve(t.src,n="covers/taipei_streets_"+(o[2]==="dark"?"white":"black")+".svg")&&m(t,"src",n),i&1&&S(t,"prioritizeWidth",o[0])},i:K,o:K,d(o){o&&h(r),e[6](null)}}}const Le=580,Ve=550;function We(e,r,t){let n,o,{width:i}=r,{height:c}=r;const s=O("theme");Q(e,s,l=>t(2,o=l));let u;function a(l){me[l?"unshift":"push"](()=>{u=l,t(1,u)})}return e.$$set=l=>{"width"in l&&t(4,i=l.width),"height"in l&&t(5,c=l.height)},e.$$.update=()=>{e.$$.dirty&48&&t(0,n=i/c>Le/Ve),e.$$.dirty&17},[n,u,o,s,i,c,a]}class He extends N{constructor(r){super();U(this,r,We,Fe,J,{width:4,height:5})}}function Ne(e){let r;return{c(){r=k("div"),this.h()},l(t){r=M(t,"DIV",{class:!0}),R(r).forEach(h),this.h()},h(){m(r,"class","svelte-1tx04cq")},m(t,n){C(t,r,n)},p:K,i:K,o:K,d(t){t&&h(r)}}}class Ue extends N{constructor(r){super();U(this,r,null,Ne,J,{})}}function Je(e){let r,t,n,o,i,c,s,u,a,l,_,v,y,d,D,B,f,I,A,w,g,W;var P=e[4][e[0]];function se(p){return{props:{width:p[1],height:p[2]}}}return P&&(t=new P(se(e))),{c(){r=k("div"),t&&X(t.$$.fragment),o=re(),i=k("div"),c=k("div"),s=k("div"),u=k("span"),a=G("Daniel Kao"),l=G(` is a
      `),_=k("span"),v=G("graphics journalist"),y=G(` at commonwealth magazine,
      `),d=k("span"),D=G("taiwanese-californian"),B=G(`, currently living in
      `),f=k("span"),I=G("taipei, taiwan"),A=G("."),this.h()},l(p){r=M(p,"DIV",{class:!0});var b=R(r);t&&$(t.$$.fragment,b),b.forEach(h),o=oe(p),i=M(p,"DIV",{class:!0});var L=R(i);c=M(L,"DIV",{class:!0});var H=R(c);s=M(H,"DIV",{class:!0});var T=R(s);u=M(T,"SPAN",{class:!0});var ae=R(u);a=z(ae,"Daniel Kao"),ae.forEach(h),l=z(T,` is a
      `),_=M(T,"SPAN",{class:!0});var ne=R(_);v=z(ne,"graphics journalist"),ne.forEach(h),y=z(T,` at commonwealth magazine,
      `),d=M(T,"SPAN",{class:!0});var ce=R(d);D=z(ce,"taiwanese-californian"),ce.forEach(h),B=z(T,`, currently living in
      `),f=M(T,"SPAN",{class:!0});var le=R(f);I=z(le,"taipei, taiwan"),le.forEach(h),A=z(T,"."),T.forEach(h),H.forEach(h),L.forEach(h),this.h()},h(){m(r,"class","illustration svelte-w19i2s"),te(()=>e[7].call(r)),m(u,"class","name svelte-w19i2s"),m(_,"class","link svelte-w19i2s"),S(_,"active",e[0]==="gj"),m(d,"class","link svelte-w19i2s"),S(d,"active",e[0]==="tc"),m(f,"class","link svelte-w19i2s"),S(f,"active",e[0]==="tw"),m(s,"class","hero-text svelte-w19i2s"),S(s,"selected",!!e[0]),S(s,"loaded",e[3]),m(c,"class","grid svelte-w19i2s"),m(i,"class","hero svelte-w19i2s")},m(p,b){C(p,r,b),t&&Y(t,r,null),n=_e(r,e[7].bind(r)),C(p,o,b),C(p,i,b),x(i,c),x(c,s),x(s,u),x(u,a),x(s,l),x(s,_),x(_,v),x(s,y),x(s,d),x(d,D),x(s,B),x(s,f),x(f,I),x(s,A),w=!0,g||(W=[j(_,"mouseover",e[8]),j(_,"click",V(e[9])),j(_,"focus",V(e[10])),j(d,"mouseover",e[11]),j(d,"click",V(e[12])),j(d,"focus",V(e[13])),j(f,"mouseover",e[14]),j(f,"click",V(e[15])),j(f,"focus",V(e[16])),j(i,"click",e[17])],g=!0)},p(p,[b]){const L={};if(b&2&&(L.width=p[1]),b&4&&(L.height=p[2]),P!==(P=p[4][p[0]])){if(t){de();const H=t;F(H.$$.fragment,1,0,()=>{Z(H,1)}),fe()}P?(t=new P(se(p)),X(t.$$.fragment),E(t.$$.fragment,1),Y(t,r,null)):t=null}else P&&t.$set(L);b&1&&S(_,"active",p[0]==="gj"),b&1&&S(d,"active",p[0]==="tc"),b&1&&S(f,"active",p[0]==="tw"),b&1&&S(s,"selected",!!p[0]),b&8&&S(s,"loaded",p[3])},i(p){w||(t&&E(t.$$.fragment,p),w=!0)},o(p){t&&F(t.$$.fragment,p),w=!1},d(p){p&&h(r),t&&Z(t),n(),p&&h(o),p&&h(i),g=!1,Re(W)}}}function Oe(e,r,t){let n;const o={gj:qe,tw:He,tc:Ue};let i=null,c,s,u=!1;const a=O("theme");Q(e,a,g=>t(6,n=g)),Se(()=>{t(3,u=!0)});function l(){s=this.clientHeight,c=this.clientWidth,t(2,s),t(1,c)}const _=()=>{t(0,i="gj")},v=()=>{t(0,i="gj")},y=()=>{t(0,i="gj")},d=()=>{t(0,i="tc")},D=()=>{t(0,i="tc")},B=()=>{t(0,i="tc")},f=()=>{t(0,i="tw")},I=()=>{t(0,i="tw")},A=()=>{t(0,i="tw")},w=()=>{t(0,i=null)};return e.$$.update=()=>{e.$$.dirty&64&&n&&t(0,i=null)},[i,c,s,u,o,a,n,l,_,v,y,d,D,B,f,I,A,w]}class Ke extends N{constructor(r){super();U(this,r,Oe,Je,J,{})}}function Xe(e){let r,t,n,o,i,c;const s=[e[1]];let u={};for(let a=0;a<s.length;a+=1)u=De(u,s[a]);return r=new Ie({props:u}),n=new Ke({}),i=new je({props:{posts:e[2],pagination:e[0]}}),{c(){X(r.$$.fragment),t=re(),X(n.$$.fragment),o=re(),X(i.$$.fragment)},l(a){$(r.$$.fragment,a),t=oe(a),$(n.$$.fragment,a),o=oe(a),$(i.$$.fragment,a)},m(a,l){Y(r,a,l),C(a,t,l),Y(n,a,l),C(a,o,l),Y(i,a,l),c=!0},p(a,[l]){const _=l&2?Be(s,[Ae(a[1])]):{};r.$set(_);const v={};l&4&&(v.posts=a[2]),l&1&&(v.pagination=a[0]),i.$set(v)},i(a){c||(E(r.$$.fragment,a),E(n.$$.fragment,a),E(i.$$.fragment,a),c=!0)},o(a){F(r.$$.fragment,a),F(n.$$.fragment,a),F(i.$$.fragment,a),c=!1},d(a){Z(r,a),a&&h(t),Z(n,a),a&&h(o),Z(i,a)}}}async function rt({fetch:e}){await e("rss.xml");const{posts:r=[],pagination:t={}}=await e("/content/posts-1.json").then(n=>n.json());return{props:{posts:r,pagination:t}}}function Ye(e,r,t){let n,o,i,{posts:c}=r,{pagination:s}=r;const u=O("locale");Q(e,u,l=>t(5,i=l));const a=O("siteConfig");return e.$$set=l=>{"posts"in l&&t(4,c=l.posts),"pagination"in l&&t(0,s=l.pagination)},e.$$.update=()=>{e.$$.dirty&48&&t(2,n=c.map(l=>l[i.locale]||l[we])),e.$$.dirty&32&&t(1,o={title:ge[i.locale].home||ge[we].home,description:a.description,url:`${a.baseURL}/`})},[s,o,n,u,c,i]}class ot extends N{constructor(r){super();U(this,r,Ye,Xe,J,{posts:4,pagination:0})}}export{ot as default,rt as load};
