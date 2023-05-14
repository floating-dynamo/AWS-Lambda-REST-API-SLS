import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Todo } from "./interface";
import { todos } from "./mock";

// GET All Todos
export const getTodos: APIGatewayProxyHandler = async (
  event: any,
  _context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      todos,
      totalNumberOfTodos: todos.length,
    }),
  };
};

// GET Todo By Id
export const getTodoById: APIGatewayProxyHandler = async (
  event: any,
  _context
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const { todoId } = event.pathParameters;

  if (!todoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "The Todo does not exist for the given ID!",
      }),
    };
  }

  if (typeof parseInt(todoId) === "number") {
    const id: number = parseInt(todoId);
    const todo: Todo = todos.find((todo) => todo.id === id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        todo,
      }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Could not parse the Todo Id",
    }),
  };
};

// CREATE a Todo
export const createTodo: APIGatewayProxyHandler = (
  event: any,
  _context
): Promise<APIGatewayProxyResult> => {
  const { id, title, body } = event.pathParameters;
  if (typeof parseInt(id) === "number") {
    const todo: Todo = {
      id: parseInt(id),
      title,
      body,
    };
    todos.push(todo);

    return new Promise<APIGatewayProxyResult>((resolve, _reject) => {
      const response: APIGatewayProxyResult = {
        statusCode: 201,
        body: JSON.stringify({
          message: "Todo created successfully!",
          todos,
          totalNumberOfTodos: todos.length,
        }),
      };

      resolve(response);
    });
  }

  return new Promise<APIGatewayProxyResult>((_resolve, reject) => {
    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify({
        message: "Could not parse the Todo Id, try another one",
      }),
    };

    reject(response);
  });
};

// DELETE a Todo
export const deleteTodo: APIGatewayProxyHandler = (
  event: any,
  _context
): Promise<APIGatewayProxyResult> => {
  const { todoId } = event.pathParameters;
  const id: number = parseInt(todoId);
  const todo: Todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return new Promise((_resolve, reject) => {
      const response: APIGatewayProxyResult = {
        statusCode: 404,
        body: JSON.stringify({
          message: "The Todo does not exist for the given ID!",
        }),
      };
      reject(response);
    });
  }

  const newTodos: Todo[] = todos.filter((todo) => todo.id !== id);

  return new Promise<APIGatewayProxyResult>((resolve, _reject) => {
    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify({
        message: "Todo deleted successfully!",
        todos: newTodos,
        totalNumberOfTodos: todos.length,
      }),
    };

    resolve(response);
  });
};
