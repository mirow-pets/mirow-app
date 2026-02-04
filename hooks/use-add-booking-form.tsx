import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { addBookingSchema, TAddBooking } from "@/features/bookings/validations";
import { Post } from "@/services/http-service";
import { TBooking } from "@/types";
import { onError } from "@/utils";

import { usePetOwnerBooking } from "./pet-owner/use-pet-owner-booking";
import { useExitFormRouteWarning } from "./use-exit-form-route";
import { useRefetchQueries } from "./use-refetch-queries";

const mergeDateAndTime = ({ date, time }: { date: Date; time: Date }) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const mergedDateAndTime = new Date(year, month - 1, day, hour, minute, 0, 0);

  return mergedDateAndTime;
};

const checkStartAndEndDateError = ({
  startDate,
  startTime,
  endDate,
  endTime,
}: {
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
}) => {
  if (!startDate || !startTime || !endDate || !endTime) {
    return;
  }

  const tempStartDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    startTime.getHours(),
    startTime.getMinutes(),
    startTime.getSeconds()
  );
  const tempEndDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    endTime.getHours(),
    endTime.getMinutes(),
    endTime.getSeconds()
  );

  if (
    new Date(tempStartDate.toISOString().substring(0, 10)) >
    new Date(tempEndDate.toISOString().substring(0, 10))
  ) {
    return { endDate: "End date must be after start date" };
  }

  if (tempStartDate > tempEndDate) {
    return { endTime: "End time must be after start time" };
  }

  return undefined;
};

export interface AddBookingContextValues {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  addBooking: UseMutateFunction<TBooking, Error, TAddBooking>;
  isAddingBooking: boolean;
  checkStartAndEndDateError: typeof checkStartAndEndDateError;
  next: (_fields: string[]) => () => void;
  prev: () => void;
  handleSelectDateTimeNext: (_fields: string[]) => () => void;
  handleIsOpenShiftNext: (_fields: string[]) => () => void;
  handleCaregiverNext: (_fields: string[]) => () => void;
  handleTrainingTypeNext: (_fields: string[]) => () => void;
}

export const AddBookingContext = createContext<AddBookingContextValues | null>(
  null
);

export interface AddBookingProviderProps {
  children: ReactNode;
  serviceTypeId: number;
  isOpenShiftStep: number;
  confirmationStep: number;
}

const AddBookingProvider = ({
  children,
  serviceTypeId,
  isOpenShiftStep,
  confirmationStep,
}: AddBookingProviderProps) => {
  const [step, setStep] = useState(1);
  const { refetch } = useRefetchQueries();
  const { trainingTypeOptions } = usePetOwnerBooking();

  const currentDate = new Date();

  const startDate = new Date(
    currentDate.setMinutes(currentDate.getMinutes() + 30)
  );

  const form = useForm({
    resolver: zodResolver(addBookingSchema),
    defaultValues: {
      serviceTypeId,
      startDate: startDate,
      startTime: startDate,
    },
  });

  const values = form.watch();

  const { mutate: addBooking, isPending: isAddingBooking } = useMutation<
    TBooking,
    Error,
    TAddBooking
  >({
    mutationFn: ({
      startDate,
      startTime,
      endDate,
      endTime,
      ...input
    }: TAddBooking) =>
      Post("/v2/bookings", {
        serviceTypeId: input.serviceTypeId,
        caregiverId: input.caregiverId,
        petId: input.petId,
        trainingTypeId: input.trainingTypeId,
        customTrainingType: input.customTrainingType,
        startDate: mergeDateAndTime({ date: startDate, time: startTime }),
        endDate:
          endDate && endTime
            ? mergeDateAndTime({ date: startDate, time: startTime })
            : undefined,
      }),
    onError: onError,
    onSuccess: async () => {
      form.reset();
      await refetch([["/users/bookings"]]);

      router.back();

      Toast.show({
        type: "success",
        text1: "Booking added successfully!",
      });
    },
  });

  useExitFormRouteWarning({
    isDirty: form.formState.isDirty,
    onExit: () => {
      form.reset();
    },
  });

  const next = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (result) setStep((step) => step + 1);
  };

  const prev = () => {
    if (step === confirmationStep) setStep(isOpenShiftStep);
    else if (step === 1) router.back();
    else setStep((step) => step - 1);
  };

  const handleSelectDateTimeNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (!result) return;

    const errors = checkStartAndEndDateError(values);

    if (errors?.endDate) {
      form.setError("endDate", {
        message: errors.endDate,
      });

      return;
    }

    if (errors?.endTime) {
      form.setError("endTime", {
        message: errors.endTime,
      });

      return;
    }

    setStep((step) => step + 1);
  };

  const handleIsOpenShiftNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (!result) return;
    if (!values.isOpenShift) {
      setStep((step) => step + 1);
    } else {
      setStep(confirmationStep);
    }
  };

  const handleCaregiverNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (!result) return;
    if (values.caregiverId) {
      setStep((step) => step + 1);
    } else {
      form.setError("caregiverId", { message: "Caregiver is required" });
    }
  };

  const handleTrainingTypeNext = (fields: string[]) => async () => {
    const result = await form.trigger(fields as unknown as keyof TAddBooking);
    if (!result) return;

    const isCustomTrainingType = trainingTypeOptions.find(
      (option) =>
        option.label === "Custom" && option.value === values.trainingTypeId
    );

    if (isCustomTrainingType && !values.customTrainingType) {
      form.setError("customTrainingType", {
        message: "Custom training type is required",
      });
    } else setStep((step) => step + 1);
  };

  return (
    <AddBookingContext.Provider
      value={{
        step,
        setStep,
        addBooking,
        isAddingBooking,
        checkStartAndEndDateError,
        next,
        prev,
        handleSelectDateTimeNext,
        handleIsOpenShiftNext,
        handleCaregiverNext,
        handleTrainingTypeNext,
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </AddBookingContext.Provider>
  );
};

export default AddBookingProvider;

export const useAddBooking = () => {
  const addBooking = useContext(AddBookingContext);

  if (!addBooking) {
    throw new Error("Cannot access useAddBooking outside AddBookingProvider");
  }
  return addBooking;
};
