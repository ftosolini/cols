export type GeoJson<T> = {
    type: 'FeatureCollection'
    features: Feature<T>[]
}

export type Feature<T> = {
    type: 'Feature'
    geometry: {
        type: 'Point'
        coordinates: number[]
    }
    properties: T
}
