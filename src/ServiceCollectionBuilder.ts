import { DepGraph } from 'dependency-graph';
import { isNil } from 'lodash';
import { ServiceCollection } from './ServiceCollection';
import { PrebuiltServiceRegistration } from './Types/PrebuiltServiceRegistration';
import { ServiceRegistration } from './Types/ServiceRegistration';

export class ServiceCollectionBuilder {
    private readonly _registraions: ServiceRegistration<any>[];
    private readonly _instances: Map<string, any>;

    constructor() {
        this._registraions = [];
        this._instances = new Map();
    }

    public addConstant<T>(id: string, constant: T): ServiceCollectionBuilder {
        this._registraions.push({ 
            id,
            value: constant,
            constructor: undefined,
            depIds: [],
        });

        return this;
    }

    public addPure<T>(id: string, service: new() => T): ServiceCollectionBuilder {
        this._registraions.push({ 
            id,
            constructor: service,
            depIds: [],
        });

        return this;
    }

    public add<T>(id: string, service: new(dep: any) => T, depIds: string[]): ServiceCollectionBuilder {
        this._registraions.push({ 
            id,
            constructor: service,
            depIds,
        });

        return this;
    }

    public build(): ServiceCollection {
        const graph = new DepGraph<PrebuiltServiceRegistration>();
        
        this._registraions.forEach(registration => {
            const id = registration.id;

            const prebuiltServiceRegistration: PrebuiltServiceRegistration  = {
                id: registration.id,
                depIds: registration.depIds,
                createServiceInstance: () => this.getServiceInstance(registration),
            };

            if (graph.hasNode(id)) {
                graph.removeNode(id);
            }

            graph.addNode(id, prebuiltServiceRegistration);
        });

        this._registraions.forEach(registration => 
            registration.depIds.forEach(depId => graph.addDependency(registration.id, depId))
        );

        const buildOrder = graph.overallOrder();

        buildOrder.forEach(id => {
            const prebuiltRegistration = graph.getNodeData(id);

            prebuiltRegistration.createServiceInstance();
        });

        return new ServiceCollection(this._instances);
    }

    private getServiceInstance(registration: ServiceRegistration<any>): any {
        const depsInstances = registration.depIds
            .reduce<any>(
                (result, depId) => {
                    result[depId] = this._instances.get(depId)
                    
                    return result;
                }, 
                {}
            );
        
        const instance = isNil(registration.constructor)
            ? registration.value
            : new registration.constructor(depsInstances);
        this._instances.set(registration.id, instance);

        return instance;
    }
}