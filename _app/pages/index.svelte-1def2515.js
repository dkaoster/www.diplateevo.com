import{S as W,i as q,s as A,e as w,c as k,a as j,d as h,b as f,g as I,I as z,U as ie,O as b,H as p,L as F,M as re,V as ce,w as P,k as Q,t as D,x as X,m as $,h as S,W as _e,y as M,X as ue,J as y,Y as T,n as he,o as N,B as G,p as fe,q as J,Z as pe,v as me,C as de,z as ge,A as ve}from"../chunks/vendor-3fbb0f75.js";import{d as le,i as oe}from"../chunks/i18n-fe7097f8.js";import{S as we}from"../chunks/StoryCardList-4685bf5b.js";import{H as ke}from"../chunks/Helmet-2f98ac4e.js";import"../chunks/image-15d1cba6.js";function be(t){let s;return{c(){s=w("div"),this.h()},l(e){s=k(e,"DIV",{class:!0}),j(s).forEach(h),this.h()},h(){f(s,"class","svelte-1tx04cq")},m(e,o){I(e,s,o)},p:z,i:z,o:z,d(e){e&&h(s)}}}class je extends W{constructor(s){super();q(this,s,null,be,A,{})}}function ye(t){let s,e,o;return{c(){s=w("div"),e=w("img"),this.h()},l(i){s=k(i,"DIV",{class:!0});var n=j(s);e=k(n,"IMG",{class:!0,src:!0,alt:!0}),n.forEach(h),this.h()},h(){f(e,"class","taipei-map svelte-npe1bx"),ie(e.src,o="covers/taipei_streets_"+(t[2]==="dark"?"white":"black")+".svg")||f(e,"src",o),f(e,"alt","Taipei Map"),b(e,"prioritizeWidth",t[0]),f(s,"class","wrapper svelte-npe1bx")},m(i,n){I(i,s,n),p(s,e),t[6](s)},p(i,[n]){n&4&&!ie(e.src,o="covers/taipei_streets_"+(i[2]==="dark"?"white":"black")+".svg")&&f(e,"src",o),n&1&&b(e,"prioritizeWidth",i[0])},i:z,o:z,d(i){i&&h(s),t[6](null)}}}const Ce=580,Ee=550;function Ie(t,s,e){let o,i,{width:n}=s,{height:_}=s;const l=F("theme");re(t,l,r=>e(2,i=r));let u;function a(r){ce[r?"unshift":"push"](()=>{u=r,e(1,u)})}return t.$$set=r=>{"width"in r&&e(4,n=r.width),"height"in r&&e(5,_=r.height)},t.$$.update=()=>{t.$$.dirty&48&&e(0,o=n/_>Ce/Ee),t.$$.dirty&17},[o,u,i,l,n,_,a]}class ze extends W{constructor(s){super();q(this,s,Ie,ye,A,{width:4,height:5})}}function De(t){let s;return{c(){s=w("div"),this.h()},l(e){s=k(e,"DIV",{class:!0}),j(s).forEach(h),this.h()},h(){f(s,"class","svelte-1tx04cq")},m(e,o){I(e,s,o)},p:z,i:z,o:z,d(e){e&&h(s)}}}class Se extends W{constructor(s){super();q(this,s,null,De,A,{})}}function Ve(t){let s,e,o,i,n,_,l,u,a,r,m,E,K,g,R,U,v,B,Y,O,Z,x;var V=t[4][t[0]];function ee(c){return{props:{width:c[1],height:c[2]}}}return V&&(e=new V(ee(t))),{c(){s=w("div"),e&&P(e.$$.fragment),i=Q(),n=w("div"),_=w("div"),l=w("div"),u=w("span"),a=D("Daniel Kao"),r=D(` is a
      `),m=w("span"),E=D("graphics journalist"),K=D(` at commonwealth magazine,
      `),g=w("span"),R=D("taiwanese-californian"),U=D(`, currently living in
      `),v=w("span"),B=D("taipei, taiwan"),Y=D("."),this.h()},l(c){s=k(c,"DIV",{class:!0});var d=j(s);e&&X(e.$$.fragment,d),d.forEach(h),i=$(c),n=k(c,"DIV",{class:!0});var H=j(n);_=k(H,"DIV",{class:!0});var L=j(_);l=k(L,"DIV",{class:!0});var C=j(l);u=k(C,"SPAN",{class:!0});var se=j(u);a=S(se,"Daniel Kao"),se.forEach(h),r=S(C,` is a
      `),m=k(C,"SPAN",{class:!0});var te=j(m);E=S(te,"graphics journalist"),te.forEach(h),K=S(C,` at commonwealth magazine,
      `),g=k(C,"SPAN",{class:!0});var ae=j(g);R=S(ae,"taiwanese-californian"),ae.forEach(h),U=S(C,`, currently living in
      `),v=k(C,"SPAN",{class:!0});var ne=j(v);B=S(ne,"taipei, taiwan"),ne.forEach(h),Y=S(C,"."),C.forEach(h),L.forEach(h),H.forEach(h),this.h()},h(){f(s,"class","illustration svelte-w19i2s"),_e(()=>t[5].call(s)),f(u,"class","name svelte-w19i2s"),f(m,"class","link svelte-w19i2s"),b(m,"active",t[0]==="gj"),f(g,"class","link svelte-w19i2s"),b(g,"active",t[0]==="tc"),f(v,"class","link svelte-w19i2s"),b(v,"active",t[0]==="tw"),f(l,"class","hero-text svelte-w19i2s"),b(l,"selected",!!t[0]),b(l,"loaded",t[3]),f(_,"class","grid svelte-w19i2s"),f(n,"class","hero svelte-w19i2s")},m(c,d){I(c,s,d),e&&M(e,s,null),o=ue(s,t[5].bind(s)),I(c,i,d),I(c,n,d),p(n,_),p(_,l),p(l,u),p(u,a),p(l,r),p(l,m),p(m,E),p(l,K),p(l,g),p(g,R),p(l,U),p(l,v),p(v,B),p(l,Y),O=!0,Z||(x=[y(m,"mouseover",t[6]),y(m,"click",T(t[7])),y(m,"focus",T(t[8])),y(g,"mouseover",t[9]),y(g,"click",T(t[10])),y(g,"focus",T(t[11])),y(v,"mouseover",t[12]),y(v,"click",T(t[13])),y(v,"focus",T(t[14])),y(n,"click",t[15])],Z=!0)},p(c,[d]){const H={};if(d&2&&(H.width=c[1]),d&4&&(H.height=c[2]),V!==(V=c[4][c[0]])){if(e){he();const L=e;N(L.$$.fragment,1,0,()=>{G(L,1)}),fe()}V?(e=new V(ee(c)),P(e.$$.fragment),J(e.$$.fragment,1),M(e,s,null)):e=null}else V&&e.$set(H);d&1&&b(m,"active",c[0]==="gj"),d&1&&b(g,"active",c[0]==="tc"),d&1&&b(v,"active",c[0]==="tw"),d&1&&b(l,"selected",!!c[0]),d&8&&b(l,"loaded",c[3])},i(c){O||(e&&J(e.$$.fragment,c),O=!0)},o(c){e&&N(e.$$.fragment,c),O=!1},d(c){c&&h(s),e&&G(e),o(),c&&h(i),c&&h(n),Z=!1,pe(x)}}}function He(t,s,e){const o={gj:je,tw:ze,tc:Se};let i=null,n,_,l=!1;me(()=>{e(3,l=!0)});function u(){_=this.clientHeight,n=this.clientWidth,e(2,_),e(1,n)}return[i,n,_,l,o,u,()=>{e(0,i="gj")},()=>{e(0,i="gj")},()=>{e(0,i="gj")},()=>{e(0,i="tc")},()=>{e(0,i="tc")},()=>{e(0,i="tc")},()=>{e(0,i="tw")},()=>{e(0,i="tw")},()=>{e(0,i="tw")},()=>{e(0,i=null)}]}class Te extends W{constructor(s){super();q(this,s,He,Ve,A,{})}}function Le(t){let s,e,o,i,n,_;const l=[t[1]];let u={};for(let a=0;a<l.length;a+=1)u=de(u,l[a]);return s=new ke({props:u}),o=new Te({}),n=new we({props:{posts:t[2],pagination:t[0]}}),{c(){P(s.$$.fragment),e=Q(),P(o.$$.fragment),i=Q(),P(n.$$.fragment)},l(a){X(s.$$.fragment,a),e=$(a),X(o.$$.fragment,a),i=$(a),X(n.$$.fragment,a)},m(a,r){M(s,a,r),I(a,e,r),M(o,a,r),I(a,i,r),M(n,a,r),_=!0},p(a,[r]){const m=r&2?ge(l,[ve(a[1])]):{};s.$set(m);const E={};r&4&&(E.posts=a[2]),r&1&&(E.pagination=a[0]),n.$set(E)},i(a){_||(J(s.$$.fragment,a),J(o.$$.fragment,a),J(n.$$.fragment,a),_=!0)},o(a){N(s.$$.fragment,a),N(o.$$.fragment,a),N(n.$$.fragment,a),_=!1},d(a){G(s,a),a&&h(e),G(o,a),a&&h(i),G(n,a)}}}async function Ge({fetch:t}){await t("rss.xml");const{posts:s=[],pagination:e={}}=await t("/content/posts-1.json").then(o=>o.json());return{props:{posts:s,pagination:e}}}function We(t,s,e){let o,i,n,{posts:_}=s,{pagination:l}=s;const u=F("locale");re(t,u,r=>e(5,n=r));const a=F("siteConfig");return t.$$set=r=>{"posts"in r&&e(4,_=r.posts),"pagination"in r&&e(0,l=r.pagination)},t.$$.update=()=>{t.$$.dirty&48&&e(2,o=_.map(r=>r[n.locale]||r[le])),t.$$.dirty&32&&e(1,i={title:oe[n.locale].home||oe[le].home,description:a.description,url:`${a.baseURL}/`})},[l,i,o,u,_,n]}class Je extends W{constructor(s){super();q(this,s,We,Le,A,{posts:4,pagination:0})}}export{Je as default,Ge as load};