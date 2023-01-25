import { configureStore } from "@reduxjs/toolkit";
import account from "./slices/accountSlice";

export const store = configureStore({
  reducer: { account },
});
