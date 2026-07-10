"use client";

import { useState, useEffect } from "react";
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
  Badge,
  StatusIndicator,
  ButtonDropdown,
  Alert,
} from "@cloudscape-design/components";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function HostedZones() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedZones, setSelectedZones] = useState<any[]>([]);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneType, setNewZoneType] = useState<any>({ label: "Public hosted zone", value: "Public" });
  const [newZoneComment, setNewZoneComment] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const router = useRouter();

  const loadZones = async () => {
    setLoading(true);
    try {
      const data = await api.getHostedZones(search);
      setZones(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadZones(); }, [search]);

  const handleCreate = async () => {
    if (!newZoneName.trim()) { setCreateError("Domain name is required."); return; }
    setCreateError(null);
    setCreateLoading(true);
    try {
      await api.createHostedZone({ name: newZoneName.trim(), type: newZoneType.value, comment: newZoneComment });
      setIsModalOpen(false);
      setNewZoneName(""); setNewZoneComment("");
      loadZones();
    } catch (e: any) {
      setCreateError(e.message ?? "Failed to create hosted zone.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      for (const z of selectedZones) await api.deleteHostedZone(z.id);
      setIsDeleteModalOpen(false);
      setSelectedZones([]);
      loadZones();
    } catch (e) { console.error("Failed to delete zone"); }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description="Manage your hosted zones and DNS records."
          counter={loading ? "" : `(${zones.length})`}
        >
          Hosted zones
        </Header>
      }
    >
      <Table
        columnDefinitions={[
          {
            id: "name",
            header: "Hosted zone name",
            cell: item => (
              <Button
                variant="link"
                onClick={() => router.push(`/hosted-zones/${item.id}`)}
              >
                {item.name}
              </Button>
            ),
            sortingField: "name",
            minWidth: 200,
          },
          {
            id: "type",
            header: "Type",
            cell: item => (
              <Badge color={item.type === "Public" ? "blue" : "grey"}>
                {item.type}
              </Badge>
            ),
            minWidth: 100,
          },
          {
            id: "recordCount",
            header: "Record count",
            cell: item => item.record_count,
            minWidth: 120,
          },
          {
            id: "comment",
            header: "Description",
            cell: item => item.comment || <span style={{ color: "#687078" }}>—</span>,
            minWidth: 160,
          },
          {
            id: "created_at",
            header: "Created",
            cell: item => formatDate(item.created_at),
            minWidth: 130,
          },
          {
            id: "id",
            header: "Hosted zone ID",
            cell: item => (
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "#0972d3" }}>
                {item.id}
              </span>
            ),
            minWidth: 300,
          },
        ]}
        items={zones}
        loading={loading}
        loadingText="Loading hosted zones"
        trackBy="id"
        selectionType="multi"
        selectedItems={selectedZones}
        onSelectionChange={({ detail }) => setSelectedZones(detail.selectedItems)}
        stripedRows
        stickyHeader
        empty={
          <Box margin={{ vertical: "xl" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <Box variant="strong">No hosted zones</Box>
              <Box color="text-body-secondary">
                There are no hosted zones created for this account.
              </Box>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Create hosted zone
              </Button>
            </SpaceBetween>
          </Box>
        }
        filter={
          <TextFilter
            filteringPlaceholder="Filter records by property or value"
            filteringText={search}
            onChange={({ detail }) => setSearch(detail.filteringText)}
            countText={search ? `${zones.length} match${zones.length !== 1 ? "es" : ""}` : undefined}
          />
        }
        header={
          <Header
            counter={loading ? "" : `(${zones.length})`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  iconName="refresh"
                  onClick={loadZones}
                  disabled={loading}
                  ariaLabel="Refresh"
                />
                <ButtonDropdown
                  disabled={selectedZones.length === 0}
                  items={[
                    { id: "view", text: "View details", disabled: selectedZones.length !== 1 },
                    { id: "delete", text: "Delete", disabled: selectedZones.length === 0 },
                  ]}
                  onItemClick={({ detail }) => {
                    if (detail.id === "view") router.push(`/hosted-zones/${selectedZones[0].id}`);
                    if (detail.id === "delete") setIsDeleteModalOpen(true);
                  }}
                >
                  Actions
                </ButtonDropdown>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Create hosted zone
                </Button>
              </SpaceBetween>
            }
          >
            Hosted zones
          </Header>
        }
        pagination={<Pagination currentPageIndex={1} pagesCount={1} />}
      />

      {/* ── Create Modal ── */}
      <Modal
        onDismiss={() => { setIsModalOpen(false); setCreateError(null); }}
        visible={isModalOpen}
        size="medium"
        header={<Header variant="h2">Create hosted zone</Header>}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => { setIsModalOpen(false); setCreateError(null); }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreate} loading={createLoading}>Create hosted zone</Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="l">
          {createError && <Alert type="error">{createError}</Alert>}
          <FormField
            label="Domain name"
            description="Enter the name of the domain that you want to route traffic for, for example, example.com."
          >
            <Input
              value={newZoneName}
              onChange={({ detail }) => setNewZoneName(detail.value)}
              placeholder="example.com"
              autoFocus
            />
          </FormField>
          <FormField label="Type" description="Choose whether this hosted zone is for a public or private domain.">
            <Select
              selectedOption={newZoneType}
              onChange={({ detail }) => setNewZoneType(detail.selectedOption)}
              options={[
                { label: "Public hosted zone", value: "Public", description: "Routes traffic on the internet" },
                { label: "Private hosted zone", value: "Private", description: "Routes traffic in your VPCs" },
              ]}
            />
          </FormField>
          <FormField label="Description" description="A comment or notes about this hosted zone. (Optional)">
            <Input
              value={newZoneComment}
              onChange={({ detail }) => setNewZoneComment(detail.value)}
              placeholder="Optional description"
            />
          </FormField>
        </SpaceBetween>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        onDismiss={() => setIsDeleteModalOpen(false)}
        visible={isDeleteModalOpen}
        header={<Header variant="h2">Delete hosted zone{selectedZones.length > 1 ? "s" : ""}</Header>}
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
            This action permanently deletes the selected hosted zone{selectedZones.length > 1 ? "s" : ""} and all their DNS records.
          </Alert>
          <Box>
            Are you sure you want to delete{" "}
            <strong>{selectedZones.length}</strong> hosted zone{selectedZones.length > 1 ? "s" : ""}?
          </Box>
          <Box color="text-body-secondary" fontSize="body-s">
            {selectedZones.map(z => z.name).join(", ")}
          </Box>
        </SpaceBetween>
      </Modal>
    </ContentLayout>
  );
}
