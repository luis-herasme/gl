export function getContext(canvasId: string = 'game'): WebGL2RenderingContext {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('Game canvas not found #game');
    }

    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL context not found');
    return gl;
}
