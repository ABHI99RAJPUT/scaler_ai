"use client";

import { Button, Link, Icon } from "@cloudscape-design/components";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: "#0f1b2a", minHeight: "100vh", color: "white", padding: "40px", fontFamily: "Amazon Ember, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "40px" }}>
        
        {/* Left Column */}
        <div style={{ flex: 2 }}>
          <div style={{ color: "#aab7b8", fontSize: "14px", marginBottom: "20px" }}>
            Network & Content Delivery
          </div>
          <h1 style={{ fontSize: "44px", fontWeight: "bold", margin: "0 0 10px 0", lineHeight: "1.2" }}>
            Amazon Route 53
          </h1>
          <h2 style={{ fontSize: "32px", fontWeight: "normal", color: "#eaeded", margin: "0 0 20px 0", lineHeight: "1.3" }}>
            A reliable way to route users to internet applications
          </h2>
          <p style={{ fontSize: "16px", color: "#aab7b8", marginBottom: "40px", lineHeight: "1.5" }}>
            Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.
          </p>

          <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>
            How it works
          </h3>
          <div style={{ 
            backgroundColor: "#162233", 
            borderRadius: "8px", 
            padding: "30px", 
            border: "1px solid #2a333f",
            textAlign: "center"
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <div style={{ padding: '20px', background: '#232f3e', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 'bold' }}>Amazon Route 53</div>
                    <div style={{ fontSize: '12px', color: '#aab7b8' }}>Amazon Web Services</div>
                </div>
            </div>
            <p style={{ color: '#aab7b8', marginTop: '20px' }}>[ Diagram showing traffic routing logic ]</p>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Get Started Box */}
          <div style={{ 
            backgroundColor: "#162233", 
            borderRadius: "8px", 
            padding: "24px", 
            border: "1px solid #2a333f" 
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 15px 0" }}>
              Get started with Route 53
            </h3>
            <p style={{ fontSize: "14px", color: "#aab7b8", margin: "0 0 20px 0", lineHeight: "1.5" }}>
              Get started by registering a domain, configuring DNS, or using another Route 53 feature.
            </p>
            <Button variant="primary" onClick={() => router.push("/dashboard")}>
              Get started
            </Button>
          </div>

          {/* Pricing Box */}
          <div style={{ 
            backgroundColor: "#162233", 
            borderRadius: "8px", 
            padding: "24px", 
            border: "1px solid #2a333f" 
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 10px 0" }}>
              Pricing (US)
            </h3>
            <Link href="#" variant="primary" external>View pricing</Link>
          </div>

          {/* More Resources Box */}
          <div style={{ 
            backgroundColor: "#162233", 
            borderRadius: "8px", 
            padding: "24px", 
            border: "1px solid #2a333f" 
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 15px 0" }}>
              More resources <Icon name="external" size="small" />
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Link href="#" variant="primary">Documentation</Link>
              <div style={{ height: '1px', backgroundColor: '#2a333f' }}></div>
              <Link href="#" variant="primary">API reference</Link>
              <div style={{ height: '1px', backgroundColor: '#2a333f' }}></div>
              <Link href="#" variant="primary">FAQs</Link>
              <div style={{ height: '1px', backgroundColor: '#2a333f' }}></div>
              <Link href="#" variant="primary">Forum - DNS and health checks</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
