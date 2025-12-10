import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { theme } from '../constants/theme';

// Conditionally import WebView only for native platforms
let WebView: React.ComponentType<any> | null = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

/**
 * NewsWebView screen - Modern design
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

const getProxiedUrl = (url: string): string => {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};

export function NewsWebView({ route, navigation }: NewsWebViewProps) {
  const { url, title } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [title, navigation]);

  // For web platform
  if (Platform.OS === 'web') {
    useEffect(() => {
      const fetchContent = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(getProxiedUrl(url));
          if (!response.ok) throw new Error('Failed to fetch');
          const html = await response.text();

          const baseUrl = new URL(url).origin;
          const responsiveStyles = `
            <style>
              * { box-sizing: border-box; }
              html, body { 
                max-width: 100% !important; 
                overflow-x: hidden !important;
                margin: 0;
                padding: 0;
                background: ${theme.colors.background};
                color: ${theme.colors.textPrimary};
              }
              img, video, iframe, embed, object { 
                max-width: 100% !important; 
                height: auto !important; 
              }
            </style>
          `;
          const modifiedHtml = html
            .replace(/<head>/i, `<head><base href="${baseUrl}/">${responsiveStyles}`)
            .replace(/<meta[^>]*viewport[^>]*>/gi, '')
            .replace(
              /<head>/i,
              '<head><meta name="viewport" content="width=device-width, initial-scale=1.0">'
            );

          setHtmlContent(modifiedHtml);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to load article:', error);
          setIframeError(true);
          setIsLoading(false);
        }
      };

      fetchContent();
    }, [url]);

    const handleOpenInNewTab = () => {
      window.open(url, '_blank');
    };

    if (iframeError) {
      return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.errorContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={64}
              color={theme.colors.textMuted}
            />
            <Text style={styles.errorTitle}>Unable to Load</Text>
            <Text style={styles.errorText}>
              This article couldn't be displayed inline.
            </Text>
            <AnimatedPressable
              style={styles.button}
              onPress={handleOpenInNewTab}
            >
              <Ionicons
                name="open-outline"
                size={20}
                color={theme.colors.textPrimary}
              />
              <Text style={styles.buttonText}>Open in New Tab</Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </AnimatedPressable>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={[styles.webViewContainer, { width, height: height - 100 }]}>
          {htmlContent ? (
            <iframe
              srcDoc={htmlContent}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                backgroundColor: theme.colors.background,
              }}
              sandbox="allow-scripts allow-popups allow-forms"
              title={title || 'Article'}
            />
          ) : null}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <LoadingIndicator />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // For native platforms
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.webViewContainer}>
        {WebView && (
          <WebView
            source={{ uri: url }}
            style={styles.webView}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            startInLoadingState={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <LoadingIndicator style={styles.loadingOverlay} />
            )}
          />
        )}
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
    backgroundColor: theme.colors.background,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  buttonText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButtonText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
