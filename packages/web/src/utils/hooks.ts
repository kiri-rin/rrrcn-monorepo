import {
  DependencyList,
  EffectCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
export const useEventSource = (url: string, deps: any[]) => {
  const [message, setMessage] = useState({ message: "", id: "" });
  useEffect(() => {
    const source = new EventSource(url);
    const messageListener = (ev: MessageEvent) => {
      console.log(ev);
      setMessage({ message: ev.data, id: ev.lastEventId });
    };
    const errorListener = (e: Event) => {
      console.log(e, "ERROR");
      source.close();
    };

    source.addEventListener("message", messageListener);
    source.addEventListener("error", errorListener, false);
    return () => {
      source.removeEventListener("message", messageListener);
      source.removeEventListener("error", errorListener);
    };
  }, deps);
  return message;
};
