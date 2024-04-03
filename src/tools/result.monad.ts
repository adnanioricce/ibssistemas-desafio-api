type Ok<T> = {
    success: true;
    value: T;
};

type Fail<E> = {
    success: false;
    error: E;
};

type Result<T, E> = 
| Ok<T> 
| Fail<E>;

export class ResultMonad<T, E> {
    constructor(private result: Result<T, E>) {}

    static success<T, E>(value: T): ResultMonad<T, E> {
        return new ResultMonad<T, E>({ success: true, value });
    }

    static failure<T, E>(error: E): ResultMonad<T, E> {
        return new ResultMonad<T, E>({ success: false, error });
    }

    isSuccess(): boolean {
        return this.result.success;
    }

    isFailure(): boolean {
        return !this.isSuccess();
    }

    public get value(): T | undefined {
        return this.result.success ? this.result.value : undefined;
    }

    public get error(): E | undefined {                
        switch (this.result.success) {
            case true:
                return undefined;
            case false:
                return this.result.error
        }        
    }

    map<U>(fn: (value: T) => U): ResultMonad<U, E> {
        if (this.isSuccess()) {
            return ResultMonad.success(fn(this.value));
        } else {
            return ResultMonad.failure(this.error);
        }
    }
    
    flatMap<U>(fn: (value: T) => ResultMonad<U, E>): ResultMonad<U, E> {        
        switch (this.result.success) {
            case true:
                return fn(this.result.value);        
            case false:
                return ResultMonad.failure(this.result.error)
        }
    }
}
  