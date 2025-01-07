import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

const OtpComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const sendOtp = async () => {
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/otp", { 
        action: "send", 
        email: email.toLowerCase() 
      });
      
      setMessage("OTP sent to your email!");
      setMessageType("success");
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      setMessageType("error");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("/api/otp", {
        action: "verify",
        email: email.toLowerCase(),
        otp,
      });
  
      setMessage("OTP verified successfully!");
      setMessageType("success");

      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        redirect: false,
      });

      if (result?.error) {
        setMessage(result.error);
        setMessageType("error");
      } else {
        router.push("/tasks");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error verifying OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 border rounded-lg shadow-lg bg-gray-800 max-w-md w-full text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Task Manager - OTP Verification</h2>
      
      <div className="space-y-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent || loading}
          className="w-full rounded-lg p-3 bg-gray-700 border-none focus:ring-2 focus:ring-teal-400 text-white"
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} text-white p-3 rounded-lg`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg p-3 bg-gray-700 border-none focus:ring-2 focus:ring-green-500 text-white"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white p-3 rounded-lg`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded ${messageType === 'success' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpComponent;
