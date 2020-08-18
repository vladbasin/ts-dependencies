import { ServiceCollectionBuilder } from '../ServiceCollectionBuilder';

export interface ModuleContract {
    register(builder: ServiceCollectionBuilder): ServiceCollectionBuilder;
}