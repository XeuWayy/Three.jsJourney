uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform vec3 uShadowColor;
uniform float uLightRepetitions;
uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl
#include ../includes/halftone.glsl

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Light
    vec3 light = vec3(0.0);
    light += ambientLight(
    vec3(1.0),  // Light color
    1.0         // Light intensity
    );
    light += directionalLight(
    vec3(1.0),              // Light color
    1.0,                    // Light intensity
    normal,                 // Normal
    vec3(1.0, 1.0, 0.0),    // Light position
    viewDirection,          // View Direction
    1.0);                   // Specular power
    color *= light;

    // Halftone
    color = halfTone(color, uShadowRepetitions, vec3(0.0, -1.0, 0.0), -0.8, 1.5, uShadowColor, normal);
    color = halfTone(color, uLightRepetitions, vec3(1.0, 1.0, 0.0), 0.5, 1.5, uLightColor, normal);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}