export class FeatureNotFoundError extends Error {
    constructor(id: string) {
        super(`Feature ${id} not found`)
    }
}
