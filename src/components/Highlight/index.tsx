import React from "react";
import { Container, Title, Subtitle } from "./styles";

import logoImg from "../../../assets/logo.png";

type Props = {
  title: string;
  subtitle: string;
};

export function Highlight({ title, subtitle }: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Container>
  );
}
