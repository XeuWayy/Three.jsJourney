uniform vec3 uDeptColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying float vElevation;

void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDeptColor, uSurfaceColor, mixStrength);

    float fogFactor = smoothstep(uFogNear, uFogFar, gl_FragCoord.z / gl_FragCoord.w);

    vec3 finalColor = mix(color, uFogColor, fogFactor);

    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
}
