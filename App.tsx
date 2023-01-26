import React from "react";
import { Groups } from "@screens/Groups";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components";
import theme from "./src/theme";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Loading } from "@components/Loading";
import { NewGroup } from "@screens/NewGroups";
import { Players } from "@screens/Players";
import { Routes } from "./src/routes";

export default function App() {
  const [fontsLoaders] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <ThemeProvider theme={theme}>
      <StatusBar backgroundColor="transparent" translucent />
      {fontsLoaders ? <Routes /> : <Loading />}
    </ThemeProvider>
  );
}
