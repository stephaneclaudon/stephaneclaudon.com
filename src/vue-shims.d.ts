declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module "*.json" {
    const value: any;
    export default value;
}

declare var process: {
    env: {
      NODE_ENV: string
    },
    distPath: string,
    mediaPath: string,
    viewportSize: any,
    originalHistoryLength: number
}
