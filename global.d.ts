export {};

/**
 * Now declare things that go in the global namespace,
 * or augment existing declarations in the global namespace.
 */
declare global {

  interface Event<T = EventTarget> {
    target: T;
  }
  
  interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
  }
}


