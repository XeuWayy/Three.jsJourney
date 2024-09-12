/*
uniform vec3 uDeptColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDeptColor, uSurfaceColor, mixStrength);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}
*/

uniform vec3 uDeptColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying float vElevation;

void main() {
    // Couleur de base selon ton shader actuel
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDeptColor, uSurfaceColor, mixStrength);

    // Calcul du brouillard
    float fogFactor = smoothstep(uFogNear, uFogFar, gl_FragCoord.z / gl_FragCoord.w);

    // Mélange de la couleur finale avec la couleur du brouillard
    vec3 finalColor = mix(color, uFogColor, fogFactor);

    // Appliquer la couleur finale avec une opacité de 1.0
    gl_FragColor = vec4(finalColor, 1.0);

    #include <colorspace_fragment>
}
