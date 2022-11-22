precision highp float;

// matrices
uniform mat4 uViewMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

// point lights
uniform int uPointLightCount;
uniform vec3 uPointLightLocation[8];
uniform vec3 uPointLightColor[8];

// material properties
uniform vec3 uAmbientColor;
uniform vec4 uMaterialColor;
uniform vec3 uSpecularColor;

uniform sampler2D uSampler;
uniform bool isTexture;


varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;

const float specularPower = 1.0;
const float diffuseFactor = 1.0;

vec3 V;
vec3 N;

struct LightResult {
	float specular;
	float diffuse;
};

float phongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  vec3 R = normalize(reflect(-lightDirection, surfaceNormal));  
  return pow(max(0.0, dot(R, viewDirection)), shininess);
}

float lambertDiffuse(
  vec3 lightDirection,
  vec3 surfaceNormal) {
  return max(0.0, dot(-lightDirection, surfaceNormal));
}

LightResult light(vec3 lightVector, float uSpecularPower) {

  vec3 L = normalize(lightVector);

  //compute our diffuse & specular terms
  LightResult lr;
  lr.specular = phongSpecular(L, V, N, specularPower);
  lr.diffuse = lambertDiffuse(L, N);
  return lr;
}

void sumLights(inout vec3 totalDiffuseLight, inout vec3 totalSpecularLight, vec4 viewModelPosition, float specularPower) {

  for (int k = 0; k < 8; k++) {
    if (uPointLightCount == k) break;

    vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[k], 1.0)).xyz;
    vec3 lightVector = viewModelPosition.xyz - lightPosition;

    LightResult result = light(lightVector, specularPower);
    totalDiffuseLight += result.diffuse  * uPointLightColor[k];
    totalSpecularLight += result.specular;
  }
}



void main() {


  V = normalize(vViewPosition);
  N = vNormal;

  vec3 totalDiffuseLight = vec3(0.0);
  vec3 totalSpecularLight = vec3(0.0);

  sumLights(totalDiffuseLight, totalSpecularLight, vec4(vViewPosition, 1.0), 1.0);

  vec4 diffuseColor = vec4(0.2,0.5,1.0,1.0);
  gl_FragColor = vec4(totalDiffuseLight, 1) * diffuseColor + 
                 vec4(totalSpecularLight * uSpecularColor, 0);  

  gl_FragColor.a = 1.0;

}