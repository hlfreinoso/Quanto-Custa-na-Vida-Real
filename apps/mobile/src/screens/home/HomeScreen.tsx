import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { loadInitialProfile } from "../../storage/InitialProfileStorage";

export function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleStart() {
    setIsLoading(true);

    try {
      const profile = await loadInitialProfile();

      if (!profile) {
        router.push("/onboarding");
        return;
      }

      router.push({
        pathname: "/calculator",
        params: {
          monthlyIncome: profile.monthlyIncome,
          selectedComparisonIds: profile.selectedComparisonIds.join(","),
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Quanto custa na vida real</Text>
      <Text style={styles.title}>Veja o custo real antes de comprar.</Text>
      <Text style={styles.description}>
        Transforme preços em horas do seu trabalho e comparações simples do dia
        a dia.
      </Text>

      <View style={styles.actions}>
        <Pressable onPress={handleStart} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>
            {isLoading ? "Carregando..." : "Iniciar"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/onboarding")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Mudar preferências</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FAFAF7",
  },
  eyebrow: {
    marginBottom: 12,
    color: "#D54B35",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 360,
    color: "#171717",
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 42,
  },
  description: {
    maxWidth: 390,
    marginTop: 14,
    color: "#4B5563",
    fontSize: 17,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginTop: 32,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#171717",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D7DBD2",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#252525",
    fontSize: 16,
    fontWeight: "800",
  },
});
