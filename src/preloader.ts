import jsonData from "./assets/data/data.json";

//@ts-ignore
var preloader = new createjs.LoadQueue(),
  $loaderScreen: HTMLElement = document.getElementById('loader')!,
  $state: HTMLElement = document.getElementById('loader-state')!,
  $progressbar: HTMLElement = document.getElementById('progressbar')!;

var myAssets: Array<string> = [];
myAssets.push("/dist/assets/loops/all-projects-mobile-low.mp4");
myAssets.push("/dist/assets/fonts/icomoon.eot?juz7kf");
myAssets.push("/dist/assets/fonts/icomoon.eot?juz7kf#iefix");
myAssets.push("/dist/assets/fonts/icomoon.ttf?juz7kf");
myAssets.push("/dist/assets/fonts/icomoon.woff?juz7kf");
myAssets.push("/dist/assets/fonts/icomoon.svg?juz7kf#icomoon");

for (let index = 0; index < jsonData.length; index++) {
  myAssets.push("/dist/assets/img/" + jsonData[index].id + "@3x.jpg");
}

myAssets.push("/dist/main.js");

preloader.on("progress", onProgressPreloader);    // on progress listener  
preloader.on("complete", onCompletePreloader);    // on complete listener  
preloader.loadManifest(myAssets);


function onProgressPreloader(e: any) {
  var perc = Math.round(e.progress * 100);
  $state.innerHTML = perc + "";
  $progressbar.setAttribute("width", perc + "%");
  console.log(perc + '%');
}

function onCompletePreloader(e: any) {
  console.log("onCompletePreloader");
  $loaderScreen.className = $loaderScreen.className + " hidden"; 
}