export interface ServiceProviderContract {
    provide<T>(id: string): T;
    provideTyped<T>(): T;
}