import { FlatList, Keyboard } from "react-native";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import React, { useEffect } from "react";
import { useState } from "react";

import { Alert } from "react-native";
import { ButtonIcon } from "@components/ButtonIcon";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "../../components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "@utils/AppErro";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { groupCreate } from "@storage/group/groupCreate";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RoutePrams = {
  group: string;
};

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const route = useRoute();
  const { group } = route.params as unknown as RoutePrams;
  const navigation = useNavigation();

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert("Nova pessoa", "Informe o nome da pessoa");
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    };
    try {
      await playerAddByGroup(newPlayer, group);
      setNewPlayerName("");
      fetchPlayersByTeam();
      Keyboard.dismiss();
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert("Nova pessoa", err.message);
      } else {
        Alert.alert("Nova pessoa", "Não foi possível adicionar");
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersbyTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersbyTeam);
    } catch (err) {
      Alert.alert(
        "Pessoas",
        "Não foi possível carregar as pessoaas do time seleciondo"
      );
    }
  }

  async function handleRemovePlayer(playername: string) {
    try {
      await playerRemoveByGroup(playername, group);
      fetchPlayersByTeam();
    } catch (err) {
      Alert.alert(
        "Pessoas",
        "Não foi possível remover essa pesso do time seleciondo"
      );
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate("groups");
    } catch (error) {
      console.log(error);
      Alert.alert("Remover Grupo", "Não foi posível remover o grupo");
    }
  }

  async function handleGroupRemove() {
    Alert.alert("Remover", "Deseja remover a turma?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => groupRemove() },
    ]);
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <Highlight title={group} subtitle="adicione a galera e separe os times" />
      <Form>
        <Input
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder="nome da pessoa"
          autoCorrect={false}
          returnKeyLabel="done"
        />

        <ButtonIcon onPress={handleAddPlayer} icon="add" />
      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PlayerCard
            onRemove={() => handleRemovePlayer(item.name)}
            name={item.name}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time." />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          players.length === 0 && { flex: 1 },
        ]}
      />
      <Button
        title="Remover turma"
        onPress={handleGroupRemove}
        type="SECONDARY"
      />
    </Container>
  );
}
