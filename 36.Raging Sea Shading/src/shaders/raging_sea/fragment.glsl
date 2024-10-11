uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uLightningIntensity;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // Base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    // Light
    vec3 light = vec3(0.0);
    light += directionalLight(
    vec3(1.0),              // Light color
    1.0,                    // Light intensity
    normal,                 // Normal
    vec3(-1.0, 0.5, 0.0),   // Light Position
    viewDirection,          // View direction
    30.0);                  // Specular power
    light += pointLight(
    vec3(1.0),            // Light color
    5.0,                 // Light intensity,
    normal,               // Normal
    vec3(0.0, 0.25, 0.0), // Light position
    viewDirection,        // View direction
    30.0,                 // Specular power
    vPosition,            // Position
    0.25                  // Decay
    );

    color *= light;

    // Fog
    float fogFactor = smoothstep(uFogNear, uFogFar, gl_FragCoord.z / gl_FragCoord.w);
    color += uLightningIntensity * vec3(1.0, 1.0, 1.0);

    // Final color
    vec3 finalColor = mix(color, uFogColor, fogFactor);
    float alpha = 1.0 - fogFactor;
    gl_FragColor = vec4(finalColor, alpha);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}
