import { hello, utils } from "../module1";

export const hello2 = () => {
  return `Hello from module B, which also says: ${hello()}`;
};

export const module1Utils = utils;

export { displayBookInfo } from "./book";
