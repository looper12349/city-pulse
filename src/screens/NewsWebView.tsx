import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { LoadingIndicator } from '../components/LoadingIndicator';

/**
 * NewsWebView screen
 * Displays full article content in a WebView
 * Shows loading indicator while content loads
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

interface NewsWebViewProps {
  route: {
    params: {
      url: string;
      title?: string;
    };
  };
  navigation: {
    goBack: () => void;
    setOptions: (options: object) => void;
  };
}

export function NewsWebView({ route, navigation }: NewsWebViewProps) {
  const { url, title } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  // Set the header title if provided
  React.useEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [title, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: url }}
          style={styles.webView}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          renderLoading={() => <LoadingIndicator style={styles.loadingOverlay} />}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LoadingIndicator />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
