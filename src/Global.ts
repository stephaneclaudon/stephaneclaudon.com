export default class Global {
  setMediaPath(): void {
    if(!process.mediaPath) {
      if (process.env.NODE_ENV === 'development') {
        process.mediaPath = '/dist/assets/';
        process.distPath = '/dist/';
      } else {
        process.mediaPath = 'https://s3.eu-west-3.amazonaws.com/stephaneclaudon/dist/assets/';
        process.distPath = 'https://s3.eu-west-3.amazonaws.com/stephaneclaudon/dist/';
      }
    }
  }

  setViewportSize(): void {
    window.addEventListener('resize', Global.storeViewportSize);
    Global.storeViewportSize();
  }

  public static storeViewportSize(): void {
    var w=window,
    d=document,
    e=d.documentElement!,
    g=d.getElementsByTagName('body')[0],
    x=w.innerWidth||e.clientWidth||g.clientWidth,
    y=w.innerHeight||e.clientHeight||g.clientHeight;
    process.viewportSize = {width: x, height: y};

    console.log("storeViewportSize", process.viewportSize);
  }

  getViewportWidth() : number {
    return process.viewportSize.width;
  }

  getViewportHeight() : number {
    return process.viewportSize.height;
  }
}