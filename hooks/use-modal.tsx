import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// import { postLogout } from "../Service/ModalSvc";
// import { initializeSocket } from "../Service/socketSvc";

export interface ModalContextValue {
  openId: string;
  setOpenId: Dispatch<SetStateAction<string>>;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [openId, setOpenId] = useState<string>("");

  return (
    <ModalContext.Provider
      value={{
        openId,
        setOpenId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;

export const useModal = () => {
  const Modal = useContext(ModalContext);

  if (!Modal) {
    throw new Error("Cannot use useModal outside ModalProvider");
  }
  return Modal;
};
