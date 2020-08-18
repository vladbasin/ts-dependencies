import { Maybe } from "@vladbasin/ts-types";

export type ServiceRegistration<T> = {
    constructor: Maybe<new(dep: any) => T>,
    value?: T,
    depIds: string[],
    id: string,
}