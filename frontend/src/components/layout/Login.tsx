"use client";

import { useState } from "react";
import {
  Container,
  Header,
  Tabs,
  FormField,
  Input,
  Button,
  SpaceBetween,
  Alert,
  Link,
} from "@cloudscape-design/components";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sign-in state
  const [siUsernameOrEmail, setSiUsernameOrEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign-up state
  const [suEmail, setSuEmail] = useState("");
  const [suUsername, setSuUsername] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirmPassword, setSuConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siUsernameOrEmail || !siPassword) { setError("Please fill in all fields."); return; }
    setError(null); setLoading(true);
    try { await login(siUsernameOrEmail, siPassword); }
    catch (err: any) { setError(err.message ?? "Sign-in failed. Please try again."); }
    finally { setLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suEmail || !suUsername || !suPassword || !suConfirmPassword) { setError("Please fill in all fields."); return; }
    if (suPassword !== suConfirmPassword) { setError("Passwords do not match."); return; }
    if (suPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(null); setLoading(true);
    try { await signup(suEmail, suUsername, suPassword); }
    catch (err: any) { setError(err.message ?? "Sign-up failed. Please try again."); }
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
            {activeTab === "signin" ? "Sign in to your account" : "Create a new account"}
          </span>
        </div>

        <div style={{ padding: "24px" }}>
          <SpaceBetween size="m">
            {error && (
              <Alert type="error" dismissible onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Tabs
              activeTabId={activeTab}
              onChange={({ detail }) => {
                setActiveTab(detail.activeTabId as "signin" | "signup");
                setError(null);
              }}
              tabs={[
                {
                  id: "signin",
                  label: "Sign in",
                  content: (
                    <form onSubmit={handleSignIn}>
                      <SpaceBetween size="m">
                        <div style={{ height: 12 }} />
                        <FormField label="Username or email address">
                          <Input
                            value={siUsernameOrEmail}
                            onChange={({ detail }) => setSiUsernameOrEmail(detail.value)}
                            placeholder="Enter your username or email"
                            type="text"
                            disabled={loading}
                            autoFocus
                          />
                        </FormField>
                        <FormField label="Password">
                          <Input
                            value={siPassword}
                            onChange={({ detail }) => setSiPassword(detail.value)}
                            placeholder="Enter your password"
                            type="password"
                            disabled={loading}
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
                        <div style={{ textAlign: "center" }}>
                          <span style={{ color: "#8d9db4", fontSize: 13 }}>
                            Don&apos;t have an account?{" "}
                          </span>
                          <Link
                            onFollow={() => { setActiveTab("signup"); setError(null); }}
                          >
                            Create one
                          </Link>
                        </div>
                      </SpaceBetween>
                    </form>
                  ),
                },
                {
                  id: "signup",
                  label: "Create account",
                  content: (
                    <form onSubmit={handleSignUp}>
                      <SpaceBetween size="m">
                        <div style={{ height: 12 }} />
                        <FormField label="Email address">
                          <Input
                            value={suEmail}
                            onChange={({ detail }) => setSuEmail(detail.value)}
                            placeholder="you@example.com"
                            type="email"
                            disabled={loading}
                            autoFocus
                          />
                        </FormField>
                        <FormField label="Username" description="Used to sign in. No spaces or special characters.">
                          <Input
                            value={suUsername}
                            onChange={({ detail }) => setSuUsername(detail.value)}
                            placeholder="Choose a username"
                            type="text"
                            disabled={loading}
                          />
                        </FormField>
                        <FormField label="Password" description="Minimum 6 characters.">
                          <Input
                            value={suPassword}
                            onChange={({ detail }) => setSuPassword(detail.value)}
                            placeholder="Create a password"
                            type="password"
                            disabled={loading}
                          />
                        </FormField>
                        <FormField label="Confirm password">
                          <Input
                            value={suConfirmPassword}
                            onChange={({ detail }) => setSuConfirmPassword(detail.value)}
                            placeholder="Repeat your password"
                            type="password"
                            disabled={loading}
                          />
                        </FormField>
                        <Button
                          variant="primary"
                          formAction="submit"
                          loading={loading}
                          fullWidth
                        >
                          Create account
                        </Button>
                        <div style={{ textAlign: "center" }}>
                          <span style={{ color: "#8d9db4", fontSize: 13 }}>
                            Already have an account?{" "}
                          </span>
                          <Link
                            onFollow={() => { setActiveTab("signin"); setError(null); }}
                          >
                            Sign in
                          </Link>
                        </div>
                      </SpaceBetween>
                    </form>
                  ),
                },
              ]}
            />
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
