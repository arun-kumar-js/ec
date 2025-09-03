# Pusher Beams Setup Guide for EC Services

This guide will help you set up [Pusher Beams](https://pusher.com/beams/) push notifications for your EC Services React Native app.

## 🚀 Quick Start

### 1. Create a Pusher Beams Account

1. Go to [Pusher Beams Dashboard](https://dashboard.pusher.com/beams)
2. Sign up for a free account
3. Create a new Beams instance
4. Note down your **Instance ID** and **Secret Key**

### 2. Configure Your App

#### Update Configuration Files

1. **Update `src/config/pusherBeamsConfig.js`:**

   ```javascript
   export const PUSHER_BEAMS_CONFIG = {
     INSTANCE_ID: "your-actual-instance-id",
     SECRET_KEY: "your-actual-secret-key",
     AUTH_URL: "https://your-backend.com/beams-auth",
     // ... other config
   };
   ```

2. **Update `src/Screens/pushNotification.js`:**

   ```javascript
   const PUSHER_BEAMS_INSTANCE_ID = "your-actual-instance-id";
   const PUSHER_BEAMS_AUTH_URL = "https://your-backend.com/beams-auth";
   ```

3. **Update `src/services/PusherBeamsService.js`:**
   ```javascript
   const PUSHER_BEAMS_INSTANCE_ID = "your-actual-instance-id";
   const PUSHER_BEAMS_SECRET_KEY = "your-actual-secret-key";
   ```

### 3. Backend Setup

You'll need to create backend endpoints to handle device token management and user authentication.

#### Required Backend Endpoints:

1. **Authentication Endpoint** (`/beams-auth`)
2. **Save Device Token** (`/save-device-token`)
3. **Remove Device Token** (`/remove-device-token`)
4. **Get User Devices** (`/get-user-devices`)
5. **Subscribe to Interests** (`/subscribe-interests`)
6. **Unsubscribe from Interests** (`/unsubscribe-interests`)

### 4. iOS Setup

#### Add to `ios/YourApp/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

#### Add to `ios/YourApp/AppDelegate.mm`:

```objective-c
#import <UserNotifications/UserNotifications.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Request permission for notifications
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return YES;
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionSound);
}
```

### 5. Android Setup

#### Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

#### Add to `android/app/src/main/java/com/yourapp/MainApplication.java`:

```java
import com.pusher.pushnotifications.PushNotifications;

public class MainApplication extends Application implements ReactApplication {
  @Override
  public void onCreate() {
    super.onCreate();
    PushNotifications.start(this, "YOUR_INSTANCE_ID");
  }
}
```

## 📱 Usage Examples

### Sending Notifications

```javascript
import PusherBeamsService from "../services/PusherBeamsService";

// Send order update notification
await PusherBeamsService.sendOrderUpdateNotification("user123", {
  id: "order456",
  status: "shipped",
});

// Send promotion notification
await PusherBeamsService.sendPromotionNotification(["user123", "user456"], {
  id: "promo789",
  message: "50% off on all items!",
});

// Send to interests
await PusherBeamsService.sendToInterests(["promotions"], {
  title: "Flash Sale!",
  body: "Limited time offer - 70% off!",
});
```

### Client-Side Integration

```javascript
import PushNotification from "react-native-pusher-push-notifications";

// Initialize
await PushNotification.init({
  instanceId: "YOUR_INSTANCE_ID",
});

// Start service
await PushNotification.start();

// Subscribe to interests
await PushNotification.subscribe("promotions");
await PushNotification.subscribe("order-updates");

// Set user ID
await PushNotification.setUserId("user123", {
  url: "https://your-backend.com/beams-auth",
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 🔧 Advanced Configuration

### Custom Notification Sounds

For iOS, add sound files to your app bundle and reference them:

```javascript
apns: {
  aps: {
    sound: 'custom-sound.wav',
  },
}
```

For Android, add sound files to `android/app/src/main/res/raw/`:

```javascript
fcm: {
  notification: {
    sound: 'custom_sound',
  },
}
```

### Rich Notifications

```javascript
apns: {
  aps: {
    alert: {
      title: 'Order Update',
      body: 'Your order has been shipped!',
    },
    'mutable-content': 1,
    'content-available': 1,
  },
  data: {
    orderId: '123',
    status: 'shipped',
  },
}
```

### Action Buttons

```javascript
apns: {
  aps: {
    alert: {
      title: 'Order Update',
      body: 'Your order has been shipped!',
    },
    'category': 'ORDER_UPDATE',
  },
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Notifications not received:**

   - Check device token is saved correctly
   - Verify user is subscribed to correct interests
   - Check notification permissions

2. **iOS notifications not working:**

   - Ensure APNs certificate is configured
   - Check bundle identifier matches
   - Verify provisioning profile

3. **Android notifications not working:**
   - Check FCM configuration
   - Verify Google Services JSON file
   - Check notification permissions

### Debug Mode

Enable debug logging:

```javascript
PushNotification.setLogLevel("debug");
```

### Testing

Use the Pusher Beams dashboard to send test notifications or use the test function in the app:

```javascript
// Test notification
await PusherBeamsService.sendToUsers(["test-user"], {
  title: "Test Notification",
  body: "This is a test notification",
  data: { type: "test" },
});
```

## 📊 Analytics

Pusher Beams provides analytics on:

- Delivery rates
- Open rates
- Device token management
- User engagement

Access analytics in your [Pusher Beams Dashboard](https://dashboard.pusher.com/beams).

## 🔒 Security

### Best Practices

1. **Never expose secret keys in client code**
2. **Use authentication for user-specific notifications**
3. **Validate all notification data**
4. **Implement rate limiting**
5. **Use HTTPS for all API calls**

### Authentication Flow

```javascript
// Backend authentication endpoint
app.post("/beams-auth", (req, res) => {
  const userId = req.body.user_id;

  // Validate user
  if (!isValidUser(userId)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Generate authentication token
  const token = beamsClient.generateToken(userId);

  res.json({ token });
});
```

## 📚 Additional Resources

- [Pusher Beams Documentation](https://pusher.com/docs/beams)
- [React Native Integration Guide](https://pusher.com/docs/beams/getting-started/react-native)
- [API Reference](https://pusher.com/docs/beams/reference/server-sdk-node)
- [Best Practices](https://pusher.com/docs/beams/guides/push-notifications-best-practices)

## 🆘 Support

- [Pusher Support](https://support.pusher.com/)
- [Community Forum](https://community.pusher.com/)
- [GitHub Issues](https://github.com/pusher/push-notifications-react-native)

---

**Note:** Replace all placeholder values (`YOUR_INSTANCE_ID`, `YOUR_SECRET_KEY`, etc.) with your actual Pusher Beams credentials before testing.
