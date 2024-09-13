interface State {
  name: string;
  onEnter?: Function;
}

export class StateMachine {
  #states: Map<string, State>;
  #currentState?: State;
  #id: string;
  #context?: Object;
  #isChangingState: boolean;
  #changingStateQueue: string[];

  constructor(id: string, context?: Object) {
    this.#id = id;
    this.#context = context;
    this.#isChangingState = false;
    this.#changingStateQueue = [];
    this.#currentState = undefined;
    this.#states = new Map();
  }

  get currentStateName(): string | undefined {
    return this.#currentState?.name;
  }

  update() {
    if (this.#changingStateQueue.length > 0) {
      this.setState(this.#changingStateQueue.shift()!);
    }
  }

  setState(stateName: string) {
    const methodName = "setState";

    if (!this.#states.has(stateName)) {
      console.warn(
        `[${StateMachine.name}-${
          this.#id
        }:${methodName}] tried to change to unknown state: ${stateName}`
      );
      return;
    }

    if (this.#isCurrentState(stateName)) {
      this.#changingStateQueue.push(stateName);
      return;
    }

    if (this.#isChangingState) {
      this.#changingStateQueue.push(stateName);
      return;
    }

    this.#isChangingState = true;
    console.log(
      `[${StateMachine.name}-${this.#id}:${methodName}] change from ${
        this.#currentState?.name ?? "none"
      } to ${stateName}`
    );

    this.#currentState = this.#states.get(stateName);

    if (this.#currentState?.onEnter) {
      console.log(
        `[${StateMachine.name}-${this.#id}:${methodName}] ${
          this.#currentState?.name ?? "none"
        } on invoked`
      );

      this.#currentState.onEnter();
    }

    this.#isChangingState = false;
  }

  addState(state: State) {
    this.#states.set(state.name, {
      name: state.name,
      onEnter: this.#context
        ? state.onEnter?.bind(this.#context)
        : state.onEnter,
    });
  }

  #isCurrentState(stateName: string): boolean {
    if (!this.#currentState) {
      return false;
    }

    return this.#currentState.name === stateName;
  }
}
