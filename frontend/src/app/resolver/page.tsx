"use client";

import { ContentLayout, Header, Container } from "@cloudscape-design/components";

export default function Resolver() {
  return (
    <ContentLayout header={<Header variant="h1">Resolver</Header>}>
      <Container>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Coming Soon</h2>
          <p>Route 53 Resolver functionality is not implemented in this mock.</p>
        </div>
      </Container>
    </ContentLayout>
  );
}
