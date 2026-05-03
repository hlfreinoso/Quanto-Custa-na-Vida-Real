import {
  calculateBasicExpenseImpact,
  calculateComparisonResults,
  defaultComparisonPreferences,
  type ComparisonResult,
} from "@vale-o-pix/core";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";

interface ResultViewModel {
  workHoursEquivalent: number;
  comparisons: ComparisonResult[];
}

const DEFAULT_WORK_HOURS_PER_DAY = 8;
const DEFAULT_WORK_DAYS_PER_MONTH = 22;

export function ResultScreen() {
  const { amount, expenseName, monthlyIncome, selectedComparisonIds } =
    useLocalSearchParams<{
      amount?: string;
      expenseName?: string;
      monthlyIncome?: string;
      selectedComparisonIds?: string;
    }>();

  const result = buildResult({
    amount: amount ?? "",
    monthlyIncome: monthlyIncome ?? "",
    selectedComparisonIds: selectedComparisonIds ?? "",
  });

  function handleNewComparison() {
    router.replace({
      pathname: "/calculator",
      params: {
        monthlyIncome: monthlyIncome ?? "",
        selectedComparisonIds: selectedComparisonIds ?? "",
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Resultado</Text>
        <Text style={styles.title}>
          {expenseName ? expenseName : "Essa compra"} custa:
        </Text>
      </View>

      {result ? (
        <View style={styles.resultCard}>
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
      ) : (
        <Text accessibilityRole="alert" style={styles.errorText}>
          Não foi possível calcular. Volte e confira renda e valor.
        </Text>
      )}

      <Pressable onPress={handleNewComparison} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Novo comparativo</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/onboarding")}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Mudar preferências</Text>
      </Pressable>
    </ScrollView>
  );
}

function buildResult(params: {
  amount: string;
  monthlyIncome: string;
  selectedComparisonIds: string;
}): ResultViewModel | null {
  const parsedAmount = parseDecimalInput(params.amount);
  const parsedMonthlyIncome = parseDecimalInput(params.monthlyIncome);

  try {
    const impact = calculateBasicExpenseImpact(
      {
        monthlyIncome: parsedMonthlyIncome,
        workHoursPerDay: DEFAULT_WORK_HOURS_PER_DAY,
        workDaysPerMonth: DEFAULT_WORK_DAYS_PER_MONTH,
        currency: "BRL",
      },
      {
        amount: parsedAmount,
        frequency: "once",
      },
    );
    const comparisons = calculateComparisonResults({
      amount: parsedAmount,
      preferences: defaultComparisonPreferences,
      selectedIds: parseSelectedComparisonIds(params.selectedComparisonIds),
    });

    return {
      workHoursEquivalent: impact.workHoursEquivalent,
      comparisons,
    };
  } catch {
    return null;
  }
}

function parseDecimalInput(value: string): number {
  const normalizedValue = value.trim().replace(/\./g, "").replace(",", ".");

  return Number(normalizedValue);
}

function parseSelectedComparisonIds(value: string): string[] {
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
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FAFAF7",
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    marginBottom: 10,
    color: "#D54B35",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 380,
    color: "#171717",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
  },
  resultCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#B8D8CC",
    borderRadius: 8,
    backgroundColor: "#E9F5F1",
  },
  resultList: {
    gap: 10,
  },
  resultItem: {
    color: "#12312D",
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 28,
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
    color: "#B42318",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
  },
});
