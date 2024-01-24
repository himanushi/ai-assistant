import { todoFunctionNames, todoTool } from "./todoTool";

export const functionCaller = (name: string, args: object) => {
  if (todoFunctionNames.includes(name)) {
    return todoTool(name, args);
  }

  return "ツールが選択されませんでした";
};
