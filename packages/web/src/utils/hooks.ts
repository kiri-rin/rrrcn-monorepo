import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export const useEffectNoOnMount = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const mountRef = useRef<boolean>(false);
  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
    } else {
      return effect();
    }
  }, deps);
};
