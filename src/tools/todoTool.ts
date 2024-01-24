import { signal } from "@preact/signals";

const addTodoName = "add_todo";
const deleteTodoName = "delete_todo";
const listTodoName = "list_todo";

export const todoSchemas = () => {
  return [
    {
      type: "function",
      function: {
        name: addTodoName,
        description: "todo を追加します",
        parameters: {
          type: "object",
          properties: {
            todo: {
              type: "string",
              description: "todo の内容",
            },
          },
          required: ["todo"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: deleteTodoName,
        description: "todo を削除します",
        parameters: {
          type: "object",
          properties: {
            todo: {
              type: "string",
              description: "todo の内容",
              enum: todoList.value,
            },
          },
          required: ["todo"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: listTodoName,
        description: "「TODO」または「やることリスト」 一覧を取得します",
      },
    },
  ];
};

export const todoFunctionNames = [addTodoName, deleteTodoName, listTodoName];

const todoList = signal<string[]>([]);

export const todoTool = (name: string, args: any) => {
  if (name === addTodoName) {
    todoList.value = [...todoList.value, args.todo].filter((t) => t);
    updateTodoList();
    return `やることリストに ${args.todo} を追加しました`;
  }
  if (name === deleteTodoName) {
    todoList.value = todoList.value.filter((t) => t !== args.todo);
    updateTodoList();
    return `やることリストの「${args.todo}」を削除しました`;
  }
  if (name === listTodoName) {
    if (todoList.value.length === 0) {
      return "やることリストはありません";
    }
    return `${todoList.value.join("と")} があります`;
  }
  return "ツールが選択されませんでした";
};

const updateTodoList = () => {
  localStorage.setItem("todoList", JSON.stringify(todoList.value));
};

const loadTodoList = () => {
  const storedTodos = localStorage.getItem("todoList");
  if (storedTodos) {
    todoList.value = JSON.parse(storedTodos);
  }
};

loadTodoList();
