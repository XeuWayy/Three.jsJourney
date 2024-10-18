uniform sampler2D uPictureTexture;

varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = distance(uv, vec2(0.5));

    /* Bruno ways but i don't like the performance hit that it can have on lower end hardware..
    if(distanceToCenter > 0.5) {
        discard;
    }
    */
    float alpha = 1.0 - smoothstep(0.45, 0.5, distanceToCenter);

    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}