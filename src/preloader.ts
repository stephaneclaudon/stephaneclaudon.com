import jsonData from "./assets/data/data.json";
import Global from "./Global";
// import * as ModernizrObject from "modernizr";

let GlobalInstance = new Global();
GlobalInstance.setMediaPath();
GlobalInstance.setViewportSize();

//@ts-ignore
var preloader = new createjs.LoadQueue(),
  $loaderScreen: HTMLElement = document.getElementById('loader')!,
  $state: HTMLElement = document.getElementById('loader-state')!,
  $progressbar: HTMLElement = document.getElementById('progressbar')!,
  $progressbarContainer: HTMLElement = document.getElementById('progressbar-container')!;

var myAssets: Array<string> = [];
// let videoFileName: string = "loops/all-projects-";
// videoFileName += (GlobalInstance.getViewportWidth() > 1024) ? "desktop-3600" : "mobile-640";
// videoFileName += (ModernizrObject.video.webm) ? ".webm" : ".mp4";
// myAssets.push(process.mediaPath + videoFileName);

myAssets.push(process.mediaPath + "fonts/icomoon.eot?juz7kf");
myAssets.push(process.mediaPath + "fonts/icomoon.eot?juz7kf#iefix");
myAssets.push(process.mediaPath + "fonts/icomoon.ttf?juz7kf");
myAssets.push(process.mediaPath + "fonts/icomoon.woff?juz7kf");
myAssets.push(process.mediaPath + "fonts/icomoon.svg?juz7kf#icomoon");

for (let index = 0; index < jsonData.projects.length; index++) {
  myAssets.push(process.mediaPath + "img/" + jsonData.projects[index].id + "@3x.jpg");
}

myAssets.push("/dist/main.js");

preloader.on("progress", onProgressPreloader);
preloader.on("complete", onCompletePreloader);
preloader.loadManifest(myAssets);

function onProgressPreloader(e: any) {
  var perc = Math.round(e.progress * 100);
  var scalePerc = 1 + (perc*0.01*0.25);
  $state.innerHTML = perc + "";
  $progressbar.setAttribute("width", perc + "%");
  $progressbarContainer.setAttribute("style", "-webkit-transform: scale(" + scalePerc + "); -ms-transform: scale(" + scalePerc + "); transform: scale(" + scalePerc + ");");
}

function onCompletePreloader(e: any) {
  console.log("onCompletePreloader");
}
//@ts-ignore
window.onAppMounted = function() {
  console.log("onAppMounted");
  $loaderScreen.className = $loaderScreen.className + " hidden"; 
}