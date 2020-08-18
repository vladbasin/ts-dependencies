export class ServiceCollection {
    private readonly _instances: Map<string, any>;

    constructor(instances: Map<string, any>) {
        this._instances = instances;
    }

    public get<T>(id: string): T {
        return this._instances.get(id);
    }

    public getAll(): Map<string, any> {
        return this._instances;
    }
}