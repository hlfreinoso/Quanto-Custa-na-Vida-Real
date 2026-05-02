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
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workHoursPerDay, setWorkHoursPerDay] = useState("8");
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState("22");

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

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Calcular custo real</Text>
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
});
