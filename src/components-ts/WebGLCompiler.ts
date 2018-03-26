export default class WebGLCompiler {
    shaders: any = {};
    gl: WebGLRenderingContext;

    constructor(message: string) {
        console.log('new GL Compiler');
    }
    
    createProgramWithShaders (vertexShaderName: string, fragmentShaderName: string) {
      var vertexShader = this.createShader(vertexShaderName),
          fragmentShader = this.createShader(fragmentShaderName);
      return this.createProgram(vertexShader!, fragmentShader!);
    }

    createShader (shaderName: string) {
      var shaderSource = this.shaders[shaderName];
      if (!shaderSource) {
        throw "Shader not found";
      }
      return this.compileShader(shaderSource, this.typeForShader(shaderName));
    }

    typeForShader (name: string) {
      if (name.indexOf('vertex') != -1) {
        return this.gl.VERTEX_SHADER;
      } else if (name.indexOf('fragment') != -1) {
        return this.gl.FRAGMENT_SHADER;
      } else {
        throw "Unknown shader type";
      }
    }

    compileShader (shaderSource: string, shaderType: number) {
      let shader = this.gl.createShader(shaderType);
      this.gl.shaderSource(shader, shaderSource);
      this.gl.compileShader(shader);
      return shader;
    }

    createProgram (vertexShader: Object, fragmentShader: Object) {
      var program = this.gl.createProgram();
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);

      if ( !this.gl.getProgramParameter(program, this.gl.LINK_STATUS) ) {
        let error = this.gl.getProgramInfoLog(program);
        console.error(error);
        throw "Program failed to link. Error: #{error}";
      }

      return program;
    }
}