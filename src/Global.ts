export default class Global {
  setMediaPath(): void {
    if(!process.mediaPath) {
      if (process.env.NODE_ENV === 'development') {
        process.mediaPath = '/dist/assets/';
      } else {
        process.mediaPath = '/v1/dist/assets/';
      }
    }
  }

  setViewportSize(): void {
    window.addEventListener('resize', Global.storeViewportSize);
    Global.storeViewportSize();
  }

  public static storeViewportSize(): void {
    console.log("storeViewportSize");
    var w=window,
    d=document,
    e=d.documentElement!,
    g=d.getElementsByTagName('body')[0],
    x=w.innerWidth||e.clientWidth||g.clientWidth,
    y=w.innerHeight||e.clientHeight||g.clientHeight;
    process.viewportSize = {width: x, height: y};
  }

  getViewportWidth() : number {
    return process.viewportSize.width;
  }

  getViewportHeight() : number {
    return process.viewportSize.height;
  }
}