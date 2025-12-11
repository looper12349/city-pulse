# City Pulse 🌆

A modern, futuristic mobile app that delivers city-specific news and emergency alerts. Built with React Native and Expo.

![City Pulse](https://img.shields.io/badge/City%20Pulse-v1.0.0-black?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)

---

## 📲 Download & Demo

<table>
<tr>
<td align="center">
<a href="https://drive.google.com/file/d/1RxzSNffe2Au6YXX8td1HVbprpmiGKNYg/view?usp=drivesdk">
<img src="https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android" alt="Download APK"/>
</a>
<br/>
<sub>Android APK</sub>
</td>
<td align="center">
<a href="https://drive.google.com/file/d/1-Xc1-r7uQAeSi0YelIwCGEOyUelCgLgu/view?usp=drivesdk">
<img src="https://img.shields.io/badge/Watch-Demo-red?style=for-the-badge&logo=youtube" alt="Watch Demo"/>
</a>
<br/>
<sub>Video Demo</sub>
</td>
</tr>
</table>

---

## ✨ Features

- **🏙️ City Selection** - Choose from 70+ cities worldwide including major cities from India, USA, Europe, Asia, and more
- **📰 Real-time News** - Get the latest news articles for your selected city via NewsAPI
- **🔖 Bookmarks** - Save articles for later reading with persistent storage
- **⚠️ Emergency Alerts** - View color-coded emergency alerts by severity level
- **🔍 City Search** - Quickly find your city with instant search
- **⚙️ Settings** - Change your city anytime from the settings page
- **🌙 Dark Theme** - Modern black & white futuristic UI design
- **✨ Micro-animations** - Smooth press feedback and transitions throughout

## 📱 Screenshots

| Splash Screen | News Feed | Bookmarks | Alerts |
|---------------|-----------|-----------|--------|
| Animated pulse logo | City-specific news | Saved articles | Color-coded alerts |

## 🛠️ Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** React Context + Hooks
- **Storage:** AsyncStorage for persistence
- **HTTP Client:** Axios
- **Icons:** @expo/vector-icons (Ionicons)
- **Testing:** Jest + fast-check (Property-Based Testing)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AlertCard.tsx
│   ├── AnimatedPressable.tsx
│   ├── CityPicker.tsx
│   ├── LoadingIndicator.tsx
│   └── NewsCard.tsx
├── constants/           # App constants and theme
│   ├── cities.ts
│   └── theme.ts
├── context/             # React Context providers
│   ├── BookmarkContext.tsx
│   └── CityContext.tsx
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── screens/             # Screen components
│   ├── Bookmarks.tsx
│   ├── CitySelector.tsx
│   ├── EmergencyAlerts.tsx
│   ├── NewsFeed.tsx
│   ├── NewsWebView.tsx
│   ├── Settings.tsx
│   └── SplashScreen.tsx
├── services/            # API and data services
│   ├── alertService.ts
│   ├── bookmarkService.ts
│   ├── cityService.ts
│   └── newsService.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── __tests__/           # Property-based tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/city-pulse-app.git
cd city-pulse-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with your NewsAPI key
echo "VITE_NEWS_API_KEY=your_api_key_here" > .env
```

4. Start the development server:
```bash
npm start
```

### Running on Different Platforms

```bash
# Web
npm run web

# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

## 🧪 Testing

The app uses property-based testing with fast-check to verify correctness properties:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- ✅ City selection state consistency
- ✅ City alphabetical ordering
- ✅ News article rendering completeness
- ✅ Bookmark persistence (add/remove)
- ✅ Alert severity color mapping
- ✅ Article serialization round-trip
- ✅ Navigation state preservation

## 📦 Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

### Android App Bundle (for Play Store)

```bash
eas build -p android --profile production
```

### iOS

```bash
eas build -p ios --profile production
```

## 🎨 Design System

The app uses a modern monochrome design system:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0A0A0A` | Main background |
| Surface | `#141414` | Cards, inputs |
| Text Primary | `#FFFFFF` | Headings, important text |
| Text Secondary | `#A0A0A0` | Body text |
| Text Muted | `#666666` | Captions, hints |
| Border | `#2A2A2A` | Dividers, borders |

## 🌍 Supported Cities

70+ cities including:
- **India:** Bengaluru, Mumbai, Delhi, Chennai, Hyderabad, Kolkata, Pune, Jaipur, and more
- **North America:** New York, Los Angeles, San Francisco, Chicago, Toronto, Vancouver
- **Europe:** London, Paris, Berlin, Amsterdam, Barcelona, Rome, Stockholm
- **Asia Pacific:** Tokyo, Singapore, Hong Kong, Seoul, Sydney, Melbourne
- **Middle East:** Dubai, Abu Dhabi, Tel Aviv
- **South America:** São Paulo, Buenos Aires, Bogotá

## 📄 API Reference

### NewsAPI

The app uses [NewsAPI.org](https://newsapi.org/) for fetching news articles. Get your free API key at https://newsapi.org/register.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amritesh Indal**
- GitHub: [@indalamritesh](https://github.com/looper12349)
- Expo: [@indalamritesh](https://expo.dev/@indalamritesh)

---

Made with ❤️ using React Native and Expo
