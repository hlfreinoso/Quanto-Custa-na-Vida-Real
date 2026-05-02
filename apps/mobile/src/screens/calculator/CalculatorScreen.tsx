import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function CalculatorScreen() {
  const { monthlyIncome, selectedComparisonIds } = useLocalSearchParams<{
    monthlyIncome?: string;
    selectedComparisonIds?: string;
  }>();
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleCalculate() {
    if (!amount.trim()) {
      setErrorMessage("Informe o valor da compra.");
      return;
    }

    router.push({
      pathname: "/result",
      params: {
        amount: amount.trim(),
        expenseName: expenseName.trim(),
        monthlyIncome: monthlyIncome ?? "",
        selectedComparisonIds: selectedComparisonIds ?? "",
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Calculo rapido</Text>
        <Text style={styles.title}>Qual compra voce quer entender?</Text>
        <Text style={styles.description}>
          Informe o produto e o preco. O resultado vem na proxima tela.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome da compra</Text>
          <TextInput
            onChangeText={setExpenseName}
            placeholder="Ex: Cadeira ergonomica"
            placeholderTextColor="#8A8F98"
            style={styles.input}
            value={expenseName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            inputMode="decimal"
            keyboardType="decimal-pad"
            onChangeText={setAmount}
            placeholder="Ex: 1499,00"
            placeholderTextColor="#8A8F98"
            style={styles.input}
            value={amount}
          />
        </View>

        <Text style={styles.assumptionText}>
          Usamos 8 horas por dia e 22 dias por mes como padrao.
        </Text>
      </View>

      {errorMessage ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}

      <Pressable onPress={handleCalculate} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Calcular custo real</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/onboarding")}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Mudar preferencias</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#FAFAF7",
  },
  header: {
    marginBottom: 26,
    paddingTop: 18,
  },
  eyebrow: {
    marginBottom: 10,
    color: "#D54B35",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 370,
    color: "#171717",
    fontSize: 31,
    fontWeight: "800",
    lineHeight: 37,
  },
  description: {
    maxWidth: 400,
    marginTop: 12,
    color: "#4B5563",
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    color: "#252525",
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#D7DBD2",
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    color: "#171717",
    fontSize: 17,
  },
  assumptionText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
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
    marginTop: 12,
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
  errorText: {
    marginTop: 18,
    color: "#B42318",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
});
