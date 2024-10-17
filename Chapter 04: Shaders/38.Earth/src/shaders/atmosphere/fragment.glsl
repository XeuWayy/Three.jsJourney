uniform vec3 uSunDirection;
uniform float uCloudsFactor;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereNightColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    // Sun orientation
    float sunOrientation = dot(uSunDirection, normal);

    // Atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereNightColor, uAtmosphereDayColor, atmosphereDayMix);
    color += atmosphereColor;

    // Edge Alpha
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);

    // Day Alpha
    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);

    // Final Alpha
    float finalAlpha = edgeAlpha * dayAlpha;

    // Final color
    gl_FragColor = vec4(color, finalAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}