import React, { useEffect, useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { View } from 'react-native';

const APP_URL = 'https://prepme-73afd.web.app/';

export default function App() {
  // Helps complete auth sessions when using WebBrowser/AuthSession
  WebBrowser.maybeCompleteAuthSession();

  const openedRef = useRef(false);

  useEffect(() => {
    // Open once on mount
    const open = async () => {
      if (openedRef.current) return;
      openedRef.current = true;

      try {
        await WebBrowser.openBrowserAsync(APP_URL, {
          enableDefaultShare: false,
          showTitle: true,
          // toolbarColor: '#ffffff', // optional branding on Android
          // controlsColor: '#000000', // optional branding on iOS
        });
      } catch (e) {
        // noop / optionally log
      }
    };

    open();
  }, []);

  // Keep an empty root; user will immediately see browser
  return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
}
