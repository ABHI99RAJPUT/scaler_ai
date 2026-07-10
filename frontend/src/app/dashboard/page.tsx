"use client";

import {
  ContentLayout,
  Header,
  Container,
  SpaceBetween,
  Button,
  ColumnLayout,
  Box,
  Input,
  Table,
  TextFilter,
  Pagination,
  BreadcrumbGroup,
  Link,
  Icon,
} from "@cloudscape-design/components";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [domainSearch, setDomainSearch] = useState("");
  const [notificationSearch, setNotificationSearch] = useState("");

  const Card = ({ title, description, buttonText, onClick, isError }: any) => (
    <div style={{ textAlign: "center", padding: "0 10px", display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "var(--color-text-body-default, #fff)" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "var(--color-text-body-secondary, #aab7b8)", marginBottom: "20px", flexGrow: 1, minHeight: '60px' }}>
        {description}
      </p>
      {isError ? (
        <div style={{ marginTop: 'auto' }}>
          <div style={{ color: "#d13212", fontWeight: "bold", marginBottom: "8px" }}>Error</div>
          <div>Domains</div>
        </div>
      ) : (
        <div style={{ marginTop: 'auto' }}>
          <Button onClick={onClick}>{buttonText}</Button>
        </div>
      )}
    </div>
  );

  return (
    <ContentLayout
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Route 53", href: "/" },
            { text: "Dashboard", href: "/dashboard" },
          ]}
        />
      }
      header={
        <Header
          variant="h1"
          info={<Link variant="info">Info</Link>}
        >
          Route 53 Dashboard
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* Top 4 Columns */}
        <Container>
          <ColumnLayout columns={4} variant="default">
            <Card
              title="DNS management"
              description="A hosted zone tells Route 53 how to respond to DNS queries for a domain such as example.com."
              buttonText="Create hosted zone"
              onClick={() => router.push("/hosted-zones")}
            />
            <Card
              title="Availability monitoring"
              description="Health checks monitor your applications and web resources, and direct DNS queries to healthy resources."
              buttonText="Create health check"
              onClick={() => router.push("/health-checks")}
            />
            <Card
              title="Traffic management"
              description="A visual tool that lets you easily create policies for multiple endpoints in complex configurations."
              buttonText="Create policy"
              onClick={() => router.push("/traffic-policies")}
            />
            <Card
              title="Domain registration"
              description=""
              isError={true}
            />
          </ColumnLayout>
        </Container>

        {/* Register domain */}
        <Container
          header={<Header variant="h2">Register domain</Header>}
        >
          <SpaceBetween size="m">
            <Box>
              Find and register an available domain, or <Link href="#">transfer your existing domains</Link> to Route 53.
            </Box>
            <Input
              value={domainSearch}
              onChange={({ detail }) => setDomainSearch(detail.value)}
              placeholder="Enter a domain name"
            />
            <Box color="text-body-secondary" fontSize="body-s">
              Each label (each part between dots) can be up to 63 characters long and must start with a-z or 0-9. Maximum length: 255 characters, including dots. Valid characters: a-z, 0-9, and - (hyphen)
            </Box>
            <Button>Check</Button>
          </SpaceBetween>
        </Container>

        {/* Notifications */}
        <Table
          columnDefinitions={[
            {
              id: "resource",
              header: "Resource",
              cell: (item: any) => item.resource,
            },
            {
              id: "status",
              header: "Status",
              cell: (item: any) => item.status,
            },
            {
              id: "lastUpdate",
              header: "Last update",
              cell: (item: any) => item.lastUpdate,
            },
          ]}
          items={[]}
          loadingText="Loading notifications"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No notifications</b>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Find notifications"
              filteringText={notificationSearch}
              onChange={({ detail }) => setNotificationSearch(detail.filteringText)}
            />
          }
          header={<Header variant="h2">Notifications</Header>}
          pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
        />
      </SpaceBetween>
    </ContentLayout>
  );
}
