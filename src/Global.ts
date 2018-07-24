export default class Global {
  setMediaPath(): void {
    if(!process.mediaPath) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Looks like we are in development mode!');
        process.mediaPath = '/dist/assets/';
      } else {
        process.mediaPath = 'http://d1ukd4l0fsog5x.cloudfront.net/';
      }
    }
  }
}