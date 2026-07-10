"use client";

import { ContentLayout, Header, Container } from "@cloudscape-design/components";

export default function HealthChecks() {
  return (
    <ContentLayout header={<Header variant="h1">Health checks</Header>}>
      <Container>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Coming Soon</h2>
          <p>Health checks functionality is not implemented in this mock.</p>
        </div>
      </Container>
    </ContentLayout>
  );
}
