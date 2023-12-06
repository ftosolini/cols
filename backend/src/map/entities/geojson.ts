export class FeatureCollection {
    type: 'FeatureCollection'
    features: Feature[]

    constructor(features: Feature[]) {
        this.type = 'FeatureCollection'
        this.features = features
    }
}

export interface Feature {
    type: 'Feature'
    geometry: Point
    /** eslint-disable @typescript-eslint/no-explicit-any */
    properties: any
}

export interface Point {
    type: 'Point'
    coordinates: number[]
}
