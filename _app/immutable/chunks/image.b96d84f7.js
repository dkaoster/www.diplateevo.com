const R=new Date,X=new Date;function C(e,t,n,r){function l(a){return e(a=arguments.length===0?new Date:new Date(+a)),a}return l.floor=a=>(e(a=new Date(+a)),a),l.ceil=a=>(e(a=new Date(a-1)),t(a,1),e(a),a),l.round=a=>{const c=l(a),h=l.ceil(a);return a-c<h-a?c:h},l.offset=(a,c)=>(t(a=new Date(+a),c==null?1:Math.floor(c)),a),l.range=(a,c,h)=>{const M=[];if(a=l.ceil(a),h=h==null?1:Math.floor(h),!(a<c)||!(h>0))return M;let A;do M.push(A=new Date(+a)),t(a,h),e(a);while(A<a&&a<c);return M},l.filter=a=>C(c=>{if(c>=c)for(;e(c),!a(c);)c.setTime(c-1)},(c,h)=>{if(c>=c)if(h<0)for(;++h<=0;)for(;t(c,-1),!a(c););else for(;--h>=0;)for(;t(c,1),!a(c););}),n&&(l.count=(a,c)=>(R.setTime(+a),X.setTime(+c),e(R),e(X),Math.floor(n(R,X))),l.every=a=>(a=Math.floor(a),!isFinite(a)||!(a>0)?null:a>1?l.filter(r?c=>r(c)%a===0:c=>l.count(0,c)%a===0):l)),l}const Qe=1e3,_=Qe*60,Ve=_*60,N=Ve*24,oe=N*7,q=C(e=>e.setHours(0,0,0,0),(e,t)=>e.setDate(e.getDate()+t),(e,t)=>(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*_)/N,e=>e.getDate()-1);q.range;const z=C(e=>{e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t)},(e,t)=>(t-e)/N,e=>e.getUTCDate()-1);z.range;const _e=C(e=>{e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t)},(e,t)=>(t-e)/N,e=>Math.floor(e/N));_e.range;function F(e){return C(t=>{t.setDate(t.getDate()-(t.getDay()+7-e)%7),t.setHours(0,0,0,0)},(t,n)=>{t.setDate(t.getDate()+n*7)},(t,n)=>(n-t-(n.getTimezoneOffset()-t.getTimezoneOffset())*_)/oe)}const ae=F(0),I=F(1),qe=F(2),ze=F(3),W=F(4),Je=F(5),$e=F(6);ae.range;I.range;qe.range;ze.range;W.range;Je.range;$e.range;function x(e){return C(t=>{t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+7-e)%7),t.setUTCHours(0,0,0,0)},(t,n)=>{t.setUTCDate(t.getUTCDate()+n*7)},(t,n)=>(n-t)/oe)}const ie=x(0),P=x(1),je=x(2),Ge=x(3),H=x(4),Be=x(5),Ee=x(6);ie.range;P.range;je.range;Ge.range;H.range;Be.range;Ee.range;const S=C(e=>{e.setMonth(0,1),e.setHours(0,0,0,0)},(e,t)=>{e.setFullYear(e.getFullYear()+t)},(e,t)=>t.getFullYear()-e.getFullYear(),e=>e.getFullYear());S.every=e=>!isFinite(e=Math.floor(e))||!(e>0)?null:C(t=>{t.setFullYear(Math.floor(t.getFullYear()/e)*e),t.setMonth(0,1),t.setHours(0,0,0,0)},(t,n)=>{t.setFullYear(t.getFullYear()+n*e)});S.range;const Y=C(e=>{e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCFullYear(e.getUTCFullYear()+t)},(e,t)=>t.getUTCFullYear()-e.getUTCFullYear(),e=>e.getUTCFullYear());Y.every=e=>!isFinite(e=Math.floor(e))||!(e>0)?null:C(t=>{t.setUTCFullYear(Math.floor(t.getUTCFullYear()/e)*e),t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},(t,n)=>{t.setUTCFullYear(t.getUTCFullYear()+n*e)});Y.range;function Q(e){if(0<=e.y&&e.y<100){var t=new Date(-1,e.m,e.d,e.H,e.M,e.S,e.L);return t.setFullYear(e.y),t}return new Date(e.y,e.m,e.d,e.H,e.M,e.S,e.L)}function V(e){if(0<=e.y&&e.y<100){var t=new Date(Date.UTC(-1,e.m,e.d,e.H,e.M,e.S,e.L));return t.setUTCFullYear(e.y),t}return new Date(Date.UTC(e.y,e.m,e.d,e.H,e.M,e.S,e.L))}function L(e,t,n){return{y:e,m:t,d:n,H:0,M:0,S:0,L:0}}function Ke(e){var t=e.dateTime,n=e.date,r=e.time,l=e.periods,a=e.days,c=e.shortDays,h=e.months,M=e.shortMonths,A=b(l),me=d(l),ge=b(a),he=d(a),ye=b(c),Te=d(c),Ue=b(h),Ce=d(h),Me=b(M),De=d(M),p={a:He,A:Le,b:be,B:de,c:null,d:ee,e:ee,f:vt,g:bt,G:Ot,H:Mt,I:Dt,j:pt,L:ce,m:wt,M:St,p:Oe,q:Ne,Q:re,s:ue,S:Yt,u:Ft,U:xt,V:kt,w:Wt,W:Ht,x:null,X:null,y:Lt,Y:dt,Z:Nt,"%":ne},v={a:Ae,A:Ze,b:Ie,B:Pe,c:null,d:te,e:te,f:Pt,g:jt,G:Bt,H:At,I:Zt,j:It,L:fe,m:Rt,M:Xt,p:Re,q:Xe,Q:re,s:ue,S:Qt,u:Vt,U:_t,V:qt,w:zt,W:Jt,x:null,X:null,y:$t,Y:Gt,Z:Et,"%":ne},pe={a:we,A:Se,b:Ye,B:Fe,c:xe,d:E,e:E,f:yt,g:B,G,H:K,I:K,j:lt,L:ht,m:ft,M:mt,p:ve,q:st,Q:Ut,s:Ct,S:gt,u:ut,U:ot,V:at,w:rt,W:it,x:ke,X:We,y:B,Y:G,Z:ct,"%":Tt};p.x=D(n,p),p.X=D(r,p),p.c=D(t,p),v.x=D(n,v),v.X=D(r,v),v.c=D(t,v);function D(o,i){return function(s){var u=[],y=-1,m=0,T=o.length,U,w,$;for(s instanceof Date||(s=new Date(+s));++y<T;)o.charCodeAt(y)===37&&(u.push(o.slice(m,y)),(w=j[U=o.charAt(++y)])!=null?U=o.charAt(++y):w=U==="e"?" ":"0",($=i[U])&&(U=$(s,w)),u.push(U),m=y+1);return u.push(o.slice(m,y)),u.join("")}}function J(o,i){return function(s){var u=L(1900,void 0,1),y=Z(u,o,s+="",0),m,T;if(y!=s.length)return null;if("Q"in u)return new Date(u.Q);if("s"in u)return new Date(u.s*1e3+("L"in u?u.L:0));if(i&&!("Z"in u)&&(u.Z=0),"p"in u&&(u.H=u.H%12+u.p*12),u.m===void 0&&(u.m="q"in u?u.q:0),"V"in u){if(u.V<1||u.V>53)return null;"w"in u||(u.w=1),"Z"in u?(m=V(L(u.y,0,1)),T=m.getUTCDay(),m=T>4||T===0?P.ceil(m):P(m),m=z.offset(m,(u.V-1)*7),u.y=m.getUTCFullYear(),u.m=m.getUTCMonth(),u.d=m.getUTCDate()+(u.w+6)%7):(m=Q(L(u.y,0,1)),T=m.getDay(),m=T>4||T===0?I.ceil(m):I(m),m=q.offset(m,(u.V-1)*7),u.y=m.getFullYear(),u.m=m.getMonth(),u.d=m.getDate()+(u.w+6)%7)}else("W"in u||"U"in u)&&("w"in u||(u.w="u"in u?u.u%7:"W"in u?1:0),T="Z"in u?V(L(u.y,0,1)).getUTCDay():Q(L(u.y,0,1)).getDay(),u.m=0,u.d="W"in u?(u.w+6)%7+u.W*7-(T+5)%7:u.w+u.U*7-(T+6)%7);return"Z"in u?(u.H+=u.Z/100|0,u.M+=u.Z%100,V(u)):Q(u)}}function Z(o,i,s,u){for(var y=0,m=i.length,T=s.length,U,w;y<m;){if(u>=T)return-1;if(U=i.charCodeAt(y++),U===37){if(U=i.charAt(y++),w=pe[U in j?i.charAt(y++):U],!w||(u=w(o,s,u))<0)return-1}else if(U!=s.charCodeAt(u++))return-1}return u}function ve(o,i,s){var u=A.exec(i.slice(s));return u?(o.p=me.get(u[0].toLowerCase()),s+u[0].length):-1}function we(o,i,s){var u=ye.exec(i.slice(s));return u?(o.w=Te.get(u[0].toLowerCase()),s+u[0].length):-1}function Se(o,i,s){var u=ge.exec(i.slice(s));return u?(o.w=he.get(u[0].toLowerCase()),s+u[0].length):-1}function Ye(o,i,s){var u=Me.exec(i.slice(s));return u?(o.m=De.get(u[0].toLowerCase()),s+u[0].length):-1}function Fe(o,i,s){var u=Ue.exec(i.slice(s));return u?(o.m=Ce.get(u[0].toLowerCase()),s+u[0].length):-1}function xe(o,i,s){return Z(o,t,i,s)}function ke(o,i,s){return Z(o,n,i,s)}function We(o,i,s){return Z(o,r,i,s)}function He(o){return c[o.getDay()]}function Le(o){return a[o.getDay()]}function be(o){return M[o.getMonth()]}function de(o){return h[o.getMonth()]}function Oe(o){return l[+(o.getHours()>=12)]}function Ne(o){return 1+~~(o.getMonth()/3)}function Ae(o){return c[o.getUTCDay()]}function Ze(o){return a[o.getUTCDay()]}function Ie(o){return M[o.getUTCMonth()]}function Pe(o){return h[o.getUTCMonth()]}function Re(o){return l[+(o.getUTCHours()>=12)]}function Xe(o){return 1+~~(o.getUTCMonth()/3)}return{format:function(o){var i=D(o+="",p);return i.toString=function(){return o},i},parse:function(o){var i=J(o+="",!1);return i.toString=function(){return o},i},utcFormat:function(o){var i=D(o+="",v);return i.toString=function(){return o},i},utcParse:function(o){var i=J(o+="",!0);return i.toString=function(){return o},i}}}var j={"-":"",_:" ",0:"0"},g=/^\s*\d+/,et=/^%/,tt=/[\\^$*+?|[\]().{}]/g;function f(e,t,n){var r=e<0?"-":"",l=(r?-e:e)+"",a=l.length;return r+(a<n?new Array(n-a+1).join(t)+l:l)}function nt(e){return e.replace(tt,"\\$&")}function b(e){return new RegExp("^(?:"+e.map(nt).join("|")+")","i")}function d(e){return new Map(e.map((t,n)=>[t.toLowerCase(),n]))}function rt(e,t,n){var r=g.exec(t.slice(n,n+1));return r?(e.w=+r[0],n+r[0].length):-1}function ut(e,t,n){var r=g.exec(t.slice(n,n+1));return r?(e.u=+r[0],n+r[0].length):-1}function ot(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.U=+r[0],n+r[0].length):-1}function at(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.V=+r[0],n+r[0].length):-1}function it(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.W=+r[0],n+r[0].length):-1}function G(e,t,n){var r=g.exec(t.slice(n,n+4));return r?(e.y=+r[0],n+r[0].length):-1}function B(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.y=+r[0]+(+r[0]>68?1900:2e3),n+r[0].length):-1}function ct(e,t,n){var r=/^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(n,n+6));return r?(e.Z=r[1]?0:-(r[2]+(r[3]||"00")),n+r[0].length):-1}function st(e,t,n){var r=g.exec(t.slice(n,n+1));return r?(e.q=r[0]*3-3,n+r[0].length):-1}function ft(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.m=r[0]-1,n+r[0].length):-1}function E(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.d=+r[0],n+r[0].length):-1}function lt(e,t,n){var r=g.exec(t.slice(n,n+3));return r?(e.m=0,e.d=+r[0],n+r[0].length):-1}function K(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.H=+r[0],n+r[0].length):-1}function mt(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.M=+r[0],n+r[0].length):-1}function gt(e,t,n){var r=g.exec(t.slice(n,n+2));return r?(e.S=+r[0],n+r[0].length):-1}function ht(e,t,n){var r=g.exec(t.slice(n,n+3));return r?(e.L=+r[0],n+r[0].length):-1}function yt(e,t,n){var r=g.exec(t.slice(n,n+6));return r?(e.L=Math.floor(r[0]/1e3),n+r[0].length):-1}function Tt(e,t,n){var r=et.exec(t.slice(n,n+1));return r?n+r[0].length:-1}function Ut(e,t,n){var r=g.exec(t.slice(n));return r?(e.Q=+r[0],n+r[0].length):-1}function Ct(e,t,n){var r=g.exec(t.slice(n));return r?(e.s=+r[0],n+r[0].length):-1}function ee(e,t){return f(e.getDate(),t,2)}function Mt(e,t){return f(e.getHours(),t,2)}function Dt(e,t){return f(e.getHours()%12||12,t,2)}function pt(e,t){return f(1+q.count(S(e),e),t,3)}function ce(e,t){return f(e.getMilliseconds(),t,3)}function vt(e,t){return ce(e,t)+"000"}function wt(e,t){return f(e.getMonth()+1,t,2)}function St(e,t){return f(e.getMinutes(),t,2)}function Yt(e,t){return f(e.getSeconds(),t,2)}function Ft(e){var t=e.getDay();return t===0?7:t}function xt(e,t){return f(ae.count(S(e)-1,e),t,2)}function se(e){var t=e.getDay();return t>=4||t===0?W(e):W.ceil(e)}function kt(e,t){return e=se(e),f(W.count(S(e),e)+(S(e).getDay()===4),t,2)}function Wt(e){return e.getDay()}function Ht(e,t){return f(I.count(S(e)-1,e),t,2)}function Lt(e,t){return f(e.getFullYear()%100,t,2)}function bt(e,t){return e=se(e),f(e.getFullYear()%100,t,2)}function dt(e,t){return f(e.getFullYear()%1e4,t,4)}function Ot(e,t){var n=e.getDay();return e=n>=4||n===0?W(e):W.ceil(e),f(e.getFullYear()%1e4,t,4)}function Nt(e){var t=e.getTimezoneOffset();return(t>0?"-":(t*=-1,"+"))+f(t/60|0,"0",2)+f(t%60,"0",2)}function te(e,t){return f(e.getUTCDate(),t,2)}function At(e,t){return f(e.getUTCHours(),t,2)}function Zt(e,t){return f(e.getUTCHours()%12||12,t,2)}function It(e,t){return f(1+z.count(Y(e),e),t,3)}function fe(e,t){return f(e.getUTCMilliseconds(),t,3)}function Pt(e,t){return fe(e,t)+"000"}function Rt(e,t){return f(e.getUTCMonth()+1,t,2)}function Xt(e,t){return f(e.getUTCMinutes(),t,2)}function Qt(e,t){return f(e.getUTCSeconds(),t,2)}function Vt(e){var t=e.getUTCDay();return t===0?7:t}function _t(e,t){return f(ie.count(Y(e)-1,e),t,2)}function le(e){var t=e.getUTCDay();return t>=4||t===0?H(e):H.ceil(e)}function qt(e,t){return e=le(e),f(H.count(Y(e),e)+(Y(e).getUTCDay()===4),t,2)}function zt(e){return e.getUTCDay()}function Jt(e,t){return f(P.count(Y(e)-1,e),t,2)}function $t(e,t){return f(e.getUTCFullYear()%100,t,2)}function jt(e,t){return e=le(e),f(e.getUTCFullYear()%100,t,2)}function Gt(e,t){return f(e.getUTCFullYear()%1e4,t,4)}function Bt(e,t){var n=e.getUTCDay();return e=n>=4||n===0?H(e):H.ceil(e),f(e.getUTCFullYear()%1e4,t,4)}function Et(){return"+0000"}function ne(){return"%"}function re(e){return+e}function ue(e){return Math.floor(+e/1e3)}var k,Kt,en;tn({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});function tn(e){return k=Ke(e),Kt=k.format,en=k.parse,k.utcFormat,k.utcParse,k}function O(e,t,n){this.k=e,this.x=t,this.y=n}O.prototype={constructor:O,scale:function(e){return e===1?this:new O(this.k*e,this.x,this.y)},translate:function(e,t){return e===0&t===0?this:new O(this.k,this.x+this.k*e,this.y+this.k*t)},apply:function(e){return[e[0]*this.k+this.x,e[1]*this.k+this.y]},applyX:function(e){return e*this.k+this.x},applyY:function(e){return e*this.k+this.y},invert:function(e){return[(e[0]-this.x)/this.k,(e[1]-this.y)/this.k]},invertX:function(e){return(e-this.x)/this.k},invertY:function(e){return(e-this.y)/this.k},rescaleX:function(e){return e.copy().domain(e.range().map(this.invertX,this).map(e.invert,e))},rescaleY:function(e){return e.copy().domain(e.range().map(this.invertY,this).map(e.invert,e))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};O.prototype;const nn=(e,t,n)=>{const r=e.split("."),l=r.slice(0,-1).join("."),a=r[r.length-1];return`${l}@${t}w.${n||a}`};export{en as a,nn as s,Kt as t};