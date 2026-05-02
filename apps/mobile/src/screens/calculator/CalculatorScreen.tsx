import {
  calculateBasicExpenseImpact,
  calculateComparisonResults,
  defaultComparisonPreferences,
  type ComparisonResult,
} from "@vale-o-pix/core";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface CalculatorResult {
  hourlyRate: number;
  workHoursEquivalent: number;
  comparisons: ComparisonResult[];
}

const DEFAULT_WORK_HOURS_PER_DAY = 8;
const DEFAULT_WORK_DAYS_PER_MONTH = 22;

export function CalculatorScreen() {
  const {
    monthlyIncome: initialMonthlyIncome,
    selectedComparisonIds,
  } = useLocalSearchParams<{
    monthlyIncome?: string;
    selectedComparisonIds?: string;
  }>();
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasResult = result !== null;

  function handleCalculate() {
    const parsedAmount = parseDecimalInput(amount);
    const parsedMonthlyIncome = parseDecimalInput(initialMonthlyIncome ?? "");

    try {
      const calculation = calculateBasicExpenseImpact(
        {
          monthlyIncome: parsedMonthlyIncome,
          workHoursPerDay: DEFAULT_WORK_HOURS_PER_DAY,
          workDaysPerMonth: DEFAULT_WORK_DAYS_PER_MONTH,
          currency: "BRL",
        },
        {
          name: expenseName.trim() || undefined,
          amount: parsedAmount,
          frequency: "once",
        },
      );
      const comparisons = calculateComparisonResults({
        amount: parsedAmount,
        preferences: defaultComparisonPreferences,
        selectedIds: parseSelectedComparisonIds(selectedComparisonIds),
      });

      setResult({
        ...calculation,
        comparisons,
      });
      setErrorMessage(null);
    } catch {
      setResult(null);
      setErrorMessage("Preencha valor e renda inicial com numeros validos.");
    }
  }

  function handleNewProduct() {
    setExpenseName("");
    setAmount("");
    setResult(null);
    setErrorMessage(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Calculo rapido</Text>
        <Text style={styles.title}>
          {hasResult ? "Resultado da compra" : "Qual compra voce quer entender?"}
        </Text>
        <Text style={styles.description}>
          {hasResult
            ? "Compare outro produto quando quiser recalcular."
            : "Informe o valor da compra. Depois o app mostra o custo em horas de trabalho e comparacoes do seu dia."}
        </Text>
      </View>

      {!hasResult ? (
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
      ) : null}

      {errorMessage ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}

      {hasResult ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultEyebrow}>Resultado inicial</Text>
          <Text style={styles.resultTitle}>Essa compra custa:</Text>
          <View style={styles.resultList}>
            <Text style={styles.resultItem}>
              {formatHours(result.workHoursEquivalent)} horas do seu trabalho
            </Text>
            {result.comparisons.map((comparison) => (
              <Text key={comparison.id} style={styles.resultItem}>
                {formatQuantity(comparison.quantity)} {comparison.unitLabel}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={hasResult ? handleNewProduct : handleCalculate}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>
          {hasResult ? "Novo produto" : "Calcular custo real"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function parseDecimalInput(value: string): number {
  const normalizedValue = value.trim().replace(/\./g, "").replace(",", ".");

  return Number(normalizedValue);
}

function parseSelectedComparisonIds(value: string | undefined): string[] {
  if (!value) {
    return ["coffee", "netflix", "bonbon"];
  }

  return value.split(",").filter(Boolean);
}

function formatHours(value: number): string {
  if (value >= 10) {
    return value.toFixed(1).replace(".", ",");
  }

  return value.toFixed(2).replace(".", ",");
}

function formatQuantity(value: number): string {
  if (value >= 10) {
    return Math.round(value).toString();
  }

  return value.toFixed(1).replace(".", ",");
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
  errorText: {
    marginTop: 18,
    color: "#B42318",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  resultCard: {
    gap: 8,
    marginTop: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#B8D8CC",
    borderRadius: 8,
    backgroundColor: "#E9F5F1",
  },
  resultEyebrow: {
    color: "#16695D",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  resultTitle: {
    color: "#12312D",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28,
  },
  resultList: {
    gap: 6,
  },
  resultItem: {
    color: "#31524D",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
  },
});
