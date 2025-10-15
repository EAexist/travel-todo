import { NavigationContainerRef } from '@react-navigation/native'
import { useLogger } from '@react-navigation/devtools'
import React, { RefObject } from 'react'

/**
 * 개발 모드(__DEV__)에서만 React Navigation 로거를 활성화하는 커스텀 훅입니다.
 * 훅 규칙을 준수하기 위해 조건 없이 호출됩니다.
 *
 * @param ref NavigationContainer의 참조(Ref)
 */
export const useDevLogger = (
  ref: RefObject<NavigationContainerRef<any> | null>,
) => {
  // 💡 훅 호출 자체는 조건 없이 최상위에서 이루어져야 합니다.
  //   - 이 훅은 항상 호출되지만, 내부의 useLogger는 __DEV__ 조건부로 실행됩니다.

  if (__DEV__) {
    // 💡 __DEV__가 true일 때만 useLogger를 호출합니다.
    //    이 방법은 React 훅 규칙을 위반하지 않습니다.
    //    왜냐하면 이 조건부 훅 호출이 항상 동일한 조건(빌드 환경)을 유지하기 때문입니다.
    //    *중요:* __DEV__는 런타임에 변경되지 않는 상수이며, 번들링 시점에 결정됩니다.
    //    따라서 렌더링마다 훅의 개수가 변경되는 상황을 방지합니다.
    useLogger(ref)
  }
}
