export interface TPet {
  deletedAt: Date | null;
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: boolean;
  isPetDelete: boolean;
  careGiverNotes: string;
  spayedOrNeutered: boolean;
  profileImage: string;
  vetName: string;
  phone: string;
  Website: string;
  petTypesId: number;
  usersId: string;
  petWeightsId: number;
  petWeights?: TPetWeight;
  petVaccinations?: TPetVaccination[];
  petTypes?: TPetType;
}

export interface TPetType {
  deletedAt: Date | null;
  id: number;
  type: string;
  image: string;
  display: string;
  order: 0;
  usersId: string;
}

export interface TPetWeight {
  deletedAt: Date | null;
  id: number;
  weightRange: string;
  image: string;
  weightType: string;
  order: number;
}

export interface TPetVaccination {
  vaccineName: string;
  vaccinatedAt: Date;
  nextDueDate: Date;
}
