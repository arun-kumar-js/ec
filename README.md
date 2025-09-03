# Spider E-Kart

A React Native e-commerce application built for online shopping.

## Features

- User authentication with OTP
- Product browsing and categories
- Shopping cart functionality
- Wishlist management
- Order tracking
- Address management
- User profile and settings

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:

```bash
npm install
```

2. For iOS, install pods:

```bash
cd ios && pod install && cd ..
```

3. Start the Metro bundler:

```bash
npm start
```

4. Run the app:

For iOS:

```bash
npm run ios
```

For Android:

```bash
npm run android
```

## Project Structure

```
src/
├── screens/          # Screen components
│   ├── BottomTap/    # Bottom tab screens
│   └── ...           # Other screens
├── Assets/           # Images, icons, fonts
├── config/           # API configuration
├── CartButton.js     # Cart functionality
├── CartService.js    # Cart service
└── BottomTap.js      # Bottom navigation
```

## API Configuration

Update the API endpoints in `src/config/config.js`:

```javascript
export const API_BASE_URL = 'https://your-api-domain.com/api/';
export const API_ACCESS_KEY = 'your_api_access_key';
```

## Dependencies

- React Navigation
- Axios for API calls
- AsyncStorage for local storage
- React Native Vector Icons
- React Native Linear Gradient
- React Native Responsive Screen

## Build

The app has been successfully converted from Healto (healthcare app) to Spider E-Kart (e-commerce app) with all necessary dependencies and configurations updated.
