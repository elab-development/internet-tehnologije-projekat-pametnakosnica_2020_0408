export interface User {
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
  }

export interface Beehive {
    id: string;
    device: string;
    displayname: string;
    date?: string,
    temperature?: string,
    humidity?: string,
    air_pressure?: string,
    weight?: string,
    food_remaining?: string
  }

  export interface Apiary {
    id: string;
    name: string;
    location: string;
  }