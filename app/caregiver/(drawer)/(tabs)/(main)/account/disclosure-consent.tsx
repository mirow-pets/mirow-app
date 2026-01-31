import { StyleSheet, View } from "react-native";

import { WebView } from "react-native-webview";

export default function DisclosureConsentScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://www.mirow.app/docs/disclosure-consent" }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
