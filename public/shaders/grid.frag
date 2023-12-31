#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // This is passed in as a uniform from the sketch.js file
uniform float u_gridSize; // This is passed in as a uniform from the sketch.js file
uniform float u_dotSize; // This is passed in as a uniform from the sketch.js file
uniform float u_dotOpacity; // This is passed in as a uniform from the sketch.js file
uniform vec2 u_offset;
uniform float u_scale;

void main() {
    vec2 offset = vec2(-u_offset.x, u_offset.y);
    vec2 st = mod((gl_FragCoord.xy + offset)*u_scale, u_gridSize);
    st /= u_gridSize;
    float radius = distance(st, vec2(0.5));
    radius = 1.0 - smoothstep(.0, u_dotSize, radius);

    gl_FragColor = vec4(0, 0, 0, radius * u_dotOpacity); // R,G,B,A
}