(this["webpackJsonpdraw-arc"]=this["webpackJsonpdraw-arc"]||[]).push([[0],{30:function(e,t,n){},31:function(e,t,n){},36:function(e,t,n){"use strict";n.r(t);var a,r,o=n(3),i=n(0),c=n.n(i),u=n(11),x=n.n(u),l=(n(30),n(12)),y=n(13),s=n(19),h=n(14),v=n(20),d=n(18);n(31);r={C:{x:0,y:0},Q:{x:0,y:0}},a=function(e,t,n,a,o){var i,c,u,x,l,y,s,h,v;return i={x:((c={x:e,y:t}).x+(u={x:n,y:a}).x)/2,y:(c.y+u.y)/2},y=Math.sqrt((c.x-i.x)*(c.x-i.x)+(c.y-i.y)*(c.y-i.y)),(null==o||o<y)&&(o=y),v={x:-(h={x:(c.x-i.x)/y,y:(c.y-i.y)/y}).y,y:h.x},l=Math.sqrt(o*o-y*y),r={C:{x:i.x-v.x*l,y:i.y-v.y*l},Q:x={x:i.x+v.x*(s=y*y/l),y:i.y+v.y*s}},x};var b,f=function(e,t,n,o,i,c){var u;return e.moveTo(t,n),u=a(t,n,o,i,c),e.arcTo(u.x,u.y,o,i,c),r},j=function(e){Object(v.a)(n,e);var t=Object(d.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(y.a)(n,[{key:"componentDidMount",value:function(){return this.update(50)}},{key:"componentDidUpdate",value:function(){var e;return e=this.props.value,this.update(e)}},{key:"update",value:function(e){var t,n,a,r,o,i;return(r=(a=this.refs.canvas).getContext("2d")).save(),r.beginPath(),r.rect(0,0,a.width,a.height),r.fillStyle="white",r.fill(),i=(e/100*.75+.25)*a.width,t={x:.25*a.width,y:.5*a.height},n={x:.75*a.width,y:.5*a.height},r.beginPath(),r.strokeStyle="black",o=f(r,t.x,t.y,n.x,n.y,i),r.stroke(),r.beginPath(),r.strokeStyle="blue",r.moveTo(t.x,t.y),r.lineTo(o.C.x,o.C.y),r.lineTo(n.x,n.y),r.stroke(),r.beginPath(),r.strokeStyle="green",r.moveTo(t.x,t.y),r.lineTo(o.Q.x,o.Q.y),r.lineTo(n.x,n.y),r.stroke(),r.beginPath(),r.strokeStyle="red",r.moveTo(o.C.x,o.C.y),r.lineTo(o.Q.x,o.Q.y),r.moveTo(t.x,t.y),r.lineTo(n.x,n.y),r.stroke(),r.restore(),r.font="24px bold",r.fillText("P1",t.x-24,t.y),r.fillText("P2",n.x+12,n.y),r.fillText("r",(t.x+o.C.x)/2-24,(t.y+o.C.y)/2),r.fillText("r",(n.x+o.C.x)/2+12,(n.y+o.C.y)/2),r.fillText("Q",o.Q.x-12,o.Q.y-24)}},{key:"render",value:function(){return Object(o.jsx)("canvas",{ref:"canvas",width:400,height:800})}}]),n}(i.Component),p=n(52),O=n(50);b=Object(O.a)({root:{width:400,margin:"0 auto"}});var k=function(e){var t,n,a;return n=b(),a=e.value,t=e.app,Object(o.jsxs)("div",{className:n.root,children:[Object(o.jsx)(j,{value:a}),Object(o.jsx)(p.a,{value:a,min:1,max:100,onChange:function(e,n){return t.onValue(n)}})]})},m=function(e){Object(v.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).onValue=a.onValue.bind(Object(h.a)(a)),a.state={value:50},Object(s.a)(a)}return Object(y.a)(n,[{key:"onValue",value:function(e){return function(e,t){if(!(e instanceof t))throw new Error("Bound instance method accessed before binding")}(this,n),this.setState({value:e})}},{key:"render",value:function(){return Object(o.jsx)("div",{className:"App",children:Object(o.jsx)(k,{value:this.state.value,app:this})})}}]),n}(i.Component);x.a.render(Object(o.jsx)(c.a.StrictMode,{children:Object(o.jsx)(m,{})}),document.getElementById("root"))}},[[36,1,2]]]);
//# sourceMappingURL=main.cfbf4aec.chunk.js.map