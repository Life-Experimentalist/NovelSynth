// Add Chrome types to fix TypeScript errors
declare namespace chrome {
  export namespace runtime {
    export function sendMessage(
      message: any,
      callback: (response: any) => void
    ): void;
    export const lastError: { message: string } | undefined;
  }
}
