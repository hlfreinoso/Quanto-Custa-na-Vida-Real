import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Quanto custa na vida real</Text>
      <Text style={styles.title}>Veja o custo real antes de comprar.</Text>
      <Text style={styles.description}>
        Transforme valores em horas de trabalho, percentual da renda e
        comparacoes simples do dia a dia.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F7F3EA",
  },
  eyebrow: {
    marginBottom: 12,
    color: "#7A4E2B",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 340,
    color: "#1E1E1E",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
  },
  description: {
    maxWidth: 360,
    marginTop: 16,
    color: "#4A4A4A",
    fontSize: 17,
    lineHeight: 24,
  },
});
