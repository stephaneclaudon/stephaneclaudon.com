export default class VideoSnapshooter {
    private static instance: VideoSnapshooter;
    private snapshotTechnique: string = 'dataurl';

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
        this.canvasElement.setAttribute("id", "snapshot");
        //document.body.appendChild(this.canvasElement);
        this.canvasContext = this.canvasElement.getContext("2d", {
            antialias: false,
            depth: false,
            alpha: false
          }) as CanvasRenderingContext2D;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvasElement;
    }

    /*takeSnapshot(videoElement: HTMLVideoElement, callBack: (blobUrl: string) => void) {
        
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

        if(this.snapshotTechnique === 'blob'){
            this.canvasElement.toBlob((blob: Blob | null) => {
                callBack(URL.createObjectURL(blob));
            }, 'image/jpeg', 0.3);
        } else {
            callBack(this.canvasElement.toDataURL('image/jpeg', 0.1))
        }
    }*/

    takeSnapshot(videoElement: HTMLVideoElement): HTMLCanvasElement {
        
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
        return this.canvasElement;
    }

}