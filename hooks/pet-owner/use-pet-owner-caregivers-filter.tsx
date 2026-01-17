import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface CaregiversFilter
  extends Record<
    string,
    string | string[] | number | number[] | null | undefined
  > {
  price?: number;
  radius?: number;
  starrating?: number;
  caregiverPreferenceIds?: number[];
  caregiverSkillIds?: number[];
  serviceTypeIds?: number[];
  petTypeIds?: number[];
  transportTypeIds?: number[];
  homeTypeIds?: number[];
}

export interface PetOwnerCaregiverFilterContextValues {
  filter: CaregiversFilter;
  setFilter: Dispatch<SetStateAction<CaregiversFilter>>;
}

export const PetOwnerCaregiverFilterContext =
  createContext<PetOwnerCaregiverFilterContextValues | null>(null);

export interface PetOwnerCaregiverFilterProviderProps {
  children: ReactNode;
  filter?: CaregiversFilter;
}

const PetOwnerCaregiverFilterProvider = ({
  children,
  filter: _filter,
}: PetOwnerCaregiverFilterProviderProps) => {
  const [filter, setFilter] = useState<CaregiversFilter>(_filter || {});

  return (
    <PetOwnerCaregiverFilterContext.Provider
      value={{
        filter,
        setFilter,
      }}
    >
      {children}
    </PetOwnerCaregiverFilterContext.Provider>
  );
};

export default PetOwnerCaregiverFilterProvider;

export const usePetOwnerCaregiverFilter = () => {
  const caregiver = useContext(PetOwnerCaregiverFilterContext);

  if (!caregiver) {
    throw new Error(
      "Cannot access usePetOwnerCaregiverFilter outside PetOwnerCaregiverFilterProvider"
    );
  }
  return caregiver;
};
