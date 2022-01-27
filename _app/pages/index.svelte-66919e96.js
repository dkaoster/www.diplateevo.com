import{U as be,S as J,i as O,s as K,e as k,c as M,a as R,d as h,b as m,f as pe,g as C,V as X,W as V,X as _e,q as E,n as de,o as F,p as fe,L as Y,M as ee,Y as ye,Z as W,_ as he,$ as ke,a0 as me,O as S,H as x,I as Me,w as Z,k as oe,t as G,x as te,m as ie,h as z,y as Q,J as A,a1 as H,B as $,a2 as Re,v as Se,C as De,z as je,A as Be}from"../chunks/vendor-2fb89ece.js";import{d as ve,i as we}from"../chunks/i18n-738d18c5.js";import{S as Ae}from"../chunks/StoryCardList-836aec1d.js";import{H as Ie}from"../chunks/Helmet-fa6b2b32.js";import"../chunks/image-15d1cba6.js";const Pe=(e,r,t)=>{const c=[],o=[],s=[],a=[];for(let i=0;i<=r;i+=1){const u=Math.PI/r*i;for(let n=0;n<=t;n+=1){const l=Math.PI*2/t*n,_=[Math.sin(u)*Math.cos(l),Math.sin(u)*Math.sin(l),Math.cos(u)];a.push(_),c.push(_.map(v=>v*e)),s.push([1-n/t,i/r]),i<r&&n<t&&o.push([i*(t+1)+n,(i+1)*(t+1)+n,(i+1)*(t+1)+n+1],[i*(t+1)+n,(i+1)*(t+1)+n+1,i*(t+1)+n+1])}}return{vertices:c,faces:o,uvs:s,normals:a}},se=Pe(1,30,60),Te={0:"#3288bd",.1:"#66c2a5",.2:"#abdda4",.3:"#e6f598",.4:"#fee08b",.5:"#fdae61",.6:"#f46d43",1:"#d53e4f"},q=192,Ce=e=>{const r=document.createElement("canvas");r.width=256,r.height=1;const t=r.getContext("2d"),c=t.createLinearGradient(0,0,256,0);for(const o in e)c.addColorStop(+o,e[o]);return t.fillStyle=c,t.fillRect(0,0,256,1),new Uint8Array(t.getImageData(0,0,256,1).data)},re=q**2,ge=new Uint8Array(re*4).fill(null).map(()=>Math.floor(Math.random()*256));var Ee=(e,r,t,c,o)=>{const s=e.texture({data:Ce(Te),width:16,height:16,mag:"linear",min:"linear"}),a=[e.texture({data:ge,width:q,height:q,mag:"nearest",min:"nearest"}),e.texture({data:ge,width:q,height:q,mag:"nearest",min:"nearest"})],i=e.framebuffer({depthStencil:!1,colorCount:1,colorFormat:"rgba",colorType:"uint8"}),u=e.buffer(new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1])),n=new Float32Array(re);for(let g=0;g<re;g+=1)n[g]=g;const l=e.buffer(n),_=e({frag:`
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
      }`,primitive:"triangles",count:6,viewport:{width:q,height:q},depth:{enable:!1},stencil:{enable:!1},attributes:{a_pos:e.prop("quadBuffer")},uniforms:{u_wind:e.prop("windTexture"),u_particles:e.prop("particleStateTexture"),u_rand_seed:()=>Math.random(),u_wind_res:e.prop("windRes"),u_wind_min:e.prop("windMin"),u_wind_max:e.prop("windMax"),u_speed_factor:e.prop("speedFactor"),u_drop_rate:e.prop("dropRate"),u_drop_rate_bump:e.prop("dropRateBump")}}),v=()=>{i({color:a[1]}),i.use(()=>{_({quadBuffer:u,windTexture:e.texture(t),particleStateTexture:a[0],windRes:[c.width,c.height],windMin:[c.uMin,c.vMin],windMax:[c.uMax,c.vMax],speedFactor:.25,dropRate:.003,dropRateBump:.01})});const g=a[0];a[0]=a[1],a[1]=g},y=new Uint8Array(o.width*o.height*4),d=[e.texture({data:y,mag:"nearest",min:"nearest",width:o.width,height:o.height}),e.texture({data:y,mag:"nearest",min:"nearest",width:o.width,height:o.height})],D=e({primitive:"points",count:re,viewport:{width:o.width,height:o.height},depth:{enable:!1},stencil:{enable:!1},vert:`
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
      }`,attributes:{a_index:e.prop("particleIndexBuffer")},uniforms:{u_wind:e.prop("windTexture"),u_particles:e.prop("particleStateTexture"),u_color_ramp:e.prop("colorRampTexture"),u_particles_res:e.prop("particleStateResolution"),u_wind_min:e.prop("windMin"),u_wind_max:e.prop("windMax")}}),j=e({frag:`
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
      }`,blend:{enable:e.prop("blend"),func:{srcRGB:"src alpha",srcAlpha:1,dstRGB:"one minus src alpha",dstAlpha:1}},viewport:{width:o.width,height:o.height},depth:{enable:!1},stencil:{enable:!1},attributes:{a_pos:e.prop("quadBuffer")},uniforms:{u_opacity:e.prop("opacity"),u_screen:e.prop("texture")},primitive:"triangles",count:6}),f=()=>{const g=d[0],N=d[1];i({color:N}),i.use(()=>{j({texture:g,blend:!1,opacity:.95,quadBuffer:u}),D({particleStateResolution:q,windMin:[c.uMin,c.vMin],windMax:[c.uMax,c.vMax],colorRampTexture:s,particleStateTexture:a[0],windTexture:e.texture(t),particleIndexBuffer:l})});const P=g;d[0]=N,d[1]=P},I=e({frag:`
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
      }`,attributes:{position:se.vertices,uv:se.uvs},uniforms:{tex:e.texture(r),texScreen:e.prop("texScreen"),tick:e.prop("tick"),axis:[0,1,0]},elements:se.faces});let B=0;const w=be(e,{center:[0,0,0],theta:-Math.PI/2,phi:Math.PI/12,distance:3.5,damping:.5,renderOnDirty:!1,zoomSpeed:0,mouse:!1});e.frame(()=>{w(()=>{e.clear({color:[0,0,0,0]}),v(),f(),I({tick:B,texScreen:d[0]}),B+=1})})};function xe(e){let r,t,c,o,s=`${e[2]}px`,a;return{c(){r=k("canvas"),this.h()},l(i){r=M(i,"CANVAS",{width:!0,height:!0}),R(r).forEach(h),this.h()},h(){m(r,"width",t=e[2]*e[3]),m(r,"height",c=e[2]*e[3]),pe(r,"width",s,!1)},m(i,u){C(i,r,u),e[12](r),a=!0},p(i,u){(!a||u&12&&t!==(t=i[2]*i[3]))&&m(r,"width",t),(!a||u&12&&c!==(c=i[2]*i[3]))&&m(r,"height",c),u&4&&s!==(s=`${i[2]}px`)&&pe(r,"width",s,!1)},i(i){a||(X(()=>{o||(o=V(r,W,{},!0)),o.run(1)}),a=!0)},o(i){o||(o=V(r,W,{},!1)),o.run(0),a=!1},d(i){i&&h(r),e[12](null),i&&o&&o.end()}}}function Ge(e){let r,t,c,o=e[1]&&e[2]&&xe(e);return{c(){r=k("div"),o&&o.c(),this.h()},l(s){r=M(s,"DIV",{class:!0});var a=R(r);o&&o.l(a),a.forEach(h),this.h()},h(){m(r,"class","wrapper svelte-xh1wgb"),X(()=>e[13].call(r))},m(s,a){C(s,r,a),o&&o.m(r,null),t=_e(r,e[13].bind(r)),c=!0},p(s,[a]){s[1]&&s[2]?o?(o.p(s,a),a&6&&E(o,1)):(o=xe(s),o.c(),E(o,1),o.m(r,null)):o&&(de(),F(o,1,1,()=>{o=null}),fe())},i(s){c||(E(o),c=!0)},o(s){F(o),c=!1},d(s){s&&h(r),o&&o.d(),t()}}}function ze(e,r,t){let c,o,s,a=0,i=0,u;const n=Y("theme");ee(e,n,w=>t(11,s=w));let l,_,v,y;const d=new Image;d.src="/covers/earth-base-dark.jpg",d.onload=()=>{t(5,l=d)};const D=new Image;D.src="/covers/earth-base-light.jpg",D.onload=()=>{t(6,_=D)};const j=new Image;j.src="/covers/earth-wind.png",j.onload=()=>{t(7,v=j)},fetch("/covers/earth-wind.json").then(w=>w.json()).then(w=>{t(8,y=w)});let f;ye(()=>{f&&f.destroy()});function I(w){he[w?"unshift":"push"](()=>{u=w,t(0,u)})}function B(){a=this.clientWidth,i=this.clientHeight,t(1,a),t(2,i)}return e.$$.update=()=>{e.$$.dirty&2144&&t(10,o=s==="dark"?l:_),e.$$.dirty&1921&&u&&o&&v&&y&&!f&&(t(9,f=ke(u)),Ee(f,o,v,y,u))},t(3,c=typeof window=="object"&&window.devicePixelRatio||1),[u,a,i,c,n,l,_,v,y,f,o,s,I,B]}class qe extends J{constructor(r){super();O(this,r,ze,Ge,K,{})}}function Fe(e){let r,t,c,o,s;return{c(){r=k("div"),t=k("img"),this.h()},l(a){r=M(a,"DIV",{class:!0});var i=R(r);t=M(i,"IMG",{class:!0,src:!0,alt:!0}),i.forEach(h),this.h()},h(){m(t,"class","taipei-map svelte-npe1bx"),me(t.src,c="covers/taipei_streets_"+(e[2]==="dark"?"white":"black")+".svg")||m(t,"src",c),m(t,"alt","Taipei Map"),S(t,"prioritizeWidth",e[0]),m(r,"class","wrapper svelte-npe1bx")},m(a,i){C(a,r,i),x(r,t),e[6](r),s=!0},p(a,[i]){(!s||i&4&&!me(t.src,c="covers/taipei_streets_"+(a[2]==="dark"?"white":"black")+".svg"))&&m(t,"src",c),i&1&&S(t,"prioritizeWidth",a[0])},i(a){s||(X(()=>{o||(o=V(r,W,{},!0)),o.run(1)}),s=!0)},o(a){o||(o=V(r,W,{},!1)),o.run(0),s=!1},d(a){a&&h(r),e[6](null),a&&o&&o.end()}}}const Le=580,Ve=550;function We(e,r,t){let c,o,{width:s}=r,{height:a}=r;const i=Y("theme");ee(e,i,l=>t(2,o=l));let u;function n(l){he[l?"unshift":"push"](()=>{u=l,t(1,u)})}return e.$$set=l=>{"width"in l&&t(4,s=l.width),"height"in l&&t(5,a=l.height)},e.$$.update=()=>{e.$$.dirty&48&&t(0,c=s/a>Le/Ve),e.$$.dirty&17},[c,u,o,i,s,a,n]}class He extends J{constructor(r){super();O(this,r,We,Fe,K,{width:4,height:5})}}function Ne(e){let r,t,c;return{c(){r=k("div"),this.h()},l(o){r=M(o,"DIV",{class:!0}),R(r).forEach(h),this.h()},h(){m(r,"class","svelte-jzd3jj")},m(o,s){C(o,r,s),c=!0},p:Me,i(o){c||(X(()=>{t||(t=V(r,W,{},!0)),t.run(1)}),c=!0)},o(o){t||(t=V(r,W,{},!1)),t.run(0),c=!1},d(o){o&&h(r),o&&t&&t.end()}}}class Ue extends J{constructor(r){super();O(this,r,null,Ne,K,{})}}function Je(e){let r,t,c,o,s,a,i,u,n,l,_,v,y,d,D,j,f,I,B,w,g,N;var P=e[4][e[0]];function ae(p){return{props:{width:p[1],height:p[2]}}}return P&&(t=new P(ae(e))),{c(){r=k("div"),t&&Z(t.$$.fragment),o=oe(),s=k("div"),a=k("div"),i=k("div"),u=k("span"),n=G("Daniel Kao"),l=G(` is a
      `),_=k("span"),v=G("graphics journalist"),y=G(` at commonwealth magazine,
      `),d=k("span"),D=G("taiwanese-californian"),j=G(`, currently living in
      `),f=k("span"),I=G("taipei, taiwan"),B=G("."),this.h()},l(p){r=M(p,"DIV",{class:!0});var b=R(r);t&&te(t.$$.fragment,b),b.forEach(h),o=ie(p),s=M(p,"DIV",{class:!0});var L=R(s);a=M(L,"DIV",{class:!0});var U=R(a);i=M(U,"DIV",{class:!0});var T=R(i);u=M(T,"SPAN",{class:!0});var ne=R(u);n=z(ne,"Daniel Kao"),ne.forEach(h),l=z(T,` is a
      `),_=M(T,"SPAN",{class:!0});var ce=R(_);v=z(ce,"graphics journalist"),ce.forEach(h),y=z(T,` at commonwealth magazine,
      `),d=M(T,"SPAN",{class:!0});var le=R(d);D=z(le,"taiwanese-californian"),le.forEach(h),j=z(T,`, currently living in
      `),f=M(T,"SPAN",{class:!0});var ue=R(f);I=z(ue,"taipei, taiwan"),ue.forEach(h),B=z(T,"."),T.forEach(h),U.forEach(h),L.forEach(h),this.h()},h(){m(r,"class","illustration svelte-w19i2s"),X(()=>e[7].call(r)),m(u,"class","name svelte-w19i2s"),m(_,"class","link svelte-w19i2s"),S(_,"active",e[0]==="gj"),m(d,"class","link svelte-w19i2s"),S(d,"active",e[0]==="tc"),m(f,"class","link svelte-w19i2s"),S(f,"active",e[0]==="tw"),m(i,"class","hero-text svelte-w19i2s"),S(i,"selected",!!e[0]),S(i,"loaded",e[3]),m(a,"class","grid svelte-w19i2s"),m(s,"class","hero svelte-w19i2s")},m(p,b){C(p,r,b),t&&Q(t,r,null),c=_e(r,e[7].bind(r)),C(p,o,b),C(p,s,b),x(s,a),x(a,i),x(i,u),x(u,n),x(i,l),x(i,_),x(_,v),x(i,y),x(i,d),x(d,D),x(i,j),x(i,f),x(f,I),x(i,B),w=!0,g||(N=[A(_,"mouseover",e[8]),A(_,"click",H(e[9])),A(_,"focus",H(e[10])),A(d,"mouseover",e[11]),A(d,"click",H(e[12])),A(d,"focus",H(e[13])),A(f,"mouseover",e[14]),A(f,"click",H(e[15])),A(f,"focus",H(e[16])),A(s,"click",e[17])],g=!0)},p(p,[b]){const L={};if(b&2&&(L.width=p[1]),b&4&&(L.height=p[2]),P!==(P=p[4][p[0]])){if(t){de();const U=t;F(U.$$.fragment,1,0,()=>{$(U,1)}),fe()}P?(t=new P(ae(p)),Z(t.$$.fragment),E(t.$$.fragment,1),Q(t,r,null)):t=null}else P&&t.$set(L);b&1&&S(_,"active",p[0]==="gj"),b&1&&S(d,"active",p[0]==="tc"),b&1&&S(f,"active",p[0]==="tw"),b&1&&S(i,"selected",!!p[0]),b&8&&S(i,"loaded",p[3])},i(p){w||(t&&E(t.$$.fragment,p),w=!0)},o(p){t&&F(t.$$.fragment,p),w=!1},d(p){p&&h(r),t&&$(t),c(),p&&h(o),p&&h(s),g=!1,Re(N)}}}function Oe(e,r,t){let c;const o={gj:qe,tw:He,tc:Ue};let s=null,a,i,u=!1;const n=Y("theme");ee(e,n,g=>t(6,c=g)),Se(()=>{t(3,u=!0)});function l(){i=this.clientHeight,a=this.clientWidth,t(2,i),t(1,a)}const _=()=>{t(0,s="gj")},v=()=>{t(0,s="gj")},y=()=>{t(0,s="gj")},d=()=>{t(0,s="tc")},D=()=>{t(0,s="tc")},j=()=>{t(0,s="tc")},f=()=>{t(0,s="tw")},I=()=>{t(0,s="tw")},B=()=>{t(0,s="tw")},w=()=>{t(0,s=null)};return e.$$.update=()=>{e.$$.dirty&64&&c&&t(0,s=null)},[s,a,i,u,o,n,c,l,_,v,y,d,D,j,f,I,B,w]}class Ke extends J{constructor(r){super();O(this,r,Oe,Je,K,{})}}function Xe(e){let r,t,c,o,s,a;const i=[e[1]];let u={};for(let n=0;n<i.length;n+=1)u=De(u,i[n]);return r=new Ie({props:u}),c=new Ke({}),s=new Ae({props:{posts:e[2],pagination:e[0]}}),{c(){Z(r.$$.fragment),t=oe(),Z(c.$$.fragment),o=oe(),Z(s.$$.fragment)},l(n){te(r.$$.fragment,n),t=ie(n),te(c.$$.fragment,n),o=ie(n),te(s.$$.fragment,n)},m(n,l){Q(r,n,l),C(n,t,l),Q(c,n,l),C(n,o,l),Q(s,n,l),a=!0},p(n,[l]){const _=l&2?je(i,[Be(n[1])]):{};r.$set(_);const v={};l&4&&(v.posts=n[2]),l&1&&(v.pagination=n[0]),s.$set(v)},i(n){a||(E(r.$$.fragment,n),E(c.$$.fragment,n),E(s.$$.fragment,n),a=!0)},o(n){F(r.$$.fragment,n),F(c.$$.fragment,n),F(s.$$.fragment,n),a=!1},d(n){$(r,n),n&&h(t),$(c,n),n&&h(o),$(s,n)}}}async function rt({fetch:e}){await e("rss.xml");const{posts:r=[],pagination:t={}}=await e("/content/posts-1.json").then(c=>c.json());return{props:{posts:r,pagination:t}}}function Ye(e,r,t){let c,o,s,{posts:a}=r,{pagination:i}=r;const u=Y("locale");ee(e,u,l=>t(5,s=l));const n=Y("siteConfig");return e.$$set=l=>{"posts"in l&&t(4,a=l.posts),"pagination"in l&&t(0,i=l.pagination)},e.$$.update=()=>{e.$$.dirty&48&&t(2,c=a.map(l=>l[s.locale]||l[ve])),e.$$.dirty&32&&t(1,o={title:we[s.locale].home||we[ve].home,description:n.description,url:`${n.baseURL}/`})},[i,o,c,u,a,s]}class ot extends J{constructor(r){super();O(this,r,Ye,Xe,K,{posts:4,pagination:0})}}export{ot as default,rt as load};
