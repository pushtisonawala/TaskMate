import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = new Map();

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { action, email, otp } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    switch (action) {
      case 'send':
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, {
          otp: generatedOtp,
          timestamp: Date.now()
        });

        try {
          await sendgrid.send({
            to: email,
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${generatedOtp}`,
            html: `<h1>Your OTP Code</h1><p>Your OTP code is: <strong>${generatedOtp}</strong></p>`
          });

          console.log(`OTP sent to ${email}: ${generatedOtp}`);
          return res.status(200).json({ success: true, message: "OTP sent successfully" });
        } catch (sendError) {
          console.error(`Error sending OTP to ${email}:`, sendError);
          return res.status(500).json({ success: false, message: "Failed to send OTP", error: sendError.message });
        }

      case 'verify':
        const storedData = otpStore.get(email);
        
        if (!storedData) {
          return res.status(400).json({ success: false, message: "No OTP found for this email" });
        }

        if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
          otpStore.delete(email);
          return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        if (storedData.otp === otp) {
          otpStore.delete(email);
          return res.status(200).json({ success: true, message: "OTP verified successfully" });
        } else {
          return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

      default:
        return res.status(400).json({ success: false, message: "Invalid action" });
    }
  } catch (error) {
    console.error("OTP error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};