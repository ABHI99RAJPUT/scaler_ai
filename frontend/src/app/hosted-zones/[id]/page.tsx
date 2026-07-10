"use client";

import { useState, useEffect, use } from "react";
import {
  ContentLayout,
  Header,
  Table,
  Pagination,
  TextFilter,
  Button,
  SpaceBetween,
  Modal,
  FormField,
  Input,
  Select,
  Box,
  Container,
  ColumnLayout,
  Badge,
  Alert,
  BreadcrumbGroup,
  ButtonDropdown,
  Textarea,
} from "@cloudscape-design/components";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function HostedZoneDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const zoneId = resolvedParams.id;

  const [zone, setZone] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const router = useRouter();

  // Create record form state
  const [recordName, setRecordName] = useState("");
  const [recordType, setRecordType] = useState<any>({ label: "A", value: "A" });
  const [recordValue, setRecordValue] = useState("");
  const [recordTtl, setRecordTtl] = useState("300");
  const [recordRoutingPolicy, setRecordRoutingPolicy] = useState<any>({ label: "Simple routing", value: "Simple" });

  const loadData = async () => {
    setLoading(true);
    try {
      const z = await api.getHostedZone(zoneId);
      setZone(z);
      const r = await api.getRecords(zoneId, search);
      setRecords(r);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [search, zoneId]);

  const handleCreate = async () => {
    if (!recordValue.trim()) { setCreateError("Value/routing target is required."); return; }
    setCreateError(null); setCreateLoading(true);
    try {
      await api.createRecord(zoneId, {
        name: recordName ? `${recordName}.${zone.name}` : zone.name,
        type: recordType.value,
        value: recordValue,
        ttl: parseInt(recordTtl, 10),
        routing_policy: recordRoutingPolicy.value,
      });
      setIsModalOpen(false);
      setRecordName(""); setRecordValue(""); setRecordTtl("300");
      loadData();
    } catch (e: any) {
      setCreateError(e.message ?? "Failed to create record.");
    } finally { setCreateLoading(false); }
  };

  const handleDelete = async () => {
    try {
      for (const rec of selectedRecords) await api.deleteRecord(zoneId, rec.id);
      setIsDeleteModalOpen(false); setSelectedRecords([]); loadData();
    } catch (e) { console.error("Failed to delete record", e); }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getRecordTypeColor = (type: string): "blue" | "green" | "red" | "grey" | "severity-medium" => {
    const map: Record<string, "blue" | "green" | "red" | "grey"> = {
      A: "blue", AAAA: "blue", CNAME: "green", MX: "severity-medium" as any,
      TXT: "grey", NS: "red", SOA: "red", PTR: "grey",
    };
    return map[type] ?? "grey";
  };

  if (!zone && !loading) {
    return (
      <ContentLayout header={<Header>Not Found</Header>}>
        <Container>
          <Alert type="error">Hosted zone not found or you do not have access.</Alert>
        </Container>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description={zone ? `Hosted zone ID: ${zone.id}` : "Loading..."}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => router.push("/hosted-zones")}>
                Back to hosted zones
              </Button>
            </SpaceBetween>
          }
        >
          {zone ? zone.name : "Loading..."}
        </Header>
      }
    >
      <SpaceBetween size="l">
        {/* ── Zone Detail Panel ── */}
        <Container
          header={
            <Header
              variant="h2"
              actions={
                <Button iconName="refresh" onClick={loadData} disabled={loading} ariaLabel="Refresh" />
              }
            >
              Hosted zone details
            </Header>
          }
        >
          {loading && !zone ? (
            <Box textAlign="center" color="text-body-secondary">Loading...</Box>
          ) : (
            <ColumnLayout columns={3} variant="text-grid">
              <SpaceBetween size="s">
                <div>
                  <Box variant="awsui-key-label">Hosted zone name</Box>
                  <Box>{zone?.name}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Type</Box>
                  <Badge color={zone?.type === "Public" ? "blue" : "grey"}>{zone?.type}</Badge>
                </div>
              </SpaceBetween>
              <SpaceBetween size="s">
                <div>
                  <Box variant="awsui-key-label">Hosted zone ID</Box>
                  <Box><code style={{ fontSize: 12 }}>{zone?.id}</code></Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Record count</Box>
                  <Box>{zone?.record_count}</Box>
                </div>
              </SpaceBetween>
              <SpaceBetween size="s">
                <div>
                  <Box variant="awsui-key-label">Created at</Box>
                  <Box>{formatDate(zone?.created_at)}</Box>
                </div>
                <div>
                  <Box variant="awsui-key-label">Description</Box>
                  <Box color="text-body-secondary">{zone?.comment || "—"}</Box>
                </div>
              </SpaceBetween>
            </ColumnLayout>
          )}
        </Container>

        {/* ── DNS Records Table ── */}
        <Table
          columnDefinitions={[
            {
              id: "name",
              header: "Record name",
              cell: item => <span style={{ fontFamily: "monospace", fontSize: 13 }}>{item.name}</span>,
              sortingField: "name",
              minWidth: 200,
            },
            {
              id: "type",
              header: "Type",
              cell: item => <Badge color={getRecordTypeColor(item.type)}>{item.type}</Badge>,
              minWidth: 80,
            },
            {
              id: "routing_policy",
              header: "Routing policy",
              cell: item => item.routing_policy,
              minWidth: 130,
            },
            {
              id: "value",
              header: "Value / Route traffic to",
              cell: item => (
                <span style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: 12 }}>
                  {item.value}
                </span>
              ),
              minWidth: 280,
            },
            {
              id: "ttl",
              header: "TTL (seconds)",
              cell: item => (item.ttl === 0 ? "Alias" : item.ttl),
              minWidth: 120,
            },
          ]}
          items={records}
          loading={loading}
          loadingText="Loading records"
          trackBy="id"
          selectionType="multi"
          selectedItems={selectedRecords}
          onSelectionChange={({ detail }) => setSelectedRecords(detail.selectedItems)}
          stripedRows
          stickyHeader
          empty={
            <Box margin={{ vertical: "xl" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <Box variant="strong">No DNS records</Box>
                <Box color="text-body-secondary">Create a record to start routing traffic.</Box>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>Create record</Button>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Filter records by name or value"
              filteringText={search}
              onChange={({ detail }) => setSearch(detail.filteringText)}
              countText={search ? `${records.length} match${records.length !== 1 ? "es" : ""}` : undefined}
            />
          }
          header={
            <Header
              counter={loading ? "" : `(${records.length})`}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    iconName="refresh"
                    onClick={loadData}
                    disabled={loading}
                    ariaLabel="Refresh records"
                  />
                  <Button
                    disabled={selectedRecords.length === 0 ||
                      selectedRecords.some(r => (r.type === "SOA" || r.type === "NS") && r.name === zone?.name)}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete record
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Create record
                  </Button>
                </SpaceBetween>
              }
            >
              DNS Records
            </Header>
          }
          pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
        />
      </SpaceBetween>

      {/* ── Create Record Modal ── */}
      <Modal
        onDismiss={() => { setIsModalOpen(false); setCreateError(null); }}
        visible={isModalOpen}
        size="medium"
        header={<Header variant="h2">Create DNS record</Header>}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => { setIsModalOpen(false); setCreateError(null); }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreate} loading={createLoading}>Create record</Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="l">
          {createError && <Alert type="error">{createError}</Alert>}
          <FormField
            label="Record name"
            description={`Subdomain prefix. Leave blank for the zone apex (${zone?.name}).`}
          >
            <Input
              value={recordName}
              onChange={({ detail }) => setRecordName(detail.value)}
              placeholder={`e.g. www → www.${zone?.name}`}
            />
          </FormField>
          <FormField label="Record type">
            <Select
              selectedOption={recordType}
              onChange={({ detail }) => setRecordType(detail.selectedOption)}
              options={[
                { label: "A – IPv4 address", value: "A" },
                { label: "AAAA – IPv6 address", value: "AAAA" },
                { label: "CNAME – Canonical name", value: "CNAME" },
                { label: "MX – Mail exchange", value: "MX" },
                { label: "TXT – Text record", value: "TXT" },
                { label: "NS – Name server", value: "NS" },
                { label: "PTR – Pointer", value: "PTR" },
                { label: "SRV – Service locator", value: "SRV" },
                { label: "CAA – CA Authorization", value: "CAA" },
              ]}
            />
          </FormField>
          <FormField label="Value" description="IP address, domain, or quoted text. One value per line.">
            <Textarea
              value={recordValue}
              onChange={({ detail }) => setRecordValue(detail.value)}
              placeholder="192.0.2.1"
              rows={3}
            />
          </FormField>
          <FormField label="TTL (seconds)" description="How long resolvers cache this record. Lower = faster propagation.">
            <Input
              value={recordTtl}
              type="number"
              onChange={({ detail }) => setRecordTtl(detail.value)}
            />
          </FormField>
          <FormField label="Routing policy">
            <Select
              selectedOption={recordRoutingPolicy}
              onChange={({ detail }) => setRecordRoutingPolicy(detail.selectedOption)}
              options={[
                { label: "Simple routing", value: "Simple", description: "Route to a single resource" },
                { label: "Weighted routing", value: "Weighted", description: "Route traffic based on weights" },
              ]}
            />
          </FormField>
        </SpaceBetween>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        onDismiss={() => setIsDeleteModalOpen(false)}
        visible={isDeleteModalOpen}
        header={<Header variant="h2">Delete record{selectedRecords.length > 1 ? "s" : ""}</Header>}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleDelete}>Delete</Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning">
            Deleting DNS records will immediately affect traffic routing. This action cannot be undone.
          </Alert>
          <Box>
            Delete <strong>{selectedRecords.length}</strong> record{selectedRecords.length > 1 ? "s" : ""}?
          </Box>
          <Box color="text-body-secondary" fontSize="body-s">
            {selectedRecords.map(r => `${r.name} (${r.type})`).join(", ")}
          </Box>
        </SpaceBetween>
      </Modal>
    </ContentLayout>
  );
}
