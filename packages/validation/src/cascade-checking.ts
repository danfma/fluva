export enum CascadeChecking {
  /**
   * Execute the next checker even if the current checker found an error.
   */
  Cascade,

  /**
   * Stops the checking on first error found.
   */
  StopOnFirstError
}
