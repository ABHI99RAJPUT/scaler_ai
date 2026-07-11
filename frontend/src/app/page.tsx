"use client";

import { Button, Link, Icon, Container } from "@cloudscape-design/components";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ padding: "40px", fontFamily: "Amazon Ember, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "40px", flexWrap: "wrap" }}>
        
        {/* Left Column */}
        <div style={{ flex: 2, minWidth: "300px" }}>
          <div style={{ fontSize: "14px", marginBottom: "20px", color: "var(--color-text-body-secondary)" }}>
            Network & Content Delivery
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "bold", margin: "0 0 10px 0", lineHeight: "1.2" }}>
            Amazon Route 53
          </h1>
          <h2 style={{ fontSize: "32px", fontWeight: "normal", color: "var(--color-text-body-secondary)", margin: "0 0 20px 0", lineHeight: "1.3" }}>
            A reliable way to route users to internet applications
          </h2>
          <p style={{ fontSize: "16px", color: "var(--color-text-body-secondary)", marginBottom: "40px", lineHeight: "1.5" }}>
            Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.
          </p>

          <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
            How it works
          </h3>
          <Container>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'var(--color-background-container-content)', border: '1px solid var(--color-border-divider-default)', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 'bold' }}>Amazon Route 53</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-body-secondary)' }}>Amazon Web Services</div>
                  </div>
              </div>
              <p style={{ color: 'var(--color-text-body-secondary)', marginTop: '20px' }}>[ Diagram showing traffic routing logic ]</p>
            </div>
          </Container>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Get Started Box */}
          <Container>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 15px 0" }}>
              Get started with Route 53
            </h3>
            <p style={{ fontSize: "14px", color: "var(--color-text-body-secondary)", margin: "0 0 20px 0", lineHeight: "1.5" }}>
              Get started by registering a domain, configuring DNS, or using another Route 53 feature.
            </p>
            <Button variant="primary" onClick={() => router.push("/dashboard")}>
              Get started
            </Button>
          </Container>

          {/* Pricing Box */}
          <Container>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 10px 0" }}>
              Pricing (US)
            </h3>
            <Link href="#" variant="primary" external>View pricing</Link>
          </Container>

          {/* More Resources Box */}
          <Container>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 15px 0" }}>
              More resources <Icon name="external" size="small" />
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Link href="#" variant="primary">Documentation</Link>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border-divider-default)' }}></div>
              <Link href="#" variant="primary">API reference</Link>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border-divider-default)' }}></div>
              <Link href="#" variant="primary">FAQs</Link>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border-divider-default)' }}></div>
              <Link href="#" variant="primary">Forum - DNS and health checks</Link>
            </div>
          </Container>

        </div>
      </div>
    </div>
  );
}
