window.__timelines = window.__timelines || {};
const tl = gsap.timeline({paused:true});
tl.fromTo('.one',{y:235},{y:0,duration:.85,ease:'power4.out'},.15)
  .fromTo('.two',{y:235},{y:0,duration:.95,ease:'power4.out'},.55)
  .fromTo('.underline',{scaleX:0},{scaleX:1,duration:.8,ease:'power3.inOut'},1.2)
  .fromTo('.opening-note',{opacity:0,y:35},{opacity:1,y:0,duration:.5},.25)
  .to('.opening',{opacity:0,y:-55,duration:.45,ease:'power2.in'},3.75);
for(const [selector,start,end] of [['.openai',4.2,11.7],['.anthropic',12.2,20.7]]) {
  tl.fromTo(selector,{opacity:0,y:55},{opacity:1,y:0,duration:.5,ease:'power3.out'},start);
  tl.fromTo(`${selector} .capital .bar`,{scaleX:0},{scaleX:1,duration:1.25,ease:'power3.inOut'},start+.4);
  tl.fromTo(`${selector} .revenue .bar`,{scaleX:0},{scaleX:1,duration:.85,ease:'power2.inOut'},start+1.1);
  tl.fromTo(`${selector} .capital strong`,{opacity:0,y:15},{opacity:1,y:0,duration:.5},start+.4);
  tl.fromTo(`${selector} .revenue strong`,{opacity:0,y:15},{opacity:1,y:0,duration:.5},start+1.1);
  tl.to(selector,{opacity:0,y:-45,duration:.45,ease:'power2.in'},end);
}
tl.fromTo('.ending',{opacity:0,y:70},{opacity:1,y:0,duration:.7,ease:'power3.out'},21.2);
tl.fromTo('.progress',{scaleX:0},{scaleX:1,duration:24,ease:'none'},0);
window.__timelines.main = tl;
