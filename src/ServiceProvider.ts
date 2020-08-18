import { ModuleContract } from './Contracts/ModuleContract';
import { ServiceCollection } from './ServiceCollection';
import { ServiceCollectionBuilder } from './ServiceCollectionBuilder';
import { ServiceProviderContract } from './Contracts/ServiceProviderContract';

export class ServiceProvider implements ServiceProviderContract {
    private readonly _builder: ServiceCollectionBuilder;
    private readonly _services: ServiceCollection;
    private readonly _idAsPropServicesRepresentor: any;

    constructor(modules: ModuleContract[]) {
        this._builder = new ServiceCollectionBuilder();

        this._services = this.registerServices(modules);
        this._idAsPropServicesRepresentor = Array.from(this._services.getAll().entries())
            .reduce<any>((result, [id, value]) => {
                result[id] = value;
                return result;
            }, {});
    }

    public provide<T>(id: string): T {
        return this._services.get(id);
    }

    public provideTyped<T>(): T {
        return this._idAsPropServicesRepresentor;
    }

    private registerServices(modules: ModuleContract[]): ServiceCollection {
        modules.forEach(module => module.register(this._builder));

        return this._builder.build();
    }
}