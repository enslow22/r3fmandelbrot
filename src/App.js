import React, { useRef } from "react";
import "./styles.css";
import { Canvas, useThree } from "react-three-fiber";

function Arc1(props) {
  // get size of window
  const { size } = useThree();
  const mesh = useRef();

  // init uniforms
  const uniformData = {
    iTime: {
      type: "f",
      value: 0
    },

    iIterations: {
      type: "f",
      value: 15
    },

    iZoom: {
      type: "f",
      value: 1
    },

    iCenter: {
      type: "v2",
      value: [0, 0]
    }
  };

  // controls
  function handleWheel(delta) {
    uniformData.iZoom.value -= delta * 0.0025;
  }
  function handleDrag(event) {
    if (event.pressure > 0) {
      uniformData.iCenter.value[0] -=
        event.movementX / 150 / Math.exp(uniformData.iZoom.value);
      uniformData.iCenter.value[1] +=
        event.movementY / 150 / Math.exp(uniformData.iZoom.value);
    }
  }

  // shaders
  // vertex shader is bare bones
  // fragment shader returns the mandelbrot set
  const v_shader = `
  varying vec3 pos;
  void main() {
    pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);
  }`;
  const f_shader = `
  #define SMOOTH float(i)-log2(log2(length(z))) + 4.0
  #define COLORFUN 0.5 + .5*(cos(3.145 + mix(float(i),SMOOTH,1.0)*vec3(0.000, 0.044, 0.050)*1.8+vec3(0.395, 0.089, 0.082)))
  varying vec3 pos;
  uniform float iZoom;
  uniform vec2 iCenter;

  vec2 cmul(vec2 z, vec2 c){
    return vec2(z.x*c.x -z.y*c.y, z.y*c.x+z.x*c.y);
  }

  
  vec3 anon(in vec2 c){
    vec2 z;
    for (float i = 0.; i < 40. + max(0., 5.*iZoom*iZoom); i++){
      z = cmul(z, z) + c;
      if (length(z) > 4.){
        return vec3(COLORFUN);
      }
    }
    return vec3(0.);
  }

  // You can sppeed this up by only rendering the top half plane and then mirroring it across z.y = 0
  void main(){
    vec2 uv = (pos.xy-vec2(0.5, 0.)) / exp(iZoom) + iCenter;
    
    gl_FragColor = vec4(anon(uv), 1.0);
  }`;

  return (
    <mesh
      ref={mesh}
      onWheel={(e) => handleWheel(e.deltaY)}
      onPointerMove={(e) => handleDrag(e)}
    >
      <planeGeometry attach="geometry" args={[size.width, size.height]} />
      <shaderMaterial
        attach="material"
        args={[
          {
            vertexShader: v_shader,
            fragmentShader: f_shader,
            uniforms: uniformData
          }
        ]}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas dpr={[1, 2]}>
      <Arc1 />
    </Canvas>
  );
}
