import React from "react";
import { useFrame, extend, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./styles.css";

extend({ OrbitControls });

export const CameraControls = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controls = React.useRef();
  useFrame((state) => controls.current.update());

  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      maxAzimuthAngle={Math.PI / 4}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Math.PI / 4}
      minPolarAngle={0}
    />
  );
};
