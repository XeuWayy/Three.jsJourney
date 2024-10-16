uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

#include includes/rotate2D.glsl

void main() {

    vec3 newPostion = position;

    // Twist
    float value = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r;
    float angle = value * 10.0;
    newPostion.xz = rotate2D(newPostion.xz, angle);

    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 3.0) * 10.0;
    newPostion.xz += windOffset;

    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPostion, 1.0);

    // Varying
    vUv = uv;
}