uniform vec3 uDeptColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

uniform float uLightningIntensity;

varying float vElevation;

void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDeptColor, uSurfaceColor, mixStrength);

    float fogFactor = smoothstep(uFogNear, uFogFar, gl_FragCoord.z / gl_FragCoord.w);

    color += uLightningIntensity * vec3(1.0, 1.0, 1.0);

    vec3 finalColor = mix(color, uFogColor, fogFactor);
    float alpha = 1.0 - fogFactor;

    gl_FragColor = vec4(finalColor, alpha);

    #include <colorspace_fragment>
}
