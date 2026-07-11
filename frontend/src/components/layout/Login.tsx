"use client";

import { useState } from "react";
import {
  FormField,
  Input,
  Button,
  SpaceBetween,
  Alert,
} from "@cloudscape-design/components";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) { setError("Please enter your username."); return; }
    setError(null); setLoading(true);
    try { await login(username); }
    catch (err: any) { setError(err.message ?? "Sign-in failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0f1923 100%)",
      gap: "24px",
    }}>
      {/* AWS-style logo header */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "12px",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "#EC7211",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", fontSize: 18, color: "#fff",
            boxShadow: "0 4px 16px rgba(236,114,17,0.4)",
          }}>53</div>
          <span style={{ color: "#fff", fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Route 53
          </span>
        </div>
        <p style={{ color: "#8d9db4", fontSize: 13, marginTop: 4 }}>
          Amazon Web Services — DNS Management Console
        </p>
      </div>

      {/* Login card */}
      <div style={{
        width: "100%", maxWidth: 440,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        backdropFilter: "blur(16px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}>
        {/* Card header bar */}
        <div style={{
          background: "rgba(236,114,17,0.12)",
          borderBottom: "1px solid rgba(236,114,17,0.25)",
          padding: "16px 24px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EC7211" }} />
          <span style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 15 }}>
            Sign in to your account
          </span>
        </div>

        <div style={{ padding: "24px" }}>
          <SpaceBetween size="m">
            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSignIn}>
              <SpaceBetween size="m">
                <FormField label="Username" description="Enter your username to sign in or create an account.">
                  <Input
                    value={username}
                    onChange={({ detail }) => setUsername(detail.value)}
                    placeholder="Enter your username"
                    type="text"
                    disabled={loading}
                    autoFocus
                  />
                </FormField>
                <Button
                  variant="primary"
                  formAction="submit"
                  loading={loading}
                  fullWidth
                >
                  Sign in
                </Button>
              </SpaceBetween>
            </form>
          </SpaceBetween>
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: "#4a5568", fontSize: 12, textAlign: "center" }}>
        © 2026 Route 53 Clone · Built for learning purposes
      </p>
    </div>
  );
}
