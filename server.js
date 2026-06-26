require("dotenv").config();
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


const Conversation = require("./models/Conversation");
const Message = require("./models/Message")

// ======================
// Firebase Admin SDK
// ======================
let firebaseInitialized = false;

try {
  //const serviceAccount = require("./serviceAccountKey.json");
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  firebaseInitialized = true;
  console.log("🔥 Firebase Admin initialized");
} catch (err) {
  console.warn("⚠️ Firebase Admin not initialized:", err.message);
  console.log(
  "FIREBASE_SERVICE_ACCOUNT exists:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT
  );
  console.warn("Push notifications will be disabled.");
}

// ======================
// MongoDB Connection
// ======================
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    throw err;
  }
};

// ======================
// JWT
// ======================
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

// ======================
// Push Notification Helper
// ======================
/**
 * Send FCM push notification to a user
 * @param {string} receiverId - MongoDB user ID
 * @param {string} senderId - MongoDB sender ID
 * @param {string} content - Message content
 * @param {string} messageId - MongoDB message document ID
 */


// Update the sendPushNotification function in your server.js
const sendPushNotification = async (receiverId, senderId, content, messageId) => {
  if (!firebaseInitialized) return;

  try {
    const User = require("./models/UserModel/User");
    const receiver = await User.findById(receiverId).select("fcmTokens");

    if (!receiver || !receiver.fcmTokens || receiver.fcmTokens.length === 0) {
      console.log("📱 No FCM tokens for user:", receiverId);
      return;
    }

    const sender = await User.findById(senderId).select("name");
    const senderName = sender?.name || "Someone";
    const message = {
    tokens: receiver.fcmTokens,
    notification: {
      title: `New message from ${senderName}`,
      body: content.length > 100 ? content.substring(0, 97) + "..." : content,
    },
    data: {
      type: "chat",
      senderId: senderId.toString(),
      senderName,
      messageId: messageId.toString(),
      conversationId: receiverId.toString(),
    },
  };

  const response = await admin.messaging().sendEachForMulticast(message);
  if (response.failureCount > 0) {
    response.responses.forEach((r, i) => {
      if (!r.success) {
        console.log("❌ FCM ERROR:", r.error);
        console.log("❌ FAILED TOKEN:", receiver.fcmTokens[i]);
      }
    });
  }
    console.log(`📱 FCM sent: ${response.successCount}/${receiver.fcmTokens.length} successful`);

    if (response.failureCount > 0) {
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            invalidTokens.push(receiver.fcmTokens[idx]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        await User.findByIdAndUpdate(receiverId, {
          $pull: { fcmTokens: { $in: invalidTokens } },
        });
        console.log(`🧹 Cleaned ${invalidTokens.length} invalid FCM tokens`);
      }
    }
  } catch (fcmError) {
    console.error("❌ FCM Error:", fcmError.message);
  }
};

// ======================
// Start App
// ======================
app.prepare().then(async () => {
  await connectDB();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
    path: "/api/socket/io",
  });

  io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  console.log("🔐 SOCKET TOKEN RECEIVED:", token ? "present" : "missing");

  try {
    const user = verifyToken(token);
    if (!user) return next(new Error("Unauthorized"));

    socket.data.userId = user.id;

    console.log("🟢 Authenticated user:", user.id);

    next();
  } catch (e) {
    console.log("JWT ERROR:", e.message);
    return next(new Error("Unauthorized"));
  }
});

  // ======================
  // Connection
  // ======================
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);
    console.log("🟢 User connected:", userId);

    // ======================
    // SEND MESSAGE (FIXED)
    // ======================
    socket.on("send_message", async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content?.trim()) return;

        const trimmedContent = content.trim();

        // 1. Save message to database
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: trimmedContent,
        });

        // 2. Populate sender/receiver info
        const populatedMessage = await Message.findById(message._id)
          .populate("sender receiver", "name email role avatar")
          .lean();

        // 3. Deterministic chat key (prevents duplicate conversations)
        const chatKey = [userId, receiverId].sort().join("_");

        let conversation = await Conversation.findOne({ chatKey });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [userId, receiverId],
            chatKey,
            lastMessage: trimmedContent,
            lastMessageAt: new Date(),
            unreadCount: {
              [receiverId]: 1,
            },
          });
        } else {
          conversation.lastMessage = trimmedContent;
          conversation.lastMessageAt = new Date();

          const unread = conversation.unreadCount || {};
          unread[receiverId] = (unread[receiverId] || 0) + 1;
          conversation.unreadCount = unread;

          await conversation.save();
        }

        // 4. Emit real-time message to receiver
        io.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        // 5. Confirm to sender
        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        // 6. Send push notification via FCM
        await sendPushNotification(receiverId, userId, trimmedContent, message._id);

      } catch (err) {
        console.error("send_message error:", err);
        socket.emit("message_error", {
          error: "Failed to send message",
        });
      }
    });

    // ======================
    // MARK READ (FIXED)
    // ======================
    socket.on("mark_read", async ({ senderId }) => {
      try {
        await Message.updateMany(
          {
            sender: senderId,
            receiver: userId,
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
          }
        );

        const chatKey = [userId, senderId].sort().join("_");

        const conversation = await Conversation.findOne({ chatKey });

        if (conversation) {
          const unread = conversation.unreadCount || {};
          unread[userId] = 0;
          conversation.unreadCount = unread;
          await conversation.save();
        }

        io.to(`user:${senderId}`).emit("messages_read", {
          by: userId,
        });
      } catch (err) {
        console.error("mark_read error:", err);
      }
    });

    // ======================
    // Typing Indicators
    // ======================
    socket.on("typing_start", ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit("user_typing", {
        userId,
        isTyping: true,
      });
    });

    socket.on("typing_end", ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit("user_typing", {
        userId,
        isTyping: false,
      });
    });

    // ======================
    // Disconnect
    // ======================
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", userId);
    });
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO path: /api/socket/io`);
  });
});  