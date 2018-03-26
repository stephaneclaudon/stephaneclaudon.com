export default class VideoSnapshooter {
    private static instance: VideoSnapshooter;

    canvasElement: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;

    private constructor() {
        // do something construct...
    }

    static getInstance() {
        if (!VideoSnapshooter.instance) {
            VideoSnapshooter.instance = new VideoSnapshooter();
            // ... any one time initialization goes here ...
        }
        return VideoSnapshooter.instance;
    }

    init(): void {
        this.canvasElement = document.createElement("canvas");
        this.canvasContext = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
    }

    takeSnapshot(videoElement: HTMLVideoElement): string {
        this.canvasElement.width = videoElement.videoWidth;
        this.canvasElement.height = videoElement.videoHeight;
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasContext!.drawImage(
          videoElement,
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height
        );
        console.log('snaaap');
        return this.canvasElement.toDataURL(/*'image/jpeg', 0.5*/);
    }

}