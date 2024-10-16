uniform float uTime;
uniform float uSize;


attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin

    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Add randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPostion = viewMatrix * modelPosition;
    vec4 projectedPostion = projectionMatrix * viewPostion;

    gl_Position = projectedPostion;

    gl_PointSize = (uSize * aScale) * 1.0 / -viewPostion.z;


    // Varying
    vColor = color;
}