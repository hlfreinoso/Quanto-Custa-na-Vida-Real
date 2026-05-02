import { defaultComparisonPreferences } from "@vale-o-pix/core";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function ComparisonPreferencesScreen() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(["coffee", "delivery", "netflix"]),
  );

  const selectedCount = selectedIds.size;
  const actionLabel = useMemo(() => {
    if (selectedCount === 0) {
      return "Continuar sem preferencias";
    }

    if (selectedCount === 1) {
      return "Continuar com 1 escolha";
    }

    return `Continuar com ${selectedCount} escolhas`;
  }, [selectedCount]);

  function togglePreference(id: string) {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }

      return nextIds;
    });
  }

  function handleContinue() {
    router.push({
      pathname: "/calculator",
      params: {
        monthlyIncome: monthlyIncome.trim(),
        selectedComparisonIds: Array.from(selectedIds).join(","),
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Quanto custa na vida real</Text>
        <Text style={styles.title}>Escolha suas comparacoes favoritas.</Text>
        <Text style={styles.description}>
          Vamos priorizar exemplos que fazem sentido no seu dia a dia. Voce
          pode mudar isso depois.
        </Text>
      </View>

      <View style={styles.profileField}>
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

      <View style={styles.grid}>
        {defaultComparisonPreferences.map((preference) => {
          const isSelected = selectedIds.has(preference.id);

          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              key={preference.id}
              onPress={() => togglePreference(preference.id)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected ? <View style={styles.checkboxMark} /> : null}
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {preference.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleContinue}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>{actionLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FAFAF7",
  },
  header: {
    marginBottom: 28,
  },
  eyebrow: {
    marginBottom: 10,
    color: "#D54B35",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 360,
    color: "#171717",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  description: {
    maxWidth: 390,
    marginTop: 14,
    color: "#4B5563",
    fontSize: 16,
    lineHeight: 23,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  profileField: {
    gap: 8,
    marginBottom: 22,
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
  option: {
    minHeight: 54,
    minWidth: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D7DBD2",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  optionSelected: {
    borderColor: "#16695D",
    backgroundColor: "#E9F5F1",
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    borderColor: "#16695D",
    backgroundColor: "#16695D",
  },
  checkboxMark: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  optionLabel: {
    flexShrink: 1,
    color: "#252525",
    fontSize: 16,
    fontWeight: "700",
  },
  optionLabelSelected: {
    color: "#0F3D38",
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
