export type PrebuiltServiceRegistration = {
    id: string,
    depIds: string[],
    createServiceInstance: () => any,
}