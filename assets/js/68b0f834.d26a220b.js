"use strict";(self.webpackChunkchaosblade=self.webpackChunkchaosblade||[]).push([[6432],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return h}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},u=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),b=s(r),h=a,f=b["".concat(l,".").concat(h)]||b[h]||p[h]||o;return r?n.createElement(f,c(c({ref:t},u),{},{components:r})):n.createElement(f,c({ref:t},u))}));function h(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,c=new Array(o);c[0]=b;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var s=2;s<o;s++)c[s]=r[s];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},8585:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return c},default:function(){return p},frontMatter:function(){return o},metadata:function(){return i},toc:function(){return s}});var n=r(7462),a=(r(7294),r(3905));const o={title:"Chaosblade, \u963f\u91cc\u4e00\u4e2a\u8d85\u7ea7\u725b\u903c\u7684\u6df7\u6c8c\u5b9e\u9a8c\u5b9e\u65bd\u5de5\u5177",tags:["chaosblade"],author:"1\u70b925",author_url:"https://juejin.cn/user/4353721774901806",author_image_url:"https://p3-passport.byteimg.com/img/user-avatar/023f14b3a5377f09b98af09696e3c6ac~180x180.awebp",hide_table_of_contents:!1},c=void 0,i={permalink:"/blog/2019/07/03/chaosblade-chaos-engineering-tools",editUrl:"https://github.com/chaosblade-io/chaosblade-website/edit/master/website/blog/blog/2019-07-03-chaosblade-chaos-engineering-tools.md",source:"@site/blog/2019-07-03-chaosblade-chaos-engineering-tools.md",title:"Chaosblade, \u963f\u91cc\u4e00\u4e2a\u8d85\u7ea7\u725b\u903c\u7684\u6df7\u6c8c\u5b9e\u9a8c\u5b9e\u65bd\u5de5\u5177",description:"\u8f6c\u81ea\uff1ahttps://juejin.cn/post/6844903879814053901",date:"2019-07-03T00:00:00.000Z",formattedDate:"2019\u5e747\u67083\u65e5",tags:[{label:"chaosblade",permalink:"/blog/tags/chaosblade"}],readingTime:13.42,hasTruncateMarker:!0,authors:[{name:"1\u70b925",url:"https://juejin.cn/user/4353721774901806",imageURL:"https://p3-passport.byteimg.com/img/user-avatar/023f14b3a5377f09b98af09696e3c6ac~180x180.awebp"}],frontMatter:{title:"Chaosblade, \u963f\u91cc\u4e00\u4e2a\u8d85\u7ea7\u725b\u903c\u7684\u6df7\u6c8c\u5b9e\u9a8c\u5b9e\u65bd\u5de5\u5177",tags:["chaosblade"],author:"1\u70b925",author_url:"https://juejin.cn/user/4353721774901806",author_image_url:"https://p3-passport.byteimg.com/img/user-avatar/023f14b3a5377f09b98af09696e3c6ac~180x180.awebp",hide_table_of_contents:!1},prevItem:{title:"ChaosBlade\uff1a\u4e91\u539f\u751f\u67b6\u6784\u4e0b\u7684\u6df7\u6c8c\u5de5\u7a0b\u63a2\u7d22\u548c\u5b9e\u8df5",permalink:"/blog/2019/10/17/chaosblade-cloud-native"}},l={authorsImageUrls:[void 0]},s=[],u={toc:s};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"\u8f6c\u81ea\uff1a",(0,a.kt)("a",{parentName:"p",href:"https://juejin.cn/post/6844903879814053901"},"https://juejin.cn/post/6844903879814053901"),"\n\u6765\u6e90\uff1a\u7a00\u571f\u6398\u91d1")),(0,a.kt)("h1",{id:"chaosblade\u662f\u4ec0\u4e48"},"Chaosblade\u662f\u4ec0\u4e48\uff1f"),(0,a.kt)("p",null,"Chaosblade\u662f\u9075\u5faa\u6df7\u6c8c\u5de5\u7a0b\uff08Chaos Engineering\uff09\u539f\u7406\u7684\u5b9e\u9a8c\u5de5\u5177\uff0c\u7528\u4e8e\u6a21\u62df\u5e38\u89c1\u7684\u6545\u969c\u573a\u666f\uff0c\u5e2e\u52a9\u63d0\u5347\u5206\u5e03\u5f0f\u7cfb\u7edf\u7684\u53ef\u6062\u590d\u6027\u548c\u5bf9\u6545\u969c\u7684\u5bb9\u9519\u6027\u3002\nChaosblade\u662f\u5efa\u7acb\u5728\u963f\u91cc\u5df4\u5df4\u8fd1\u5341\u5e74\u6545\u969c\u6d4b\u8bd5\u548c\u6f14\u7ec3\u5b9e\u8df5\u57fa\u7840\u4e0a\uff0c\u7ed3\u5408\u4e86\u96c6\u56e2\u5404\u4e1a\u52a1\u7684\u6700\u4f73\u521b\u610f\u548c\u5b9e\u8df5\u3002\n\u76ee\u524d\u652f\u6301\u7684\u6f14\u7ec3\u573a\u666f\u6709\u64cd\u4f5c\u7cfb\u7edf\u7c7b\u7684 CPU\u3001\u78c1\u76d8\u3001\u8fdb\u7a0b\u3001\u7f51\u7edc\uff0cJava \u5e94\u7528\u7c7b\u7684 Dubbo\u3001MySQL\u3001Servlet \u548c\u81ea\u5b9a\u4e49\u7c7b\u65b9\u6cd5\u5ef6\u8fdf\u6216\u629b\u5f02\u5e38\u7b49\u4ee5\u53ca\u6740\u5bb9\u5668\u3001\u6740 Pod\uff0c\u5177\u4f53\u53ef\u6267\u884c blade create -h \u67e5\u770b\u3002\n\u597d\u4e86\uff0c\u4e0a\u9762\u7684\u4ecb\u7ecd\u662f\u4eceChaosblade\u7684github\u4e3b\u9875\u6284\u7684\u3002\ngithub\u4e3b\u9875\u5730\u5740\uff1a",(0,a.kt)("a",{parentName:"p",href:"https://github.com/chaosblade-io/chaosblade"},"chaosblade-github"),"\n\u8bf4\u767d\u4e86\uff0cChaosblade\u662f\u4e00\u4e2a\u6545\u969c\u6a21\u62df\u5de5\u5177\uff0c\u53ef\u4ee5\u6a21\u62df\u6bd4\u5982\u670d\u52a1\u5668CPU\u6ee1\u4e86\u3001\u78c1\u76d8\u6ee1\u4e86\u3001\u7f51\u7edc\u6162\u3001Dubbo\u67d0\u4e2a\u670d\u52a1\u54cd\u5e94\u65f6\u95f4\u957f\u3001jvm\u4e2d\u67d0\u4e2a\u65b9\u6cd5\u629b\u51fa\u5f02\u5e38\u3001\u8c03\u7528Mysql\u6162\u7b49\u7b49\u3002\u6240\u4ee5\u8fd9\u4e2a\u5de5\u5177\u5bf9\u4e8e\u5927\u516c\u53f8\u6765\u8bf4\u662f\u975e\u5e38\u975e\u5e38\u6709\u7528\u7684\uff0c\u56e0\u4e3a\u53ef\u4ee5\u63d0\u524d\u6a21\u62df\u51fa\u5404\u79cd\u5404\u6837\u7684\u6545\u969c\uff0c\u4ece\u800c\u4fdd\u8bc1\u7cfb\u7edf\u7684\u9ad8\u53ef\u7528\u4e0e\u7a33\u5b9a\u3002"))}p.isMDXComponent=!0}}]);