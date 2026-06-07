export type TodoId = string & {__brand: "TodoId"};

export function TodoId(value: string): TodoId {
    return value as TodoId;
}