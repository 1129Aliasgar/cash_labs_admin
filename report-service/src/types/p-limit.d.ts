declare module 'p-limit' {
  interface Limit {
    <T>(fn: () => Promise<T>): Promise<T>;
  }
  function pLimit(concurrency: number): Limit;
  export default pLimit;
}
