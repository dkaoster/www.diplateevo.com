import{r as s}from"./index.594f22b9.js";const r=["en","zh"],l="en",t=e=>{if(typeof e!="string")return null;const o=e.split("-")[0].toLowerCase();return r.indexOf(o)>=0?o:null},u=s(null,e=>{const o=c=>{const a=t(c)||l;typeof localStorage=="object"&&(localStorage.locale=a),e({locale:a,setLocale:o})},n=typeof localStorage=="object"&&localStorage.locale,g=typeof window=="object"&&(window.navigator.language||window.navigator.languages.find(t));o(n||g||l)}),p={en:{home:"Home",page:"Page <>",languageToggle:"Read in English"},zh:{home:"首頁",page:"第<>頁",languageToggle:"用中文閱讀"}};export{l as d,p as i,u as l};