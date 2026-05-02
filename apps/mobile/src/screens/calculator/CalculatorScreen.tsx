import { calculateBasicExpenseImpact } from "@vale-o-pix/core";
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
}

export function CalculatorScreen() {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workHoursPerDay, setWorkHoursPerDay] = useState("8");
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState("22");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleCalculate() {
    const parsedAmount = parseDecimalInput(amount);
    const parsedMonthlyIncome = parseDecimalInput(monthlyIncome);
    const parsedWorkHoursPerDay = parseDecimalInput(workHoursPerDay);
    const parsedWorkDaysPerMonth = parseDecimalInput(workDaysPerMonth);

    try {
      const calculation = calculateBasicExpenseImpact(
        {
          monthlyIncome: parsedMonthlyIncome,
          workHoursPerDay: parsedWorkHoursPerDay,
          workDaysPerMonth: parsedWorkDaysPerMonth,
          currency: "BRL",
        },
        {
          name: expenseName.trim() || undefined,
          amount: parsedAmount,
          frequency: "once",
        },
      );

      setResult(calculation);
      setErrorMessage(null);
    } catch {
      setResult(null);
      setErrorMessage("Preencha valor, renda, horas e dias com numeros validos.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Calculo rapido</Text>
        <Text style={styles.title}>Qual compra voce quer entender?</Text>
        <Text style={styles.description}>
          Informe o valor e, se quiser, sua renda. Depois o app mostra o custo
          em horas de trabalho e comparacoes do seu dia.
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

        <View style={styles.field}>
          <Text style={styles.label}>Renda mensal liquida</Text>
          <TextInput
            inputMode="decimal"
            keyboardType="decimal-pad"
            onChangeText={setMonthlyIncome}
            placeholder="Ex: 4500,00"
            placeholderTextColor="#8A8F98"
            style={styles.input}
            value={monthlyIncome}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.label}>Horas por dia</Text>
            <TextInput
              inputMode="decimal"
              keyboardType="decimal-pad"
              onChangeText={setWorkHoursPerDay}
              placeholder="8"
              placeholderTextColor="#8A8F98"
              style={styles.input}
              value={workHoursPerDay}
            />
          </View>

          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.label}>Dias por mes</Text>
            <TextInput
              inputMode="decimal"
              keyboardType="decimal-pad"
              onChangeText={setWorkDaysPerMonth}
              placeholder="22"
              placeholderTextColor="#8A8F98"
              style={styles.input}
              value={workDaysPerMonth}
            />
          </View>
        </View>
      </View>

      {errorMessage ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {errorMessage}
        </Text>
      ) : null}

      {result ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultEyebrow}>Resultado inicial</Text>
          <Text style={styles.resultTitle}>
            Essa compra custa aproximadamente{" "}
            {formatHours(result.workHoursEquivalent)} horas do seu trabalho.
          </Text>
          <Text style={styles.resultDetail}>
            Seu valor-hora estimado e de R$ {formatCurrency(result.hourlyRate)}.
          </Text>
        </View>
      ) : null}

      <Pressable onPress={handleCalculate} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Calcular custo real</Text>
      </Pressable>
    </ScrollView>
  );
}

function parseDecimalInput(value: string): number {
  const normalizedValue = value.trim().replace(/\./g, "").replace(",", ".");

  return Number(normalizedValue);
}

function formatHours(value: number): string {
  if (value >= 10) {
    return value.toFixed(1).replace(".", ",");
  }

  return value.toFixed(2).replace(".", ",");
}

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowField: {
    flex: 1,
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
  resultDetail: {
    color: "#31524D",
    fontSize: 15,
    lineHeight: 21,
  },
});
