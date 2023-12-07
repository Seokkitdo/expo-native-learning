import { useState, useEffect } from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";

type Orientation = "portrait" | "landscape";

function useDeviceOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  useEffect(() => {
    const subscription = DeviceMotion.addListener(
      (motionData: DeviceMotionMeasurement) => {
        const { accelerationIncludingGravity } = motionData;
        if (accelerationIncludingGravity) {
          const { x, y } = accelerationIncludingGravity;
          // x와 y의 절대값을 비교하여 가로 모드인지 세로 모드인지 판별합니다.
          setOrientation(Math.abs(x) > Math.abs(y) ? "landscape" : "portrait");
        }
      }
    );

    DeviceMotion.setUpdateInterval(1000); // 센서 데이터 갱신 주기를 1초로 설정합니다.

    return () => {
      subscription.remove(); // 컴포넌트가 언마운트될 때 리스너를 제거합니다.
    };
  }, []);

  return orientation;
}

export default useDeviceOrientation;

// import { useState, useEffect } from "react";
// import * as ScreenOrientation from "expo-screen-orientation";

// // Orientation 타입을 가져오거나 정의합니다.
// type OrientationType = ScreenOrientation.Orientation;

// function useDeviceOrientation(): OrientationType | null {
//   const [orientation, setOrientation] = useState<OrientationType | null>(null);

//   useEffect(() => {
//     let subscription: ScreenOrientation.Subscription;

//     async function updateOrientation() {
//       // 현재 방향을 가져옵니다.
//       const currentOrientation = await ScreenOrientation.getOrientationAsync();
//       setOrientation(currentOrientation);
//     }

//     updateOrientation();

//     // 방향 변경을 감지할 리스너를 추가합니다.
//     subscription = ScreenOrientation.addOrientationChangeListener(
//       ({ orientationInfo }) => {
//         setOrientation(orientationInfo.orientation);
//       }
//     );

//     // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   return orientation;
// }

// export default useDeviceOrientation;
