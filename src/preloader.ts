import jsonData from "./assets/data/data.json";

//@ts-ignore
var preloader = new createjs.LoadQueue(),
  $state: HTMLElement = document.getElementById('state')!,
  $progress: HTMLElement = document.getElementById('progress')!,
  $progressbar: HTMLElement = document.getElementById('progressbar')!;

var myAssets: Array<string> = [];
myAssets.push("/dist/assets/loops/all-projects-mobile-low.mp4");
for (let index = 0; index < jsonData.length; index++) {
  myAssets.push("/dist/assets/img/" + jsonData[index].id + "@3x.jpg");
}

myAssets.push("/dist/main.js");

preloader.on("progress", onProgressPreloader);    // on progress listener  
preloader.on("complete", onCompletePreloader);    // on complete listener  
preloader.loadManifest(myAssets);


function onProgressPreloader(e: any) {
  var perc = Math.round(e.progress * 100);
  $state.innerHTML = perc + '%';
  console.log(perc + '%');
}

function onCompletePreloader(e: any) {
  console.log("onCompletePreloader");

}