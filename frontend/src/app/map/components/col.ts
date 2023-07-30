export type Col = {
  name: string,
  altitude: number,
  climbs: Climb[]
}
export type Climb = {
    done: boolean,
    start: string,
    length: number,
    moyen: number,
    max: number,
    profil: string,
    category: number
}
