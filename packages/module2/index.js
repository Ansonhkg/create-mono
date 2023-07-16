import { hello, utils } from "../module1";

console.log("utils:", utils);

export const hello2 = () => {
  return `Hello from module B, which also says: ${hello()}`;
};

export const proxy = utils;
