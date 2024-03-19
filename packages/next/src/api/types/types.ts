import Defaults from "./defaults";
import Patch from "./patch";
type Override<T, S, Z = undefined> = S extends
  | string
  | boolean
  | number
  | undefined
  ? S
  : T extends string | boolean | number | undefined
  ? S
  : (Omit<T, keyof S> & {
      [prop in Extract<keyof S, keyof T>]: Z extends undefined
        ? S[prop]
        : Override<T[prop], S[prop], undefined>;
    }) &
      Pick<S, Exclude<keyof S, keyof T>>;
type Types = Override<Defaults, Patch, boolean>;
export default Types;
