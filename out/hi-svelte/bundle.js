var app=function(){"use strict";function t(){}function e(t){return t()}function i(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function n(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function r(t,e){t.appendChild(e)}function a(t,e,i){t.insertBefore(e,i)}function d(t){t.parentNode.removeChild(t)}function l(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function c(){return h(" ")}function p(t,e,i){e in t?t[e]=i:function(t,e,i){null==i?t.removeAttribute(e):t.setAttribute(e,i)}(t,e,i)}let u;function f(t){u=t}const g=[],y=Promise.resolve();let b=!1;const m=[],v=[],w=[];function x(t){v.push(t)}function k(){const t=new Set;do{for(;g.length;){const t=g.shift();f(t),S(t.$$)}for(;m.length;)m.shift()();for(;v.length;){const e=v.pop();t.has(e)||(e(),t.add(e))}}while(g.length);for(;w.length;)w.pop()();b=!1}function S(t){t.fragment&&(t.update(t.dirty),s(t.before_render),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_render.forEach(x))}function C(t,e){t.$$.dirty||(g.push(t),b||(b=!0,y.then(k)),t.$$.dirty={}),t.$$.dirty[e]=!0}function _(n,r,a,d,l,h){const c=u;f(n);const p=r.props||{},g=n.$$={fragment:null,ctx:null,props:h,update:t,not_equal:l,bound:i(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(c?c.$$.context:[]),callbacks:i(),dirty:null};let y=!1;var b;g.ctx=a?a(n,p,(t,e)=>{g.ctx&&l(g.ctx[t],g.ctx[t]=e)&&(g.bound[t]&&g.bound[t](e),y&&C(n,t))}):p,g.update(),y=!0,s(g.before_render),g.fragment=d(g.ctx),r.target&&(r.hydrate?g.fragment.l((b=r.target,Array.from(b.childNodes))):g.fragment.c(),r.intro&&n.$$.fragment.i&&n.$$.fragment.i(),function(t,i,n){const{fragment:r,on_mount:a,on_destroy:d,after_render:l}=t.$$;r.m(i,n),x(()=>{const i=a.map(e).filter(o);d?d.push(...i):s(i),t.$$.on_mount=[]}),l.forEach(x)}(n,r.target,r.anchor),k()),f(c)}class R{$destroy(){var e,i;i=!0,(e=this).$$&&(s(e.$$.on_destroy),e.$$.fragment.d(i),e.$$.on_destroy=e.$$.fragment=null,e.$$.ctx={}),this.$destroy=t}$on(t,e){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(e),()=>{const t=i.indexOf(e);-1!==t&&i.splice(t,1)}}$set(){}}try{(function(t){const e=new WeakMap,i=t=>"function"==typeof t&&e.has(t),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,o=(t,e,i=null)=>{let s=e;for(;s!==i;){const e=s.nextSibling;t.removeChild(s),s=e}},n={},r={},a=`{{lit-${String(Math.random()).slice(2)}}}`,d=`\x3c!--${a}--\x3e`,l=new RegExp(`${a}|${d}`),h="$lit$";class c{constructor(t,e){this.parts=[],this.element=e;let i=-1,s=0;const o=[],n=e=>{const r=e.content,d=document.createTreeWalker(r,133,null,!1);let c=0;for(;d.nextNode();){i++;const e=d.currentNode;if(1===e.nodeType){if(e.hasAttributes()){const o=e.attributes;let n=0;for(let t=0;t<o.length;t++)o[t].value.indexOf(a)>=0&&n++;for(;n-- >0;){const o=t.strings[s],n=f.exec(o)[2],r=n.toLowerCase()+h,a=e.getAttribute(r).split(l);this.parts.push({type:"attribute",index:i,name:n,strings:a}),e.removeAttribute(r),s+=a.length-1}}"TEMPLATE"===e.tagName&&n(e)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(a)>=0){const n=e.parentNode,r=t.split(l),a=r.length-1;for(let t=0;t<a;t++)n.insertBefore(""===r[t]?u():document.createTextNode(r[t]),e),this.parts.push({type:"node",index:++i});""===r[a]?(n.insertBefore(u(),e),o.push(e)):e.data=r[a],s+=a}}else if(8===e.nodeType)if(e.data===a){const t=e.parentNode;null!==e.previousSibling&&i!==c||(i++,t.insertBefore(u(),e)),c=i,this.parts.push({type:"node",index:i}),null===e.nextSibling?e.data="":(o.push(e),i--),s++}else{let t=-1;for(;-1!==(t=e.data.indexOf(a,t+1));)this.parts.push({type:"node",index:-1})}}};n(e);for(const t of o)t.parentNode.removeChild(t)}}const p=t=>-1!==t.index,u=()=>document.createComment(""),f=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class g{constructor(t,e,i){this._parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this._parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this._parts)void 0!==t&&t.commit()}_clone(){const t=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=this.template.parts;let i=0,o=0;const n=t=>{const s=document.createTreeWalker(t,133,null,!1);let r=s.nextNode();for(;i<e.length&&null!==r;){const t=e[i];if(p(t))if(o===t.index){if("node"===t.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(r.previousSibling),this._parts.push(t)}else this._parts.push(...this.processor.handleAttributeExpressions(r,t.name,t.strings,this.options));i++}else o++,"TEMPLATE"===r.nodeName&&n(r.content),r=s.nextNode();else this._parts.push(void 0),i++}};return n(t),s&&(document.adoptNode(t),customElements.upgrade(t)),t}}class y{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){const t=this.strings.length-1;let e="";for(let i=0;i<t;i++){const t=this.strings[i],s=f.exec(t);e+=s?t.substr(0,s.index)+s[1]+s[2]+h+s[3]+a:t+d}return e+this.strings[t]}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}const b=t=>null===t||!("object"==typeof t||"function"==typeof t);class m{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new v(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let s=0;s<e;s++){i+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(null!=t&&(Array.isArray(t)||"string"!=typeof t&&t[Symbol.iterator]))for(const e of t)i+="string"==typeof e?e:String(e);else i+="string"==typeof t?t:String(t)}}return i+t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class v{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===n||b(t)&&t===this.value||(this.value=t,i(t)||(this.committer.dirty=!0))}commit(){for(;i(this.value);){const t=this.value;this.value=n,t(this)}this.value!==n&&this.committer.commit()}}class w{constructor(t){this.value=void 0,this._pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(u()),this.endNode=t.appendChild(u())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t._insert(this.startNode=u()),t._insert(this.endNode=u())}insertAfterPart(t){t._insert(this.startNode=u()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this._pendingValue=t}commit(){for(;i(this._pendingValue);){const t=this._pendingValue;this._pendingValue=n,t(this)}const t=this._pendingValue;t!==n&&(b(t)?t!==this.value&&this._commitText(t):t instanceof y?this._commitTemplateResult(t):t instanceof Node?this._commitNode(t):Array.isArray(t)||t[Symbol.iterator]?this._commitIterable(t):t===r?(this.value=r,this.clear()):this._commitText(t))}_insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}_commitNode(t){this.value!==t&&(this.clear(),this._insert(t),this.value=t)}_commitText(t){const e=this.startNode.nextSibling;t=null==t?"":t,e===this.endNode.previousSibling&&3===e.nodeType?e.data=t:this._commitNode(document.createTextNode("string"==typeof t?t:String(t))),this.value=t}_commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof g&&this.value.template===e)this.value.update(t.values);else{const i=new g(e,t.processor,this.options),s=i._clone();i.update(t.values),this._commitNode(s),this.value=i}}_commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const o of t)void 0===(i=e[s])&&(i=new w(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(o),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){o(this.startNode.parentNode,t.nextSibling,this.endNode)}}class x{constructor(t,e,i){if(this.value=void 0,this._pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this._pendingValue=t}commit(){for(;i(this._pendingValue);){const t=this._pendingValue;this._pendingValue=n,t(this)}if(this._pendingValue===n)return;const t=!!this._pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)),this.value=t,this._pendingValue=n}}class k extends m{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new S(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class S extends v{}let C=!1;try{const e={get capture(){return C=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(t){}class _{constructor(t,e,i){this.value=void 0,this._pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this._boundHandleEvent=(t=>this.handleEvent(t))}setValue(t){this._pendingValue=t}commit(){for(;i(this._pendingValue);){const t=this._pendingValue;this._pendingValue=n,t(this)}if(this._pendingValue===n)return;const t=this._pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),o=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this._boundHandleEvent,this._options),o&&(this._options=R(t),this.element.addEventListener(this.eventName,this._boundHandleEvent,this._options)),this.value=t,this._pendingValue=n}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const R=t=>t&&(C?{capture:t.capture,passive:t.passive,once:t.once}:t.capture),E=new class{handleAttributeExpressions(t,e,i,s){const o=e[0];return"."===o?new k(t,e.slice(1),i).parts:"@"===o?[new _(t,e.slice(1),s.eventContext)]:"?"===o?[new x(t,e.slice(1),i)]:new m(t,e,i).parts}handleTextExpression(t){return new w(t)}};function N(t){let e=P.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},P.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const s=t.strings.join(a);return void 0===(i=e.keyString.get(s))&&(i=new c(t,t.getTemplateElement()),e.keyString.set(s,i)),e.stringsArray.set(t.strings,i),i}const P=new Map,M=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.0.0");const A=(t,...e)=>new y(t,e,"html",E),O=133;function T(t,e){const{element:{content:i},parts:s}=t,o=document.createTreeWalker(i,O,null,!1);let n=$(s),r=s[n],a=-1,d=0;const l=[];let h=null;for(;o.nextNode();){a++;const t=o.currentNode;for(t.previousSibling===h&&(h=null),e.has(t)&&(l.push(t),null===h&&(h=t)),null!==h&&d++;void 0!==r&&r.index===a;)r.index=null!==h?-1:r.index-d,r=s[n=$(s,n)]}l.forEach(t=>t.parentNode.removeChild(t))}const W=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,O,null,!1);for(;i.nextNode();)e++;return e},$=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(p(e))return i}return-1},j=(t,e)=>`${t}--${e}`;let L=!0;void 0===window.ShadyCSS?L=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."),L=!1);const I=t=>e=>{const i=j(e.type,t);let s=P.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},P.set(i,s));let o=s.stringsArray.get(e.strings);if(void 0!==o)return o;const n=e.strings.join(a);if(void 0===(o=s.keyString.get(n))){const i=e.getTemplateElement();L&&window.ShadyCSS.prepareTemplateDom(i,t),o=new c(e,i),s.keyString.set(n,o)}return s.stringsArray.set(e.strings,o),o},B=["html","svg"],D=new Set;window.JSCompiler_renameProperty=((t,e)=>t);const z={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},V=(t,e)=>e!==t&&(e==e||t==t),U={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:V},q=Promise.resolve(!0),H=1,X=4,F=8,G=16,Y=32;class J extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=q,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,i)=>{const s=this._attributeNameForProperty(i,e);void 0!==s&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=U){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():`__${t}`;Object.defineProperty(this.prototype,t,{get(){return this[i]},set(e){const s=this[t];this[i]=e,this._requestUpdate(t,s)},configurable:!0,enumerable:!0})}static finalize(){if(this.hasOwnProperty(JSCompiler_renameProperty("finalized",this))&&this.finalized)return;const t=Object.getPrototypeOf(this);if("function"==typeof t.finalize&&t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=V){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,s=e.converter||z,o="function"==typeof s?s:s.fromAttribute;return o?o(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,s=e.converter;return(s&&s.toAttribute||z.toAttribute)(t,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|Y,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=U){const s=this.constructor,o=s._attributeNameForProperty(t,i);if(void 0!==o){const t=s._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=this._updateState|F,null==t?this.removeAttribute(o):this.setAttribute(o,t),this._updateState=this._updateState&~F}}_attributeToProperty(t,e){if(this._updateState&F)return;const i=this.constructor,s=i._attributeToPropertyMap.get(t);if(void 0!==s){const t=i._classProperties.get(s)||U;this._updateState=this._updateState|G,this[s]=i._propertyValueFromAttribute(e,t),this._updateState=this._updateState&~G}}_requestUpdate(t,e){let i=!0;if(void 0!==t){const s=this.constructor,o=s._classProperties.get(t)||U;s._valueHasChanged(this[t],e,o.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==o.reflect||this._updateState&G||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,o))):i=!1}!this._hasRequestedUpdate&&i&&this._enqueueUpdate()}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){let t,e;this._updateState=this._updateState|X;const i=this._updatePromise;this._updatePromise=new Promise((i,s)=>{t=i,e=s});try{await i}catch(t){}this._hasConnected||await new Promise(t=>this._hasConnectedResolver=t);try{const i=this.performUpdate();null!=i&&await i}catch(t){e(t)}t(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&Y}get _hasRequestedUpdate(){return this._updateState&X}get hasUpdated(){return this._updateState&H}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{(t=this.shouldUpdate(e))&&this.update(e)}catch(e){throw t=!1,e}finally{this._markUpdated()}t&&(this._updateState&H||(this._updateState=this._updateState|H,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~X}get updateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0)}updated(t){}firstUpdated(t){}}J.finalized=!0;const K=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){window.customElements.define(t,e)}}})(t,e),Z=(t,e)=>"method"!==e.kind||!e.descriptor||"value"in e.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}}:Object.assign({},e,{finisher(i){i.createProperty(e.key,t)}}),Q=(t,e,i)=>{e.constructor.createProperty(i,t)};function tt(t){return(e,i)=>void 0!==i?Q(t,e,i):Z(t,e)}function et(t){return(e,i)=>{const s={get(){return this.renderRoot.querySelector(t)},enumerable:!0,configurable:!0};return void 0!==i?it(s,e,i):st(s,e)}}const it=(t,e,i)=>{Object.defineProperty(e,i,t)},st=(t,e)=>({kind:"method",placement:"prototype",key:e.key,descriptor:t}),ot="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,nt=Symbol();class rt{constructor(t,e){if(e!==nt)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(ot?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const at=(t,...e)=>{const i=e.reduce((e,i,s)=>e+(t=>{if(t instanceof rt)return t.cssText;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[s+1],t[0]);return new rt(i,nt)};(window.litElementVersions||(window.litElementVersions=[])).push("2.0.1");const dt=t=>t.flat?t.flat(1/0):function t(e,i=[]){for(let s=0,o=e.length;s<o;s++){const o=e[s];Array.isArray(o)?t(o,i):i.push(o)}return i}(t);class lt extends J{static finalize(){super.finalize(),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const t=this.styles,e=[];return Array.isArray(t)?dt(t).reduceRight((t,e)=>(t.add(e),t),new Set).forEach(t=>e.unshift(t)):t&&e.push(t),e}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?ot?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){super.update(t);const e=this.render();e instanceof y&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){}}lt.finalized=!0,lt.render=((t,e,i)=>{const s=i.scopeName,n=M.has(e),r=e instanceof ShadowRoot&&L&&t instanceof y,a=r&&!D.has(s),d=a?document.createDocumentFragment():e;if(((t,e,i)=>{let s=M.get(e);void 0===s&&(o(e,e.firstChild),M.set(e,s=new w(Object.assign({templateFactory:N},i))),s.appendInto(e)),s.setValue(t),s.commit()})(t,d,Object.assign({templateFactory:I(s)},i)),a){const t=M.get(d);M.delete(d),t.value instanceof g&&((t,e,i)=>{D.add(i);const s=t.querySelectorAll("style");if(0===s.length)return void window.ShadyCSS.prepareTemplateStyles(e.element,i);const o=document.createElement("style");for(let t=0;t<s.length;t++){const e=s[t];e.parentNode.removeChild(e),o.textContent+=e.textContent}if((t=>{B.forEach(e=>{const i=P.get(j(e,t));void 0!==i&&i.keyString.forEach(t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{i.add(t)}),T(t,i)})})})(i),function(t,e,i=null){const{element:{content:s},parts:o}=t;if(null==i)return void s.appendChild(e);const n=document.createTreeWalker(s,O,null,!1);let r=$(o),a=0,d=-1;for(;n.nextNode();)for(d++,n.currentNode===i&&(a=W(e),i.parentNode.insertBefore(e,i));-1!==r&&o[r].index===d;){if(a>0){for(;-1!==r;)o[r].index+=a,r=$(o,r);return}r=$(o,r)}}(e,o,e.element.content.firstChild),window.ShadyCSS.prepareTemplateStyles(e.element,i),window.ShadyCSS.nativeShadow){const i=e.element.content.querySelector("style");t.insertBefore(i.cloneNode(!0),t.firstChild)}else{e.element.content.insertBefore(o,e.element.content.firstChild);const t=new Set;t.add(o),T(e,t)}})(d,t.value.template,s),o(e,e.firstChild),e.appendChild(d),M.set(e,t)}!n&&r&&window.ShadyCSS.styleElement(e.host)});class ht extends lt{fireEvent(t,e,i=!0,s=!0){if(t){const o={bubbles:"boolean"!=typeof i||i,composed:"boolean"!=typeof s||s};e&&(o.detail=e);const n=window.SlickCustomEvent||CustomEvent;this.dispatchEvent(new n(t,o))}}}class ct{constructor(t,e){this.xi=Number.MAX_VALUE,this.yi=Number.MAX_VALUE,this.px1=t[0],this.py1=t[1],this.px2=e[0],this.py2=e[1],this.a=this.py2-this.py1,this.b=this.px1-this.px2,this.c=this.px2*this.py1-this.px1*this.py2,this._undefined=0===this.a&&0===this.b&&0===this.c}isUndefined(){return this._undefined}intersects(t){if(this.isUndefined()||t.isUndefined())return!1;let e=Number.MAX_VALUE,i=Number.MAX_VALUE,s=0,o=0;const n=this.a,r=this.b,a=this.c;return Math.abs(r)>1e-5&&(e=-n/r,s=-a/r),Math.abs(t.b)>1e-5&&(i=-t.a/t.b,o=-t.c/t.b),e===Number.MAX_VALUE?i===Number.MAX_VALUE?-a/n==-t.c/t.a&&(this.py1>=Math.min(t.py1,t.py2)&&this.py1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.py2>=Math.min(t.py1,t.py2)&&this.py2<=Math.max(t.py1,t.py2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=this.px1,this.yi=i*this.xi+o,!((this.py1-this.yi)*(this.yi-this.py2)<-1e-5||(t.py1-this.yi)*(this.yi-t.py2)<-1e-5||Math.abs(t.a)<1e-5&&(t.px1-this.xi)*(this.xi-t.px2)<-1e-5)):i===Number.MAX_VALUE?(this.xi=t.px1,this.yi=e*this.xi+s,!((t.py1-this.yi)*(this.yi-t.py2)<-1e-5||(this.py1-this.yi)*(this.yi-this.py2)<-1e-5||Math.abs(n)<1e-5&&(this.px1-this.xi)*(this.xi-this.px2)<-1e-5)):e===i?s===o&&(this.px1>=Math.min(t.px1,t.px2)&&this.px1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.px2>=Math.min(t.px1,t.px2)&&this.px2<=Math.max(t.px1,t.px2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=(o-s)/(e-i),this.yi=e*this.xi+s,!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5||(t.px1-this.xi)*(this.xi-t.px2)<-1e-5))}}class pt{constructor(t,e,i,s,o,n,r,a){this.deltaX=0,this.hGap=0,this.top=t,this.bottom=e,this.left=i,this.right=s,this.gap=o,this.sinAngle=n,this.tanAngle=a,Math.abs(n)<1e-4?this.pos=i+o:Math.abs(n)>.9999?this.pos=t+o:(this.deltaX=(e-t)*Math.abs(a),this.pos=i-Math.abs(this.deltaX),this.hGap=Math.abs(o/r),this.sLeft=new ct([i,e],[i,t]),this.sRight=new ct([s,e],[s,t]))}nextLine(){if(Math.abs(this.sinAngle)<1e-4){if(this.pos<this.right){const t=[this.pos,this.top,this.pos,this.bottom];return this.pos+=this.gap,t}}else if(Math.abs(this.sinAngle)>.9999){if(this.pos<this.bottom){const t=[this.left,this.pos,this.right,this.pos];return this.pos+=this.gap,t}}else{let t=this.pos-this.deltaX/2,e=this.pos+this.deltaX/2,i=this.bottom,s=this.top;if(this.pos<this.right+this.deltaX){for(;t<this.left&&e<this.left||t>this.right&&e>this.right;)if(this.pos+=this.hGap,t=this.pos-this.deltaX/2,e=this.pos+this.deltaX/2,this.pos>this.right+this.deltaX)return null;const o=new ct([t,i],[e,s]);this.sLeft&&o.intersects(this.sLeft)&&(t=o.xi,i=o.yi),this.sRight&&o.intersects(this.sRight)&&(e=o.xi,s=o.yi),this.tanAngle>0&&(t=this.right-(t-this.left),e=this.right-(e-this.left));const n=[t,i,e,s];return this.pos+=this.hGap,n}}return null}}function ut(t,e){const i=[],s=new ct([t[0],t[1]],[t[2],t[3]]);for(let t=0;t<e.length;t++){const o=new ct(e[t],e[(t+1)%e.length]);s.intersects(o)&&i.push([s.xi,s.yi])}return i}function ft(t,e,i,s,o,n,r){return[-i*n-s*o+i+n*t+o*e,r*(i*o-s*n)+s+-r*o*t+r*n*e]}const gt=2,yt=1,bt=.85,mt=0,vt=9;class wt{constructor(){this.p=""}get value(){return this.p.trim()}moveTo(t,e){this.p=`${this.p}M ${t} ${e} `}bcurveTo(t,e,i,s,o,n){this.p=`${this.p}C ${t} ${e}, ${i} ${s}, ${o} ${n} `}}function xt(t,e){const i=document.createElementNS("http://www.w3.org/2000/svg",t);if(e)for(const t in e)i.setAttributeNS(null,t,e[t]);return i}function kt(t,e){return yt*(Math.random()*(e-t)+t)}function St(t,e,i,s,o){const n=Math.pow(t-i,2)+Math.pow(e-s,2);let r=gt;r*r*100>n&&(r=Math.sqrt(n)/10);const a=r/2,d=.2+.2*Math.random();let l=bt*gt*(s-e)/200,h=bt*gt*(t-i)/200;l=kt(-l,l),h=kt(-h,h);const c=o||new wt;return c.moveTo(t+kt(-r,r),e+kt(-r,r)),c.bcurveTo(l+t+(i-t)*d+kt(-r,r),h+e+(s-e)*d+kt(-r,r),l+t+2*(i-t)*d+kt(-r,r),h+e+2*(s-e)*d+kt(-r,r),i+kt(-r,r),s+kt(-r,r)),c.moveTo(t+kt(-a,a),e+kt(-a,a)),c.bcurveTo(l+t+(i-t)*d+kt(-a,a),h+e+(s-e)*d+kt(-a,a),l+t+2*(i-t)*d+kt(-a,a),h+e+2*(s-e)*d+kt(-a,a),i+kt(-a,a),s+kt(-a,a)),c}function Ct(t,e,i,s,o=!1,n=!1,r){r=r||new wt;const a=Math.pow(t-i,2)+Math.pow(e-s,2);let d=gt;d*d*100>a&&(d=Math.sqrt(a)/10);const l=d/2,h=.2+.2*Math.random();let c=bt*gt*(s-e)/200,p=bt*gt*(t-i)/200;return c=kt(-c,c),p=kt(-p,p),o&&r.moveTo(t+kt(-d,d),e+kt(-d,d)),n?r.bcurveTo(c+t+(i-t)*h+kt(-l,l),p+e+(s-e)*h+kt(-l,l),c+t+2*(i-t)*h+kt(-l,l),p+e+2*(s-e)*h+kt(-l,l),i+kt(-l,l),s+kt(-l,l)):r.bcurveTo(c+t+(i-t)*h+kt(-d,d),p+e+(s-e)*h+kt(-d,d),c+t+2*(i-t)*h+kt(-d,d),p+e+2*(s-e)*h+kt(-d,d),i+kt(-d,d),s+kt(-d,d)),r}function _t(t,e,i,s,o,n,r,a){const d=kt(-.5,.5)-Math.PI/2,l=[];l.push([kt(-n,n)+e+.9*s*Math.cos(d-t),kt(-n,n)+i+.9*o*Math.sin(d-t)]);for(let r=d;r<2*Math.PI+d-.01;r+=t)l.push([kt(-n,n)+e+s*Math.cos(r),kt(-n,n)+i+o*Math.sin(r)]);return l.push([kt(-n,n)+e+s*Math.cos(d+2*Math.PI+.5*r),kt(-n,n)+i+o*Math.sin(d+2*Math.PI+.5*r)]),l.push([kt(-n,n)+e+.98*s*Math.cos(d+r),kt(-n,n)+i+.98*o*Math.sin(d+r)]),l.push([kt(-n,n)+e+.9*s*Math.cos(d+.5*r),kt(-n,n)+i+.9*o*Math.sin(d+.5*r)]),function(t,e){const i=t.length;let s=e||new wt;if(i>3){const e=[],o=1-mt;s.moveTo(t[1][0],t[1][1]);for(let n=1;n+2<i;n++){const i=t[n];e[0]=[i[0],i[1]],e[1]=[i[0]+(o*t[n+1][0]-o*t[n-1][0])/6,i[1]+(o*t[n+1][1]-o*t[n-1][1])/6],e[2]=[t[n+1][0]+(o*t[n][0]-o*t[n+2][0])/6,t[n+1][1]+(o*t[n][1]-o*t[n+2][1])/6],e[3]=[t[n+1][0],t[n+1][1]],s.bcurveTo(e[1][0],e[1][1],e[2][0],e[2][1],e[3][0],e[3][1])}}else 3===i?(s.moveTo(t[0][0],t[0][1]),s.bcurveTo(t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1])):2===i&&(s=St(t[0][0],t[0][1],t[1][0],t[1][1],s));return s}(l,a)}function Rt(t,e,i,s,o){const n=xt("path",{d:St(e,i,s,o).value});return t.appendChild(n),n}function Et(t,e,i,s,o){o-=4;let n=St(e+=2,i+=2,e+(s-=4),i);n=St(e+s,i,e+s,i+o,n),n=St(e+s,i+o,e,i+o,n);const r=xt("path",{d:(n=St(e,i+o,e,i,n)).value});return t.appendChild(r),r}function Nt(t,e){let i;const s=e.length;if(s>2)for(let t=0;t<2;t++){let o=!0;for(let t=1;t<s;t++)i=Ct(e[t-1][0],e[t-1][1],e[t][0],e[t][1],o,t>0,i),o=!1;i=Ct(e[s-1][0],e[s-1][1],e[0][0],e[0][1],o,t>0,i)}else i=2===s?St(e[0][0],e[0][1],e[1][0],e[1][1]):new wt;const o=xt("path",{d:i.value});return t.appendChild(o),o}function Pt(t,e,i,s,o){s=Math.max(s>10?s-4:s-1,1),o=Math.max(o>10?o-4:o-1,1);const n=2*Math.PI/vt;let r=Math.abs(s/2),a=Math.abs(o/2),d=_t(n,e,i,r+=kt(.05*-r,.05*r),a+=kt(.05*-a,.05*a),1,n*kt(.1,kt(.4,1)));const l=xt("path",{d:(d=_t(n,e,i,r,a,1.5,0,d)).value});return t.appendChild(l),l}function Mt(t){const e=xt("g");let i=null;return t.forEach(t=>{Rt(e,t[0][0],t[0][1],t[1][0],t[1][1]),i&&Rt(e,i[0],i[1],t[0][0],t[0][1]),i=t[1]}),e}const At={bowing:bt,curveStepCount:vt,curveTightness:mt,dashGap:0,dashOffset:0,fill:"#000",fillStyle:"hachure",fillWeight:1,hachureAngle:-41,hachureGap:5,maxRandomnessOffset:gt,roughness:yt,simplification:1,stroke:"#000",strokeWidth:2,zigzagOffset:0};function Ot(t){return Mt(function(t,e){const i=[];if(t&&t.length){let s=t[0][0],o=t[0][0],n=t[0][1],r=t[0][1];for(let e=1;e<t.length;e++)s=Math.min(s,t[e][0]),o=Math.max(o,t[e][0]),n=Math.min(n,t[e][1]),r=Math.max(r,t[e][1]);const a=e.hachureAngle;let d=e.hachureGap;d<0&&(d=4*e.strokeWidth),d=Math.max(d,.1);const l=a%180*(Math.PI/180),h=Math.cos(l),c=Math.sin(l),p=Math.tan(l),u=new pt(n-1,r+1,s-1,o+1,d,c,h,p);let f;for(;null!=(f=u.nextLine());){const e=ut(f,t);for(let t=0;t<e.length;t++)if(t<e.length-1){const s=e[t],o=e[t+1];i.push([s,o])}}}return i}(t,At))}function Tt(t,e,i,s){return Mt(function(t,e,i,s,o,n){const r=[];let a=Math.abs(s/2),d=Math.abs(o/2);a+=t.randOffset(.05*a,n),d+=t.randOffset(.05*d,n);const l=n.hachureAngle;let h=n.hachureGap;h<=0&&(h=4*n.strokeWidth);let c=n.fillWeight;c<0&&(c=n.strokeWidth/2);const p=l%180*(Math.PI/180),u=Math.tan(p),f=d/a,g=Math.sqrt(f*u*f*u+1),y=f*u/g,b=1/g,m=h/(a*d/Math.sqrt(d*b*(d*b)+a*y*(a*y))/a);let v=Math.sqrt(a*a-(e-a+m)*(e-a+m));for(let t=e-a+m;t<e+a;t+=m){const s=ft(t,i-(v=Math.sqrt(a*a-(e-t)*(e-t))),e,i,y,b,f),o=ft(t,i+v,e,i,y,b,f);r.push([s,o])}return r}({randOffset:(t,e)=>kt(-t,t)},t,e,i,s,At))}var Wt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},$t=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredButton=class extends ht{constructor(){super(...arguments),this.elevation=1,this.disabled=!1}static get styles(){return at`
        :host {
          display: inline-block;
          font-family: inherit;
          cursor: pointer;
          padding: 8px 10px;
          position: relative;
          text-align: center;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          display: inline-flex;
          outline: none;
          letter-spacing: 1.25px;
          font-size: 14px;
          text-transform: uppercase;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
    
        :host(:active) path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
    
        :host(.wired-disabled) {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
    
        :host(:focus) path {
          stroke-width: 1.5;
        }
    
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
    
        svg {
          display: block;
        }
    
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
          transition: transform 0.05s ease;
        }
        `}render(){return A`
        <slot></slot>
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        `}firstUpdated(){this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect(),s=Math.min(Math.max(1,this.elevation),5),o=i.width+2*(s-1),n=i.height+2*(s-1);e.setAttribute("width",`${o}`),e.setAttribute("height",`${n}`),Et(e,0,0,i.width,i.height);for(let t=1;t<s;t++)Rt(e,2*t,i.height+2*t,i.width+2*t,i.height+2*t).style.opacity=`${(75-10*t)/100}`,Rt(e,i.width+2*t,i.height+2*t,i.width+2*t,2*t).style.opacity=`${(75-10*t)/100}`,Rt(e,2*t,i.height+2*t,i.width+2*t,i.height+2*t).style.opacity=`${(75-10*t)/100}`,Rt(e,i.width+2*t,i.height+2*t,i.width+2*t,2*t).style.opacity=`${(75-10*t)/100}`;this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}},Wt([tt({type:Number}),$t("design:type",Object)],t.WiredButton.prototype,"elevation",void 0),Wt([tt({type:Boolean,reflect:!0}),$t("design:type",Object)],t.WiredButton.prototype,"disabled",void 0),t.WiredButton=Wt([K("wired-button")],t.WiredButton);var jt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};t.WiredCard=class extends ht{constructor(){super(...arguments),this.elevation=1}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
        `}render(){return A`
        <div>
          <slot @slotchange="${()=>this.requestUpdate()}"></slot>
        </div>
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        `}connectedCallback(){super.connectedCallback(),this.resizeHandler||(this.resizeHandler=this.debounce(this.updated.bind(this),200,!1,this),window.addEventListener("resize",this.resizeHandler)),setTimeout(()=>this.updated())}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.resizeHandler&&(window.removeEventListener("resize",this.resizeHandler),delete this.resizeHandler)}debounce(t,e,i,s){let o=0;return()=>{const n=arguments,r=i&&!o;clearTimeout(o),o=window.setTimeout(()=>{o=0,i||t.apply(s,n)},e),r&&t.apply(s,n)}}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect(),i=Math.min(Math.max(1,this.elevation),5),s=e.width+2*(i-1),o=e.height+2*(i-1);t.setAttribute("width",`${s}`),t.setAttribute("height",`${o}`),Et(t,2,2,e.width-4,e.height-4);for(let s=1;s<i;s++)Rt(t,2*s,e.height-4+2*s,e.width-4+2*s,e.height-4+2*s).style.opacity=`${(85-10*s)/100}`,Rt(t,e.width-4+2*s,e.height-4+2*s,e.width-4+2*s,2*s).style.opacity=`${(85-10*s)/100}`,Rt(t,2*s,e.height-4+2*s,e.width-4+2*s,e.height-4+2*s).style.opacity=`${(85-10*s)/100}`,Rt(t,e.width-4+2*s,e.height-4+2*s,e.width-4+2*s,2*s).style.opacity=`${(85-10*s)/100}`;this.classList.add("wired-rendered")}},jt([tt({type:Number}),function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}("design:type",Object)],t.WiredCard.prototype,"elevation",void 0),t.WiredCard=jt([K("wired-card")],t.WiredCard);var Lt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},It=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredCheckbox=class extends ht{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}static get styles(){return at`
        :host {
          display: block;
          font-family: inherit;
          outline: none;
          opacity: 0;
        }
      
        :host(.wired-disabled) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
      
        :host(.wired-disabled) svg {
          background: rgba(0, 0, 0, 0.07);
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(:focus) path {
          stroke-width: 1.5;
        }
      
        #container {
          display: inline-block;
          white-space: nowrap;
        }
      
        .inline {
          display: inline-block;
          vertical-align: middle;
          -moz-user-select: none;
          user-select: none;
        }
      
        #checkPanel {
          cursor: pointer;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: var(--wired-checkbox-icon-color, currentColor);
          stroke-width: 0.7;
        }
        `}render(){return A`
        <div id="container" @click="${this.toggleCheck}">
          <div id="checkPanel" class="inline">
            <svg id="svg" width="0" height="0"></svg>
          </div>
          <div class="inline">
            <slot></slot>
          </div>
        </div>
        `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked,this.fireEvent("change",{checked:this.checked})}firstUpdated(){this.setAttribute("role","checkbox"),this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.toggleCheck())})}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=24;e.setAttribute("width","24"),e.setAttribute("height","24"),Et(e,0,0,i,24);const s=[];s.push(Rt(e,.3*i,.4*24,12,.7*24)),s.push(Rt(e,12,.7*24,29,-5)),s.forEach(t=>{t.style.strokeWidth="2.5"}),this.checked?s.forEach(t=>{t.style.display=""}):s.forEach(t=>{t.style.display="none"}),this.classList.add("wired-rendered")}},Lt([tt({type:Boolean}),It("design:type",Object)],t.WiredCheckbox.prototype,"checked",void 0),Lt([tt({type:Boolean,reflect:!0}),It("design:type",Object)],t.WiredCheckbox.prototype,"disabled",void 0),t.WiredCheckbox=Lt([K("wired-checkbox")],t.WiredCheckbox);var Bt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Dt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredItem=class extends ht{constructor(){super(...arguments),this.value="",this.name="",this.selected=!1}static get styles(){return at`
        :host {
          display: inline-block;
          font-size: 14px;
          text-align: left;
        }
        button {
          cursor: pointer;
          outline: none;
          overflow: hidden;
          color: inherit;
          user-select: none;
          position: relative;
          font-family: inherit;
          text-align: inherit;
          font-size: inherit;
          letter-spacing: 1.25px;
          padding: 1px 10px;
          min-height: 36px;
          text-transform: inherit;
          background: none;
          border: none;
          transition: background-color 0.3s ease, color 0.3s ease;
          width: 100%;
          box-sizing: border-box;
          white-space: nowrap;
        }
        button.selected {
          color: var(--wired-item-selected-color, #fff);
        }
        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: currentColor;
          opacity: 0;
        }
        button span {
          display: inline-block;
          transition: transform 0.2s ease;
          position: relative;
        }
        button:active span {
          transform: scale(1.02);
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          display: none;
        }
        button.selected .overlay {
          display: block;
        }
        svg {
          display: block;
        }
        path {
          stroke: var(--wired-item-selected-bg, #000);
          stroke-width: 2.75;
          fill: transparent;
          transition: transform 0.05s ease;
        }
        @media (hover: hover) {
          button:hover::before {
            opacity: 0.05;
          }
        }
        `}render(){return A`
        <button class="${this.selected?"selected":""}">
          <div class="overlay">
            <svg></svg>
          </div>
          <span>
            <slot></slot>
          </span>
        </button>`}firstUpdated(){this.selected&&setTimeout(()=>this.requestUpdate())}updated(){if(this.svg){for(;this.svg.hasChildNodes();)this.svg.removeChild(this.svg.lastChild);const t=this.getBoundingClientRect();this.svg.setAttribute("width",`${t.width}`),this.svg.setAttribute("height",`${t.height}`);const e=Ot([[0,0],[t.width,0],[t.width,t.height],[0,t.height]]);this.svg.appendChild(e)}}},Bt([tt(),Dt("design:type",Object)],t.WiredItem.prototype,"value",void 0),Bt([tt(),Dt("design:type",Object)],t.WiredItem.prototype,"name",void 0),Bt([tt({type:Boolean}),Dt("design:type",Object)],t.WiredItem.prototype,"selected",void 0),Bt([et("svg"),Dt("design:type",SVGSVGElement)],t.WiredItem.prototype,"svg",void 0),t.WiredItem=Bt([K("wired-item")],t.WiredItem);var zt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Vt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredCombo=class extends ht{constructor(){super(...arguments),this.disabled=!1,this.cardShowing=!1,this.itemNodes=[]}static get styles(){return at`
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          outline: none;
          opacity: 0;
        }
      
        :host(.wired-disabled) {
          opacity: 0.5 !important;
          cursor: default;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.02);
        }
        
        :host(.wired-rendered) {
          opacity: 1;
        }
    
        :host(:focus) path {
          stroke-width: 1.5;
        }
      
        #container {
          white-space: nowrap;
          position: relative;
        }
      
        .inline {
          display: inline-block;
          vertical-align: top
        }
      
        #textPanel {
          min-width: 90px;
          min-height: 18px;
          padding: 8px;
        }
      
        #dropPanel {
          width: 34px;
          cursor: pointer;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
      
        #card {
          position: absolute;
          background: var(--wired-combo-popup-bg, white);
          z-index: 1;
          box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
        }
    
        ::slotted(wired-item) {
          display: block;
        }
        `}render(){return A`
        <div id="container" @click="${this.onCombo}">
          <div id="textPanel" class="inline">
            <span>${this.value&&this.value.text}</span>
          </div>
          <div id="dropPanel" class="inline"></div>
          <div class="overlay">
            <svg id="svg"></svg>
          </div>
        </div>
        <wired-card id="card" tabindex="-1" role="listbox" @mousedown="${this.onItemClick}" @touchstart="${this.onItemClick}"
          style="display: none;">
          <slot id="slot"></slot>
        </wired-card>
        `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){this.setAttribute("role","combobox"),this.setAttribute("aria-haspopup","listbox"),this.refreshSelection(),this.addEventListener("blur",()=>{this.cardShowing&&this.setCardShowing(!1)}),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext();break;case 27:t.preventDefault(),this.cardShowing&&this.setCardShowing(!1);break;case 13:t.preventDefault(),this.setCardShowing(!this.cardShowing);break;case 32:t.preventDefault(),this.cardShowing||this.setCardShowing(!0)}})}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.shadowRoot.getElementById("container").getBoundingClientRect();e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`);const s=this.shadowRoot.getElementById("textPanel").getBoundingClientRect();this.shadowRoot.getElementById("dropPanel").style.minHeight=s.height+"px",Et(e,0,0,s.width,s.height);const o=s.width-4;Et(e,o,0,34,s.height);const n=Math.max(0,Math.abs((s.height-24)/2)),r=Nt(e,[[o+8,5+n],[o+26,5+n],[o+17,n+Math.min(s.height,18)]]);if(r.style.fill="currentColor",r.style.pointerEvents=this.disabled?"none":"auto",r.style.cursor="pointer",this.classList.add("wired-rendered"),this.setAttribute("aria-expanded",`${this.cardShowing}`),!this.itemNodes.length){this.itemNodes=[];const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t&&t.length)for(let e=0;e<t.length;e++){const i=t[e];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.selected=!1,this.lastSelectedItem.removeAttribute("aria-selected"));const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t){let e=null;for(let i=0;i<t.length;i++){const s=t[i];if("WIRED-ITEM"===s.tagName){const t=s.value||"";if(this.selected&&t===this.selected){e=s;break}}}this.lastSelectedItem=e||void 0,this.lastSelectedItem&&(this.lastSelectedItem.selected=!0,this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=e?{value:e.value||"",text:e.textContent||""}:void 0}}setCardShowing(t){this.cardShowing=t;const e=this.shadowRoot.getElementById("card");e.style.display=t?"":"none",t&&setTimeout(()=>{e.requestUpdate(),this.shadowRoot.getElementById("slot").assignedNodes().filter(t=>t.nodeType===Node.ELEMENT_NODE).forEach(t=>{const e=t;e.requestUpdate&&e.requestUpdate()})},10),this.setAttribute("aria-expanded",`${this.cardShowing}`)}onItemClick(t){t.stopPropagation(),this.selected=t.target.value,this.refreshSelection(),this.fireSelected(),setTimeout(()=>{this.setCardShowing(!1)})}fireSelected(){this.fireEvent("selected",{selected:this.selected})}selectPrevious(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:0===e?e=t.length-1:e--,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:e>=t.length-1?e=0:e++,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}onCombo(t){t.stopPropagation(),this.setCardShowing(!this.cardShowing)}},zt([tt({type:Object}),Vt("design:type",Object)],t.WiredCombo.prototype,"value",void 0),zt([tt({type:String}),Vt("design:type",String)],t.WiredCombo.prototype,"selected",void 0),zt([tt({type:Boolean,reflect:!0}),Vt("design:type",Object)],t.WiredCombo.prototype,"disabled",void 0),t.WiredCombo=zt([K("wired-combo")],t.WiredCombo),window.navigator.userAgent.match("Trident")&&(DOMTokenList.prototype.toggle=function(t,e){return void 0===e||e?this.add(t):this.remove(t),void 0===e||e});const Ut=at`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:"liga";-webkit-font-smoothing:antialiased}`,qt=document.createElement("link");qt.rel="stylesheet",qt.href="https://fonts.googleapis.com/icon?family=Material+Icons",document.head.appendChild(qt);let Ht=class extends lt{render(){return A`<slot></slot>`}};Ht.styles=Ut,Ht=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}([K("mwc-icon")],Ht);var Xt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};t.WiredIconButton=class extends ht{constructor(){super(...arguments),this.disabled=!1}static get styles(){return at`
        :host {
          display: -ms-inline-flexbox;
          display: -webkit-inline-flex;
          display: inline-flex;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          -ms-flex-pack: center;
          -webkit-justify-content: center;
          justify-content: center;
          position: relative;
          vertical-align: middle;
          padding: 8px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          cursor: pointer;
          z-index: 0;
          line-height: 1;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box !important;
          outline: none;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.45 !important;
          cursor: default;
          background: rgba(0, 0, 0, 0.07);
          border-radius: 50%;
          pointer-events: none;
        }
      
        :host(:active) path {
          transform: scale(0.96) translate(2%, 2%);
        }
    
        :host(:focus) path {
          stroke-width: 1.5;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: var(--wired-icon-bg-color, transparent);
          transition: transform 0.05s ease;
        }
      
        mwc-icon {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
        }
        `}render(){return A`
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        <mwc-icon>
          <slot></slot>
        </mwc-icon>
        `}firstUpdated(){this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect(),s=Math.min(i.width,i.height);e.setAttribute("width",`${s}`),e.setAttribute("height",`${s}`),Pt(e,s/2,s/2,s,s),this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}},Xt([tt({type:Boolean,reflect:!0}),function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}("design:type",Object)],t.WiredIconButton.prototype,"disabled",void 0),t.WiredIconButton=Xt([K("wired-icon-button")],t.WiredIconButton);var Ft=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Gt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredInput=class extends ht{constructor(){super(...arguments),this.placeholder="",this.type="text",this.autocomplete="",this.autocapitalize="",this.autocorrect="",this.disabled=!1,this.required=!1,this.autofocus=!1,this.readonly=!1}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: sans-serif;
          width: 150px;
          outline: none;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
      
        :host(.wired-disabled) svg {
          background: rgba(0, 0, 0, 0.07);
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
      
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }
        `}render(){return A`
        <input id="txt" name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
          ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
          maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
          size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" @change="${this.onChange}">
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        `}createRenderRoot(){return this.attachShadow({mode:"open",delegatesFocus:!0})}get input(){return this.shadowRoot?this.shadowRoot.getElementById("txt"):null}get value(){const t=this.input;return t&&t.value||""}set value(t){if(this.shadowRoot){const e=this.input;e&&(e.value=t)}else this.pendingValue=t}firstUpdated(){this.value=this.value||this.getAttribute("value")||""}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect();e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`),Et(e,0,0,i.width,i.height),void 0!==this.pendingValue&&(this.input.value=this.pendingValue,delete this.pendingValue),this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled")}onChange(t){t.stopPropagation(),this.fireEvent(t.type,{sourceEvent:t})}},Ft([tt({type:String}),Gt("design:type",Object)],t.WiredInput.prototype,"placeholder",void 0),Ft([tt({type:String}),Gt("design:type",String)],t.WiredInput.prototype,"name",void 0),Ft([tt({type:String}),Gt("design:type",String)],t.WiredInput.prototype,"min",void 0),Ft([tt({type:String}),Gt("design:type",String)],t.WiredInput.prototype,"max",void 0),Ft([tt({type:String}),Gt("design:type",String)],t.WiredInput.prototype,"step",void 0),Ft([tt({type:String}),Gt("design:type",Object)],t.WiredInput.prototype,"type",void 0),Ft([tt({type:String}),Gt("design:type",Object)],t.WiredInput.prototype,"autocomplete",void 0),Ft([tt({type:String}),Gt("design:type",Object)],t.WiredInput.prototype,"autocapitalize",void 0),Ft([tt({type:String}),Gt("design:type",Object)],t.WiredInput.prototype,"autocorrect",void 0),Ft([tt({type:Boolean,reflect:!0}),Gt("design:type",Object)],t.WiredInput.prototype,"disabled",void 0),Ft([tt({type:Boolean}),Gt("design:type",Object)],t.WiredInput.prototype,"required",void 0),Ft([tt({type:Boolean}),Gt("design:type",Object)],t.WiredInput.prototype,"autofocus",void 0),Ft([tt({type:Boolean}),Gt("design:type",Object)],t.WiredInput.prototype,"readonly",void 0),Ft([tt({type:Number}),Gt("design:type",Number)],t.WiredInput.prototype,"minlength",void 0),Ft([tt({type:Number}),Gt("design:type",Number)],t.WiredInput.prototype,"maxlength",void 0),Ft([tt({type:Number}),Gt("design:type",Number)],t.WiredInput.prototype,"size",void 0),t.WiredInput=Ft([K("wired-input")],t.WiredInput);var Yt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Jt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredListbox=class extends ht{constructor(){super(...arguments),this.horizontal=!1,this.itemNodes=[],this.itemClickHandler=this.onItemClick.bind(this)}static get styles(){return at`
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          padding: 5px;
          outline: none;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
    
        :host(:focus) path {
          stroke-width: 1.5;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
    
        ::slotted(wired-item) {
          display: block;
        }
    
        :host(.wired-horizontal) ::slotted(wired-item) {
          display: inline-block;
        }
        `}render(){return A`
        <slot id="slot" @slotchange="${()=>this.requestUpdate()}"></slot>
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        `}firstUpdated(){this.setAttribute("role","listbox"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.refreshSelection(),this.addEventListener("click",this.itemClickHandler),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext()}})}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();if(t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`),Et(t,0,0,e.width,e.height),this.classList.add("wired-rendered"),this.horizontal?this.classList.add("wired-horizontal"):this.classList.remove("wired-horizontal"),!this.itemNodes.length){this.itemNodes=[];const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t&&t.length)for(let e=0;e<t.length;e++){const i=t[e];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}onItemClick(t){t.stopPropagation(),this.selected=t.target.value,this.refreshSelection(),this.fireSelected()}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.selected=!1,this.lastSelectedItem.removeAttribute("aria-selected"));const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t){let e=null;for(let i=0;i<t.length;i++){const s=t[i];if("WIRED-ITEM"===s.tagName){const t=s.value||"";if(this.selected&&t===this.selected){e=s;break}}}this.lastSelectedItem=e||void 0,this.lastSelectedItem&&(this.lastSelectedItem.selected=!0,this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=e?{value:e.value||"",text:e.textContent||""}:void 0}}fireSelected(){this.fireEvent("selected",{selected:this.selected})}selectPrevious(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:0===e?e=t.length-1:e--,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:e>=t.length-1?e=0:e++,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}},Yt([tt({type:Object}),Jt("design:type",Object)],t.WiredListbox.prototype,"value",void 0),Yt([tt({type:String}),Jt("design:type",String)],t.WiredListbox.prototype,"selected",void 0),Yt([tt({type:Boolean}),Jt("design:type",Object)],t.WiredListbox.prototype,"horizontal",void 0),t.WiredListbox=Yt([K("wired-listbox")],t.WiredListbox);var Kt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Zt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredProgress=class extends ht{constructor(){super(...arguments),this.value=0,this.min=0,this.max=100,this.percentage=!1}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          width: 400px;
          height: 42px;
          font-family: sans-serif;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        .labelContainer {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      
        .progressLabel {
          color: var(--wired-progress-label-color, #000);
          font-size: var(--wired-progress-font-size, 14px);
          background: var(--wired-progress-label-background, rgba(255,255,255,0.9));
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 1.25px;
        }
      
        .progbox path {
          stroke: var(--wired-progress-color, rgba(0, 0, 200, 0.8));
          stroke-width: 2.75;
          fill: none;
        }
        `}render(){return A`
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        <div class="overlay labelContainer">
          <div class="progressLabel">${this.getProgressLabel()}</div>
        </div>
        `}getProgressLabel(){return this.percentage?this.max===this.min?"%":Math.floor((this.value-this.min)/(this.max-this.min)*100)+"%":""+this.value}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`),this.box?t.appendChild(this.box):this.box=Et(t,0,0,e.width,e.height);let i=0;if(this.max>this.min){i=(this.value-this.min)/(this.max-this.min);const s=e.width*Math.max(0,Math.min(i,100)),o=Ot([[0,0],[s,0],[s,e.height],[0,e.height]]);t.appendChild(o),o.classList.add("progbox")}this.classList.add("wired-rendered")}},Kt([tt({type:Number}),Zt("design:type",Object)],t.WiredProgress.prototype,"value",void 0),Kt([tt({type:Number}),Zt("design:type",Object)],t.WiredProgress.prototype,"min",void 0),Kt([tt({type:Number}),Zt("design:type",Object)],t.WiredProgress.prototype,"max",void 0),Kt([tt({type:Boolean}),Zt("design:type",Object)],t.WiredProgress.prototype,"percentage",void 0),t.WiredProgress=Kt([K("wired-progress")],t.WiredProgress);var Qt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},te=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredRadio=class extends ht{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.iconsize=24}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: inherit;
          width: 150px;
          outline: none;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.45 !important;
          cursor: default;
          pointer-events: none;
        }
    
        :host(:focus) path {
          stroke-width: 1.5;
        }
      
        #container {
          display: inline-block;
          white-space: nowrap;
        }
      
        .inline {
          display: inline-block;
          vertical-align: middle;
          -moz-user-select: none;
          user-select: none;
        }
      
        #checkPanel {
          cursor: pointer;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: var(--wired-radio-icon-color, currentColor);
          stroke-width: 0.7;
          fill: transparent;
        }
      
        .filledPath {
          fill: var(--wired-radio-icon-color, currentColor);
        }
        `}render(){return A`
        <div id="container" @click="${this.toggleCheck}">
          <div id="checkPanel" class="inline">
            <svg id="svg" width="0" height="0"></svg>
          </div>
          <div class="inline">
            <slot></slot>
          </div>
        </div>
        `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked,this.fireEvent("change",{checked:this.checked})}firstUpdated(){this.setAttribute("role","checkbox"),this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.toggleCheck())})}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);this.dot=void 0;const i={width:this.iconsize||24,height:this.iconsize||24};e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`),Pt(e,i.width/2,i.height/2,i.width,i.height);const s=Math.max(.6*i.width,5),o=Math.max(.6*i.height,5);this.dot=Pt(e,i.width/2,i.height/2,s,o),this.dot.classList.add("filledPath"),this.dot.style.display=this.checked?"":"none",this.classList.add("wired-rendered")}},Qt([tt({type:Boolean}),te("design:type",Object)],t.WiredRadio.prototype,"checked",void 0),Qt([tt({type:Boolean,reflect:!0}),te("design:type",Object)],t.WiredRadio.prototype,"disabled",void 0),Qt([tt({type:String}),te("design:type",String)],t.WiredRadio.prototype,"name",void 0),Qt([tt({type:Number}),te("design:type",Object)],t.WiredRadio.prototype,"iconsize",void 0),t.WiredRadio=Qt([K("wired-radio")],t.WiredRadio);var ee=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};t.WiredRadioGroup=class extends ht{constructor(){super(...arguments),this.radioNodes=[],this.checkListener=this.handleChecked.bind(this)}static get styles(){return at`
        :host {
          display: inline-block;
        }
      
        :host ::slotted(*) {
          padding: var(--wired-radio-group-item-padding, 5px);
        }
        `}render(){return A`
        <slot id="slot" @slotchange="${this.slotChange}"></slot>
        `}connectedCallback(){super.connectedCallback(),this.addEventListener("change",this.checkListener)}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.removeEventListener("checked",this.checkListener)}handleChecked(t){const e=t.detail.checked,i=t.target,s=i.name||"";e?(this.selected=e&&s||"",this.fireSelected()):i.checked=!0}fireSelected(){this.fireEvent("selected",{selected:this.selected})}slotChange(){this.requestUpdate()}firstUpdated(){this.setAttribute("role","radiogroup"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext()}})}updated(){const t=this.shadowRoot.getElementById("slot").assignedNodes();if(this.radioNodes=[],t&&t.length)for(let e=0;e<t.length;e++){const i=t[e];if("WIRED-RADIO"===i.tagName){this.radioNodes.push(i);const t=i.name||"";this.selected&&t===this.selected?i.checked=!0:i.checked=!1}}}selectPrevious(){const t=this.radioNodes;if(t.length){let e=null,i=-1;if(this.selected){for(let e=0;e<t.length;e++)if(t[e].name===this.selected){i=e;break}i<0?e=t[0]:(--i<0&&(i=t.length-1),e=t[i])}else e=t[0];e&&(e.focus(),this.selected=e.name,this.fireSelected())}}selectNext(){const t=this.radioNodes;if(t.length){let e=null,i=-1;if(this.selected){for(let e=0;e<t.length;e++)if(t[e].name===this.selected){i=e;break}i<0?e=t[0]:(++i>=t.length&&(i=0),e=t[i])}else e=t[0];e&&(e.focus(),this.selected=e.name,this.fireSelected())}}},ee([tt({type:String}),function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}("design:type",String)],t.WiredRadioGroup.prototype,"selected",void 0),t.WiredRadioGroup=ee([K("wired-radio-group")],t.WiredRadioGroup),window.JSCompiler_renameProperty=function(t,e){return t};let ie=0,se=0,oe=[],ne=0,re=document.createTextNode("");new window.MutationObserver(function(){const t=oe.length;for(let e=0;e<t;e++){let i=oe[e];if(i)try{i()}catch(t){setTimeout(()=>{throw t})}}oe.splice(0,t),se+=t}).observe(re,{characterData:!0});const ae={after:t=>({run:e=>window.setTimeout(e,t),cancel(t){window.clearTimeout(t)}}),run:(t,e)=>window.setTimeout(t,e),cancel(t){window.clearTimeout(t)}},de={run:t=>(re.textContent=ne++,oe.push(t),ie++),cancel(t){const e=t-se;if(e>=0){if(!oe[e])throw new Error("invalid async handle: "+t);oe[e]=null}}};class le{constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run(()=>{this._timer=null,he.delete(this),this._callback()})}cancel(){this.isActive()&&(this._cancelAsync(),he.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}static debounce(t,e,i){return t instanceof le?t._cancelAsync():t=new le,t.setConfig(e,i),t}}let he=new Set;var ce;window.ShadyDOM,Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss),window.customElements.polyfillWrapFlushCallback,(ce=document.baseURI||window.location.href).substring(0,ce.lastIndexOf("/")+1),window.Polymer&&window.Polymer.sanitizeDOMValue;let pe=!1;const ue=window.ShadyDOM&&window.ShadyDOM.noPatch&&window.ShadyDOM.wrap?window.ShadyDOM.wrap:t=>t;let fe="string"==typeof document.head.style.touchAction,ge="__polymerGestures",ye="__polymerGesturesHandled",be="__polymerGesturesTouchAction",me=25,ve=5,we=["mousedown","mousemove","mouseup","click"],xe=[0,1,4,2],ke=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function Se(t){return we.indexOf(t)>-1}let Ce=!1;function _e(t){if(!Se(t)&&"touchend"!==t)return fe&&Ce&&pe?{passive:!0}:void 0}!function(){try{let t=Object.defineProperty({},"passive",{get(){Ce=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();let Re=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);const Ee=[],Ne={button:!0,input:!0,keygen:!0,meter:!0,output:!0,textarea:!0,progress:!0,select:!0},Pe={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function Me(t){let e=Array.prototype.slice.call(t.labels||[]);if(!e.length){e=[];let i=t.getRootNode();if(t.id){let s=i.querySelectorAll(`label[for = ${t.id}]`);for(let t=0;t<s.length;t++)e.push(s[t])}}return e}let Ae=function(t){let e=t.sourceCapabilities;var i;if((!e||e.firesTouchEvents)&&(t[ye]={skip:!0},"click"===t.type)){let e=!1,s=Le(t);for(let t=0;t<s.length;t++){if(s[t].nodeType===Node.ELEMENT_NODE)if("label"===s[t].localName)Ee.push(s[t]);else if(i=s[t],Ne[i.localName]){let i=Me(s[t]);for(let t=0;t<i.length;t++)e=e||Ee.indexOf(i[t])>-1}if(s[t]===We.mouse.target)return}if(e)return;t.preventDefault(),t.stopPropagation()}};function Oe(t){let e=Re?["click"]:we;for(let i,s=0;s<e.length;s++)i=e[s],t?(Ee.length=0,document.addEventListener(i,Ae,!0)):document.removeEventListener(i,Ae,!0)}function Te(t){let e=t.type;if(!Se(e))return!1;if("mousemove"===e){let e=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!ke&&(e=xe[t.which]||0),Boolean(1&e)}return 0===(void 0===t.button?0:t.button)}let We={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function $e(t,e,i){t.movefn=e,t.upfn=i,document.addEventListener("mousemove",e),document.addEventListener("mouseup",i)}function je(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}document.addEventListener("touchend",function(t){We.mouse.mouseIgnoreJob||Oe(!0),We.mouse.target=Le(t)[0],We.mouse.mouseIgnoreJob=le.debounce(We.mouse.mouseIgnoreJob,ae.after(2500),function(){Oe(),We.mouse.target=null,We.mouse.mouseIgnoreJob=null})},!!Ce&&{passive:!0});const Le=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],Ie={},Be=[];function De(t){const e=Le(t);return e.length>0?e[0]:t.target}function ze(t){let e,i=t.type,s=t.currentTarget[ge];if(!s)return;let o=s[i];if(o){if(!t[ye]&&(t[ye]={},"touch"===i.slice(0,5))){let e=(t=t).changedTouches[0];if("touchstart"===i&&1===t.touches.length&&(We.touch.id=e.identifier),We.touch.id!==e.identifier)return;fe||"touchstart"!==i&&"touchmove"!==i||function(t){let e=t.changedTouches[0],i=t.type;if("touchstart"===i)We.touch.x=e.clientX,We.touch.y=e.clientY,We.touch.scrollDecided=!1;else if("touchmove"===i){if(We.touch.scrollDecided)return;We.touch.scrollDecided=!0;let i=function(t){let e="auto",i=Le(t);for(let t,s=0;s<i.length;s++)if((t=i[s])[be]){e=t[be];break}return e}(t),s=!1,o=Math.abs(We.touch.x-e.clientX),n=Math.abs(We.touch.y-e.clientY);t.cancelable&&("none"===i?s=!0:"pan-x"===i?s=n>o:"pan-y"===i&&(s=o>n)),s?t.preventDefault():He("track")}}(t)}if(!(e=t[ye]).skip){for(let i,s=0;s<Be.length;s++)o[(i=Be[s]).name]&&!e[i.name]&&i.flow&&i.flow.start.indexOf(t.type)>-1&&i.reset&&i.reset();for(let s,n=0;n<Be.length;n++)o[(s=Be[n]).name]&&!e[s.name]&&(e[s.name]=!0,s[i](t))}}}function Ve(t,e,i){return!!Ie[e]&&(function(t,e,i){let s=Ie[e],o=s.deps,n=s.name,r=t[ge];r||(t[ge]=r={});for(let e,i,s=0;s<o.length;s++)e=o[s],Re&&Se(e)&&"click"!==e||((i=r[e])||(r[e]=i={_count:0}),0===i._count&&t.addEventListener(e,ze,_e(e)),i[n]=(i[n]||0)+1,i._count=(i._count||0)+1);t.addEventListener(e,i),s.touchAction&&function(t,e){fe&&t instanceof HTMLElement&&de.run(()=>{t.style.touchAction=e}),t[be]=e}(t,s.touchAction)}(t,e,i),!0)}function Ue(t){Be.push(t);for(let e=0;e<t.emits.length;e++)Ie[t.emits[e]]=t}function qe(t,e,i){let s=new Event(e,{bubbles:!0,cancelable:!0,composed:!0});if(s.detail=i,ue(t).dispatchEvent(s),s.defaultPrevented){let t=i.preventer||i.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function He(t){let e=function(t){for(let e,i=0;i<Be.length;i++){e=Be[i];for(let i,s=0;s<e.emits.length;s++)if((i=e.emits[s])===t)return e}return null}(t);e.info&&(e.info.prevent=!0)}function Xe(t,e,i,s){e&&qe(e,t,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:s,prevent:function(t){return He(t)}})}function Fe(t,e,i){if(t.prevent)return!1;if(t.started)return!0;let s=Math.abs(t.x-e),o=Math.abs(t.y-i);return s>=ve||o>=ve}function Ge(t,e,i){if(!e)return;let s,o=t.moves[t.moves.length-2],n=t.moves[t.moves.length-1],r=n.x-t.x,a=n.y-t.y,d=0;o&&(s=n.x-o.x,d=n.y-o.y),qe(e,"track",{state:t.state,x:i.clientX,y:i.clientY,dx:r,dy:a,ddx:s,ddy:d,sourceEvent:i,hover:function(){return function(t,e){let i=document.elementFromPoint(t,e),s=i;for(;s&&s.shadowRoot&&!window.ShadyDOM&&s!==(s=s.shadowRoot.elementFromPoint(t,e));)s&&(i=s);return i}(i.clientX,i.clientY)}})}function Ye(t,e,i){let s=Math.abs(e.clientX-t.x),o=Math.abs(e.clientY-t.y),n=De(i||e);!n||Pe[n.localName]&&n.hasAttribute("disabled")||(isNaN(s)||isNaN(o)||s<=me&&o<=me||function(t){if("click"===t.type){if(0===t.detail)return!0;let e=De(t);if(!e.nodeType||e.nodeType!==Node.ELEMENT_NODE)return!0;let i=e.getBoundingClientRect(),s=t.pageX,o=t.pageY;return!(s>=i.left&&s<=i.right&&o>=i.top&&o<=i.bottom)}return!1}(e))&&(t.prevent||qe(n,"tap",{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:i}))}Ue({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset:function(){je(this.info)},mousedown:function(t){if(!Te(t))return;let e=De(t),i=this;$e(this.info,function(t){Te(t)||(Xe("up",e,t),je(i.info))},function(t){Te(t)&&Xe("up",e,t),je(i.info)}),Xe("down",e,t)},touchstart:function(t){Xe("down",De(t),t.changedTouches[0],t)},touchend:function(t){Xe("up",De(t),t.changedTouches[0],t)}}),Ue({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove:function(t){this.moves.length>2&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset:function(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,je(this.info)},mousedown:function(t){if(!Te(t))return;let e=De(t),i=this,s=function(t){let s=t.clientX,o=t.clientY;Fe(i.info,s,o)&&(i.info.state=i.info.started?"mouseup"===t.type?"end":"track":"start","start"===i.info.state&&He("tap"),i.info.addMove({x:s,y:o}),Te(t)||(i.info.state="end",je(i.info)),e&&Ge(i.info,e,t),i.info.started=!0)};$e(this.info,s,function(t){i.info.started&&s(t),je(i.info)}),this.info.x=t.clientX,this.info.y=t.clientY},touchstart:function(t){let e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove:function(t){let e=De(t),i=t.changedTouches[0],s=i.clientX,o=i.clientY;Fe(this.info,s,o)&&("start"===this.info.state&&He("tap"),this.info.addMove({x:s,y:o}),Ge(this.info,e,i),this.info.state="track",this.info.started=!0)},touchend:function(t){let e=De(t),i=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),Ge(this.info,e,i))}}),Ue({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset:function(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown:function(t){Te(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click:function(t){Te(t)&&Ye(this.info,t)},touchstart:function(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchend:function(t){Ye(this.info,t.changedTouches[0],t)}});var Je=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Ke=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredSlider=class extends ht{constructor(){super(...arguments),this._value=0,this.min=0,this.max=100,this.knobradius=10,this.disabled=!1,this.step=1,this.barWidth=0,this.intermediateValue=this.min,this.pct=0,this.startx=0,this.dragging=!1}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          width: 300px;
          height: 40px;
          outline: none;
          box-sizing: border-box;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.45 !important;
          cursor: default;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.07);
          border-radius: 5px;
        }
      
        :host(.wired-disabled) .knob {
          pointer-events: none !important;
        }
      
        :host(:focus) .knob {
          cursor: move;
          stroke: var(--wired-slider-knob-outline-color, #000);
          fill-opacity: 0.8;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke-width: 0.7;
          fill: transparent;
        }
      
        .knob {
          pointer-events: auto;
          fill: var(--wired-slider-knob-zero-color, gray);
          stroke: var(--wired-slider-knob-zero-color, gray);
          transition: transform 0.15s ease;
          cursor: pointer;
        }
      
        .hasValue {
          fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
          stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
        }
      
        .bar {
          stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
        }
        `}render(){return A`
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        `}get value(){return this._value}set value(t){this.setValue(t,!0)}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`);const i=this.knobradius||10;this.barWidth=e.width-2*i,this.bar=Rt(t,i,e.height/2,e.width-i,e.height/2),this.bar.classList.add("bar"),this.knobGroup=xt("g"),t.appendChild(this.knobGroup),this.knob=Pt(this.knobGroup,i,e.height/2,2*i,2*i),this.knob.classList.add("knob"),this.onValueChange(),this.classList.add("wired-rendered"),this.setAttribute("role","slider"),this.setAttribute("aria-valuemax",`${this.max}`),this.setAttribute("aria-valuemin",`${this.min}`),this.setAriaValue(),Ve(this.knob,"down",t=>{this.disabled||this.knobdown(t)}),Ve(this.knob,"up",()=>{this.disabled||this.resetKnob()}),Ve(this.knob,"track",t=>{this.disabled||this.onTrack(t)}),this.addEventListener("keydown",t=>{switch(t.keyCode){case 38:case 39:this.incremenent();break;case 37:case 40:this.decrement();break;case 36:this.setValue(this.min);break;case 35:this.setValue(this.max)}})}updated(t){t.has("disabled")&&this.refreshDisabledState()}setAriaValue(){this.setAttribute("aria-valuenow",`${this.value}`)}setValue(t,e=!1){this._value=t,this.setAriaValue(),this.onValueChange(),e||this.fireEvent("change",{value:this.intermediateValue})}incremenent(){const t=Math.min(this.max,Math.round(this.value+this.step));t!==this.value&&this.setValue(t)}decrement(){const t=Math.max(this.min,Math.round(this.value-this.step));t!==this.value&&this.setValue(t)}onValueChange(){if(!this.knob)return;let t=0;this.max>this.min&&(t=Math.min(1,Math.max((this.value-this.min)/(this.max-this.min),0))),this.pct=t,t?this.knob.classList.add("hasValue"):this.knob.classList.remove("hasValue");const e=t*this.barWidth;this.knobGroup.style.transform=`translateX(${Math.round(e)}px)`}knobdown(t){this.knobExpand(!0),t.preventDefault(),this.focus()}resetKnob(){this.knobExpand(!1)}knobExpand(t){this.knob&&(t?this.knob.classList.add("expanded"):this.knob.classList.remove("expanded"))}onTrack(t){switch(t.stopPropagation(),t.detail.state){case"start":this.trackStart();break;case"track":this.trackX(t);break;case"end":this.trackEnd()}}trackStart(){this.intermediateValue=this.value,this.startx=this.pct*this.barWidth,this.dragging=!0}trackX(t){this.dragging||this.trackStart();const e=t.detail.dx||0,i=Math.max(Math.min(this.startx+e,this.barWidth),0);this.knobGroup.style.transform=`translateX(${Math.round(i)}px)`;const s=i/this.barWidth;this.intermediateValue=this.min+s*(this.max-this.min)}trackEnd(){this.dragging=!1,this.resetKnob(),this.setValue(this.intermediateValue),this.pct=(this.value-this.min)/(this.max-this.min)}},Je([tt({type:Number}),Ke("design:type",Object)],t.WiredSlider.prototype,"_value",void 0),Je([tt({type:Number}),Ke("design:type",Object)],t.WiredSlider.prototype,"min",void 0),Je([tt({type:Number}),Ke("design:type",Object)],t.WiredSlider.prototype,"max",void 0),Je([tt({type:Number}),Ke("design:type",Object)],t.WiredSlider.prototype,"knobradius",void 0),Je([tt({type:Boolean,reflect:!0}),Ke("design:type",Object)],t.WiredSlider.prototype,"disabled",void 0),t.WiredSlider=Je([K("wired-slider")],t.WiredSlider);var Ze=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Qe=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredTextarea=class extends ht{constructor(){super(...arguments),this.rows=1,this.maxrows=0,this.autocomplete="",this.autofocus=!1,this.disabled=!1,this.inputmode="",this.placeholder="",this.required=!1,this.readonly=!1,this.tokens=[],this.prevHeight=0}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          font-family: sans-serif;
          width: 400px;
          outline: none;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
      
        :host(.wired-disabled) svg {
          background: rgba(0, 0, 0, 0.07);
        }
      
        .fit {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      
        .overlay {
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
      
        .mirror-text {
          visibility: hidden;
          word-wrap: break-word;
        }
    
        #mirror {
          padding: 10px;
        }
      
        textarea {
          position: relative;
          outline: none;
          border: none;
          resize: none;
          background: inherit;
          color: inherit;
          width: 100%;
          height: 100%;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
          text-align: inherit;
          padding: 10px;
          box-sizing: border-box;
        }
        `}render(){return A`
        <div id="mirror" class="mirror-text">&#160;</div>
        <div class="fit">
          <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}"
            placeholder="${this.placeholder}" ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}"
            rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}" @input="${this.onInput}"></textarea>
        </div>
        <div class="fit overlay">
          <svg id="svg"></svg>
        </div>
        `}createRenderRoot(){return this.attachShadow({mode:"open",delegatesFocus:!0})}get textarea(){return this.shadowRoot?this.shadowRoot.getElementById("textarea"):null}get mirror(){return this.shadowRoot.getElementById("mirror")}get value(){const t=this.textarea;return t&&t.value||""}set value(t){const e=this.textarea;e&&(e.value!==t&&(e.value=t||""),this.mirror.innerHTML=this.valueForMirror(),this.requestUpdate())}valueForMirror(){const t=this.textarea;return t?(this.tokens=t&&t.value?t.value.replace(/&/gm,"&amp;").replace(/"/gm,"&quot;").replace(/'/gm,"&#39;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").split("\n"):[""],this.constrain(this.tokens)):""}constrain(t){let e;for(t=t||[""],e=this.maxrows>0&&t.length>this.maxrows?t.slice(0,this.maxrows):t.slice(0);this.rows>0&&e.length<this.rows;)e.push("");return e.join("<br/>")+"&#160;"}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled")}firstUpdated(){this.value=this.value||this.getAttribute("value")||""}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg"),i=this.getBoundingClientRect();if(this.prevHeight!==i.height){for(;e.hasChildNodes();)e.removeChild(e.lastChild);e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`),Et(e,2,2,i.width-2,i.height-2),this.prevHeight=i.height,this.classList.add("wired-rendered"),this.updateCached()}}updateCached(){this.mirror.innerHTML=this.constrain(this.tokens)}onInput(){this.value=this.textarea.value}},Ze([tt({type:Number}),Qe("design:type",Object)],t.WiredTextarea.prototype,"rows",void 0),Ze([tt({type:Number}),Qe("design:type",Object)],t.WiredTextarea.prototype,"maxrows",void 0),Ze([tt({type:String}),Qe("design:type",Object)],t.WiredTextarea.prototype,"autocomplete",void 0),Ze([tt({type:Boolean}),Qe("design:type",Object)],t.WiredTextarea.prototype,"autofocus",void 0),Ze([tt({type:Boolean,reflect:!0}),Qe("design:type",Object)],t.WiredTextarea.prototype,"disabled",void 0),Ze([tt({type:String}),Qe("design:type",Object)],t.WiredTextarea.prototype,"inputmode",void 0),Ze([tt({type:String}),Qe("design:type",Object)],t.WiredTextarea.prototype,"placeholder",void 0),Ze([tt({type:Boolean}),Qe("design:type",Object)],t.WiredTextarea.prototype,"required",void 0),Ze([tt({type:Boolean}),Qe("design:type",Object)],t.WiredTextarea.prototype,"readonly",void 0),Ze([tt({type:Number}),Qe("design:type",Number)],t.WiredTextarea.prototype,"minlength",void 0),Ze([tt({type:Number}),Qe("design:type",Number)],t.WiredTextarea.prototype,"maxlength",void 0),t.WiredTextarea=Ze([K("wired-textarea")],t.WiredTextarea);var ti=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ei=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredToggle=class extends ht{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}static get styles(){return at`
        :host {
          display: inline-block;
          cursor: pointer;
          position: relative;
          outline: none;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.4 !important;
          cursor: default;
          pointer-events: none;
        }
      
        :host(.wired-disabled) svg {
          background: rgba(0, 0, 0, 0.07);
        }
    
        :host(:focus) path {
          stroke-width: 1.2;
        }
    
        svg {
          display: block;
        }
      
        path {
          stroke: currentColor;
          stroke-width: 0.7;
          fill: transparent;
        }
    
        .knob {
          transition: transform 0.3s ease;
        }
        .knob path {
          stroke-width: 0.7;
        }
        .knob.checked {
          transform: translateX(48px);
        }
        .knobfill path {
          stroke-width: 3 !important;
          fill: transparent;
        }
        .knob.unchecked .knobfill path {
          stroke: var(--wired-toggle-off-color, gray);
        }
        .knob.checked .knobfill path {
          stroke: var(--wired-toggle-on-color, rgb(63, 81, 181));
        }
        `}render(){return A`
        <div @click="${this.toggleCheck}">
          <svg id="svg"></svg>
        </div>
        `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked,this.fireEvent("change",{checked:this.checked})}firstUpdated(){this.setAttribute("role","switch"),this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.toggleCheck())});const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);t.setAttribute("width","80"),t.setAttribute("height","34"),Et(t,16,8,48,18),this.knob=xt("g"),this.knob.classList.add("knob"),t.appendChild(this.knob);const e=Tt(16,16,32,32);e.classList.add("knobfill"),this.knob.appendChild(e),Pt(this.knob,16,16,32,32),this.classList.add("wired-rendered")}updated(t){if(t.has("disabled")&&this.refreshDisabledState(),this.knob){const t=this.knob.classList;this.checked?(t.remove("unchecked"),t.add("checked")):(t.remove("checked"),t.add("unchecked"))}this.setAttribute("aria-checked",`${this.checked}`)}},ti([tt({type:Boolean}),ei("design:type",Object)],t.WiredToggle.prototype,"checked",void 0),ti([tt({type:Boolean,reflect:!0}),ei("design:type",Object)],t.WiredToggle.prototype,"disabled",void 0),t.WiredToggle=ti([K("wired-toggle")],t.WiredToggle);var ii=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},si=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredTooltip=class extends ht{constructor(){super(...arguments),this.offset=14,this.position="bottom",this.dirty=!1,this.showing=!1,this._target=null,this.showHandler=this.show.bind(this),this.hideHandler=this.hide.bind(this)}static get styles(){return at`
        :host {
          display: block;
          position: absolute;
          outline: none;
          z-index: 1002;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
          cursor: default;
          font-family: inherit;
          font-size: 9pt;
          line-height: 1;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke-width: 0.7;
          stroke: var(--wired-tooltip-border-color, currentColor);
          fill: var(--wired-tooltip-background, rgba(255, 255, 255, 0.9));
        }
      
        #container {
          position: relative;
          padding: 8px;
        }
        `}render(){return A`
        <div id="container" style="display: none;">
          <div class="overlay">
            <svg id="svg"></svg>
          </div>
          <span style="position: relative;">${this.text}</span>
        </div>
        `}get target(){if(this._target)return this._target;const t=this.parentNode,e=(this.getRootNode?this.getRootNode():null)||document;let i=null;return this.for?i=e.querySelector("#"+this.for):t&&(i=t.nodeType===Node.DOCUMENT_FRAGMENT_NODE?e.host:t),i}detachListeners(){this._target&&(this._target.removeEventListener("mouseenter",this.showHandler),this._target.removeEventListener("focus",this.showHandler),this._target.removeEventListener("mouseleave",this.hideHandler),this._target.removeEventListener("blur",this.hideHandler),this._target.removeEventListener("click",this.hideHandler)),this.removeEventListener("mouseenter",this.hideHandler)}attachListeners(){this._target&&(this._target.addEventListener("mouseenter",this.showHandler),this._target.addEventListener("focus",this.showHandler),this._target.addEventListener("mouseleave",this.hideHandler),this._target.addEventListener("blur",this.hideHandler),this._target.addEventListener("click",this.hideHandler)),this.addEventListener("mouseenter",this.hideHandler)}refreshTarget(){this.detachListeners(),this._target=null,this._target=this.target,this.attachListeners(),this.dirty=!0}layout(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();let i=e.width,s=e.height;switch(this.position){case"left":case"right":i+=this.offset;break;default:s+=this.offset}t.setAttribute("width",`${i}`),t.setAttribute("height",`${s}`);let o=[];switch(this.position){case"top":o=[[2,2],[i-2,2],[i-2,s-this.offset],[i/2+8,s-this.offset],[i/2,s-this.offset+8],[i/2-8,s-this.offset],[0,s-this.offset]];break;case"left":o=[[2,2],[i-this.offset,2],[i-this.offset,s/2-8],[i-this.offset+8,s/2],[i-this.offset,s/2+8],[i-this.offset,s],[2,s-2]];break;case"right":o=[[this.offset,2],[i-2,2],[i-2,s-2],[this.offset,s-2],[this.offset,s/2+8],[this.offset-8,s/2],[this.offset,s/2-8]],t.style.transform=`translateX(${-this.offset}px)`;break;default:o=[[2,this.offset],[0,s-2],[i-2,s-2],[i-2,this.offset],[i/2+8,this.offset],[i/2,this.offset-8],[i/2-8,this.offset]],t.style.transform=`translateY(${-this.offset}px)`}Nt(t,o),this.dirty=!1}firstUpdated(){this.layout()}updated(t){(t.has("position")||t.has("text"))&&(this.dirty=!0),this._target&&!t.has("for")||this.refreshTarget(),this.dirty&&this.layout()}show(){this.showing||(this.showing=!0,this.shadowRoot.getElementById("container").style.display="",this.updatePosition(),setTimeout(()=>{this.layout()},1))}hide(){this.showing&&(this.showing=!1,this.shadowRoot.getElementById("container").style.display="none")}updatePosition(){if(!this._target||!this.offsetParent)return;const t=this.offset,e=this.offsetParent.getBoundingClientRect(),i=this._target.getBoundingClientRect(),s=this.getBoundingClientRect(),o=(i.width-s.width)/2,n=(i.height-s.height)/2,r=i.left-e.left,a=i.top-e.top;let d,l;switch(this.position){case"top":d=r+o,l=a-s.height-t;break;case"bottom":d=r+o,l=a+i.height+t;break;case"left":d=r-s.width-t,l=a+n;break;case"right":d=r+i.width+t,l=a+n}this.style.left=d+"px",this.style.top=l+"px"}},ii([tt({type:String}),si("design:type",String)],t.WiredTooltip.prototype,"for",void 0),ii([tt({type:String}),si("design:type",String)],t.WiredTooltip.prototype,"text",void 0),ii([tt({type:Number}),si("design:type",Object)],t.WiredTooltip.prototype,"offset",void 0),ii([tt({type:String}),si("design:type",String)],t.WiredTooltip.prototype,"position",void 0),t.WiredTooltip=ii([K("wired-tooltip")],t.WiredTooltip);const oi=(t,e)=>{const i=t.startNode.parentNode,s=void 0===e?t.endNode:e.startNode,o=i.insertBefore(u(),s);i.insertBefore(u(),s);const n=new w(t.options);return n.insertAfterNode(o),n},ni=(t,e)=>(t.setValue(e),t.commit(),t),ri=(t,e,i)=>{const s=t.startNode.parentNode,o=i?i.startNode:t.endNode,n=e.endNode.nextSibling;n!==o&&((t,e,i=null,s=null)=>{let o=e;for(;o!==i;){const e=o.nextSibling;t.insertBefore(o,s),o=e}})(s,e.startNode,n,o)},ai=t=>{o(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},di=(t,e,i)=>{const s=new Map;for(let o=e;o<=i;o++)s.set(t[o],o);return s},li=new WeakMap,hi=new WeakMap,ci=(t=>(...t)=>{const i=((t,e,i)=>{let s;return void 0===i?i=e:void 0!==e&&(s=e),e=>{if(!(e instanceof w))throw new Error("repeat can only be used in text bindings");const o=li.get(e)||[],n=hi.get(e)||[],r=[],a=[],d=[];let l,h,c=0;for(const e of t)d[c]=s?s(e,c):c,a[c]=i(e,c),c++;let p=0,u=o.length-1,f=0,g=a.length-1;for(;p<=u&&f<=g;)if(null===o[p])p++;else if(null===o[u])u--;else if(n[p]===d[f])r[f]=ni(o[p],a[f]),p++,f++;else if(n[u]===d[g])r[g]=ni(o[u],a[g]),u--,g--;else if(n[p]===d[g])r[g]=ni(o[p],a[g]),ri(e,o[p],r[g+1]),p++,g--;else if(n[u]===d[f])r[f]=ni(o[u],a[f]),ri(e,o[u],o[p]),u--,f++;else if(void 0===l&&(l=di(d,f,g),h=di(n,p,u)),l.has(n[p]))if(l.has(n[u])){const t=h.get(d[f]),i=void 0!==t?o[t]:null;if(null===i){const t=oi(e,o[p]);ni(t,a[f]),r[f]=t}else r[f]=ni(i,a[f]),ri(e,i,o[p]),o[t]=null;f++}else ai(o[u]),u--;else ai(o[p]),p++;for(;f<=g;){const t=oi(e,r[g+1]);ni(t,a[f]),r[f++]=t}for(;p<=u;){const t=o[p++];null!==t&&ai(t)}li.set(e,r),hi.set(e,d)}})(...t);return e.set(i,!0),i})();var pi=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ui=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredTab=class extends ht{constructor(){super(...arguments),this.name="",this.label=""}static get styles(){return at`
        :host {
          display: block;
        }
        wired-card {
          display: block;
        }
        `}render(){return A`
        <wired-card>
          <slot></slot>
        </wired-card>
        `}relayout(){setTimeout(()=>{this.card&&this.card.requestUpdate()})}},pi([tt({type:String}),ui("design:type",Object)],t.WiredTab.prototype,"name",void 0),pi([tt({type:String}),ui("design:type",Object)],t.WiredTab.prototype,"label",void 0),pi([et("wired-card"),ui("design:type",t.WiredCard)],t.WiredTab.prototype,"card",void 0),t.WiredTab=pi([K("wired-tab")],t.WiredTab),t.WizardTabs=class extends ht{constructor(){super(...arguments),this.pages=[],this.pageMap=new Map}static get styles(){return at`
        :host {
          display: block;
        }
    
        .hidden {
          display: none !important;
        }
      
        ::slotted(.hidden) {
          display: none !important;
        }
    
        :host ::slotted(.hidden) {
          display: none !important;
        }
    
        #bar {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
        }
        `}render(){return A`
        <div id="bar">
          ${ci(this.pages,t=>t.name,t=>A`
          <wired-item role="tab" .value="${t.name}" .selected="${t.name===this.selected}" ?aria-selected="${t.name===this.selected}"
            @click="${()=>this.selected=t.name}">${t.label||t.name}</wired-item>
          `)}
        </div>
        <div>
          <slot id="slot" @slotchange="${this.mapPages}"></slot>
        </div>
        `}mapPages(){if(this.pages=[],this.pageMap.clear(),this.slotElement){const t=this.slotElement.assignedNodes();if(t&&t.length){for(let e=0;e<t.length;e++){const i=t[e];if(i.nodeType===Node.ELEMENT_NODE&&"wired-tab"===i.tagName.toLowerCase()){const t=i;this.pages.push(t);const e=t.getAttribute("name")||"";e&&e.trim().split(" ").forEach(e=>{e&&this.pageMap.set(e,t)})}}this.selected||this.pages.length&&(this.selected=this.pages[0].name),this.requestUpdate()}}}firstUpdated(){this.mapPages(),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext()}})}updated(){const t=this.getElement();for(let e=0;e<this.pages.length;e++){const i=this.pages[e];i===t?i.classList.remove("hidden"):i.classList.add("hidden")}this.current=t||void 0,this.current&&this.current.relayout()}getElement(){let t=void 0;return this.selected&&(t=this.pageMap.get(this.selected)),t||(t=this.pages[0]),t||null}selectPrevious(){const t=this.pages;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.current){e=i;break}e<0?e=0:0===e?e=t.length-1:e--,this.selected=t[e].name||""}}selectNext(){const t=this.pages;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.current){e=i;break}e<0?e=0:e>=t.length-1?e=0:e++,this.selected=t[e].name||""}}},pi([tt({type:String}),ui("design:type",String)],t.WizardTabs.prototype,"selected",void 0),pi([et("slot"),ui("design:type",HTMLSlotElement)],t.WizardTabs.prototype,"slotElement",void 0),t.WizardTabs=pi([K("wired-tabs")],t.WizardTabs);var fi=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};t.WiredFab=class extends ht{constructor(){super(...arguments),this.disabled=!1}static get styles(){return at`
        :host {
          display: -ms-inline-flexbox;
          display: -webkit-inline-flex;
          display: inline-flex;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          -ms-flex-pack: center;
          -webkit-justify-content: center;
          justify-content: center;
          position: relative;
          vertical-align: middle;
          padding: 16px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          cursor: pointer;
          z-index: 0;
          line-height: 1;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box !important;
          outline: none;
          color: #fff;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
      
        :host(.wired-disabled) {
          opacity: 0.45 !important;
          cursor: default;
          background: rgba(0, 0, 0, 0.07);
          border-radius: 50%;
          pointer-events: none;
        }
      
        :host(:active) mwc-icon {
          opacity: 1;
          transform: scale(1.15);
        }
    
        :host(:focus) mwc-icon {
          opacity: 1;
        }
      
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      
        svg {
          display: block;
        }
      
        path {
          stroke: var(--wired-fab-bg-color, #018786);
          stroke-width: 3;
          fill: transparent;
        }
      
        mwc-icon {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
          transition: transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.85;
        }
        `}render(){return A`
        <div class="overlay">
          <svg id="svg"></svg>
        </div>
        <mwc-icon>
          <slot></slot>
        </mwc-icon>
        `}firstUpdated(){this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect(),s=Math.min(i.width,i.height);e.setAttribute("width",`${s}`),e.setAttribute("height",`${s}`);const o=Tt(s/2,s/2,s,s);e.appendChild(o),this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}},fi([tt({type:Boolean,reflect:!0}),function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}("design:type",Object)],t.WiredFab.prototype,"disabled",void 0),t.WiredFab=fi([K("wired-fab")],t.WiredFab);var gi=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},yi=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};t.WiredSpinner=class extends ht{constructor(){super(...arguments),this.spinning=!1,this.duration=1500,this.value=0,this.timerstart=0,this.frame=0}static get styles(){return at`
        :host {
          display: inline-block;
          position: relative;
          opacity: 0;
        }
    
        :host(.wired-rendered) {
          opacity: 1;
        }
    
        #svg {
          display: block;
          width: 76px;
          height: 76px;
        }
    
        path {
          stroke: currentColor;
          stroke-opacity: 0.5;
          stroke-width: 1.5;
          fill: none;
        }
        .knob path {
          stroke-width: 2.8 !important;
          stroke-opacity: 1;
        }
        `}render(){return A`
        <svg id="svg"></svg>
        `}firstUpdated(){this.svg&&(Pt(this.svg,38,38,60,60),this.knob=Tt(0,0,20,20),this.knob.classList.add("knob"),this.svg.appendChild(this.knob)),this.updateCursor(),this.classList.add("wired-rendered")}updated(){this.spinning?this.startSpinner():this.stopSpinner()}startSpinner(){this.stopSpinner(),this.value=0,this.timerstart=0,this.nextTick()}stopSpinner(){this.frame&&(window.cancelAnimationFrame(this.frame),this.frame=0)}nextTick(){this.frame=window.requestAnimationFrame(t=>this.tick(t))}tick(t){this.spinning?(this.timerstart||(this.timerstart=t),this.value=Math.min(1,(t-this.timerstart)/this.duration),this.updateCursor(),this.value>=1&&(this.value=0,this.timerstart=0),this.nextTick()):this.frame=0}updateCursor(){if(this.knob){const t=[Math.round(38+25*Math.cos(this.value*Math.PI*2)),Math.round(38+25*Math.sin(this.value*Math.PI*2))];this.knob.style.transform=`translate3d(${t[0]}px, ${t[1]}px, 0) rotateZ(${Math.round(360*this.value*2)}deg)`}}},gi([tt({type:Boolean}),yi("design:type",Object)],t.WiredSpinner.prototype,"spinning",void 0),gi([tt({type:Number}),yi("design:type",Object)],t.WiredSpinner.prototype,"duration",void 0),gi([et("svg"),yi("design:type",SVGSVGElement)],t.WiredSpinner.prototype,"svg",void 0),t.WiredSpinner=gi([K("wired-spinner")],t.WiredSpinner)})({})}catch(t){}function E(e){var i,s,o,n,u,f,g,y,b;return{c(){var t,r,a,d;i=l("wired-input"),s=c(),(o=l("wired-button")).textContent="Submit",n=c(),u=l("h4"),f=h("Hello "),g=h(e.name),y=h("!"),p(i,"placeholder","Enter your name"),p(o,"elevation","3"),t=o,r="click",a=e.handleClick,t.addEventListener(r,a,d),b=(()=>t.removeEventListener(r,a,d))},m(t,d){var l;a(t,i,d),l=(()=>e.wired_input_binding(i,null)),m.push(l),a(t,s,d),a(t,o,d),a(t,n,d),a(t,u,d),r(u,f),r(u,g),r(u,y)},p(t,e){var s,o;t.items&&(e.wired_input_binding(null,i),e.wired_input_binding(i,null)),t.name&&(s=g,o=""+(o=e.name),s.data!==o&&(s.data=o))},i:t,o:t,d(t){t&&d(i),e.wired_input_binding(null,i),t&&(d(s),d(o),d(n),d(u)),b()}}}function N(t,e,i){let s,o="";return{name:o,input:s,handleClick:function(){i("name",o=s.value)},wired_input_binding:function(t,e){i("input",s=t)}}}return new class extends R{constructor(t){super(),_(this,t,N,E,n,[])}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
