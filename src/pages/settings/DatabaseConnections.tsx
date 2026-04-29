import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  activateConnection,
  createConnection,
  listConnections,
  testConnection,
} from "@/lib/database-api";
import type {
  ConnectionEntryMode,
  DatabaseConnection,
  ManualConnectionPayload,
  ParsedConnectionPreview,
  SslMode,
  UrlConnectionPayload,
} from "@/types";

const initialManualForm: ManualConnectionPayload = {
  name: "",
  type: "POSTGRES",
  mode: "manual",
  host: "",
  port: 5432,
  database: "",
  username: "",
  password: "",
  sslMode: "require",
};

const initialUrlForm: UrlConnectionPayload = {
  name: "",
  type: "POSTGRES",
  mode: "url",
  connectionUrl: "",
};

export default function DatabaseConnections() {
  const [mode, setMode] = useState<ConnectionEntryMode>("url");
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [manualForm, setManualForm] = useState<ManualConnectionPayload>(initialManualForm);
  const [urlForm, setUrlForm] = useState<UrlConnectionPayload>(initialUrlForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeConnection = useMemo(
    () => connections.find((connection) => connection.isActive) ?? null,
    [connections],
  );

  const parsedPreview = useMemo(
    () => parseConnectionPreview(urlForm.connectionUrl),
    [urlForm.connectionUrl],
  );

  useEffect(() => {
    void loadConnections();
  }, []);

  async function loadConnections() {
    setIsLoading(true);
    setError(null);

    try {
      setConnections(await listConnections());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load connections.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function getActivePayload() {
    return mode === "url" ? urlForm : manualForm;
  }

  async function handleTestConnection() {
    setIsTesting(true);
    setMessage(null);
    setError(null);

    try {
      const result = await testConnection(getActivePayload());
      setMessage(result.message);
    } catch (testError) {
      setError(
        testError instanceof Error
          ? testError.message
          : "Connection test failed.",
      );
    } finally {
      setIsTesting(false);
    }
  }

  async function handleSaveConnection() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      await createConnection(getActivePayload());
      setManualForm(initialManualForm);
      setUrlForm(initialUrlForm);
      setMessage("Connection saved.");
      await loadConnections();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save connection.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleActivateConnection(id: string) {
    setError(null);
    setMessage(null);

    try {
      await activateConnection(id);
      setMessage("Active connection updated.");
      await loadConnections();
    } catch (activateError) {
      setError(
        activateError instanceof Error
          ? activateError.message
          : "Failed to activate connection.",
      );
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Database Connections</h1>
        <p className="text-on-surface-variant">
          Connect to PostgreSQL either with a single URL or the full manual form.
        </p>
      </header>

      {(message || error) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-error/30 bg-error/10 text-error"
              : "border-tertiary/30 bg-tertiary/10 text-tertiary"
          }`}
        >
          {error ?? message}
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-on-surface">Saved Connections</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                {activeConnection
                  ? `Active connection: ${activeConnection.name}`
                  : "No active connection selected yet."}
              </p>
            </div>
            <span className="inline-flex items-center rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
              Postgres only
            </span>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-sm text-on-surface-variant">Loading connections...</div>
            ) : connections.length === 0 ? (
              <div className="text-sm text-on-surface-variant">
                No connections saved yet. Add one from the form.
              </div>
            ) : (
              connections.map((connection) => (
                <div
                  key={connection.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    connection.isActive
                      ? "border-primary/40 bg-surface"
                      : "border-surface-container-high bg-surface-container"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-on-surface">{connection.name}</h3>
                        {connection.isActive && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary">
                            Active
                          </span>
                        )}
                        {connection.connectionUrl && (
                          <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                            Added via URL
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-mono text-on-surface-variant">
                        {connection.username}@{connection.host}:{connection.port}/{connection.database}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-wider text-outline">
                        SSL: {connection.sslMode}
                      </p>
                    </div>

                    <button
                      className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                        connection.isActive
                          ? "bg-surface-container-high text-on-surface-variant"
                          : "bg-primary-container text-on-primary-container hover:brightness-110"
                      }`}
                      disabled={connection.isActive}
                      onClick={() => void handleActivateConnection(connection.id)}
                    >
                      {connection.isActive ? "Active" : "Set Active"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container-high">
          <div className="mb-6">
            <h2 className="font-bold text-on-surface mb-1">Connect PostgreSQL</h2>
            <p className="text-xs text-on-surface-variant">
              Use the fastest onboarding path for you, while Aegis still stores normalized connection details under the hood.
            </p>
          </div>

          <div className="mb-6 flex rounded-lg bg-surface-container p-1">
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                mode === "url"
                  ? "bg-surface text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              onClick={() => setMode("url")}
            >
              Connection URL
            </button>
            <button
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                mode === "manual"
                  ? "bg-surface text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              onClick={() => setMode("manual")}
            >
              Manual
            </button>
          </div>

          {mode === "url" ? (
            <div className="space-y-4">
              <Field label="Connection Name">
                <input
                  className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                  value={urlForm.name}
                  onChange={(event) => setUrlForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Production PostgreSQL"
                />
              </Field>

              <Field label="Connection URL">
                <textarea
                  className="min-h-28 w-full rounded-lg bg-surface-container border-none px-4 py-3 text-sm text-on-surface font-mono focus:ring-1 focus:ring-primary/30 resize-none"
                  value={urlForm.connectionUrl}
                  onChange={(event) =>
                    setUrlForm((current) => ({ ...current, connectionUrl: event.target.value }))
                  }
                  placeholder="postgresql://username:password@host:5432/database?sslmode=require"
                />
              </Field>

              <div className="rounded-xl border border-surface-container-high bg-surface-container p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Parsed Preview
                </div>

                {parsedPreview ? (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <PreviewItem label="Host" value={parsedPreview.host} />
                    <PreviewItem label="Port" value={String(parsedPreview.port)} />
                    <PreviewItem label="Database" value={parsedPreview.database} />
                    <PreviewItem label="Username" value={parsedPreview.username} />
                    <PreviewItem label="SSL" value={parsedPreview.sslMode} />
                  </div>
                ) : (
                  <div className="text-sm text-on-surface-variant">
                    Enter a valid PostgreSQL URL to preview parsed connection details.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Connection Name">
                <input
                  className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                  value={manualForm.name}
                  onChange={(event) => setManualForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Production PostgreSQL"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Host">
                  <input
                    className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                    value={manualForm.host}
                    onChange={(event) => setManualForm((current) => ({ ...current, host: event.target.value }))}
                    placeholder="db.internal"
                  />
                </Field>
                <Field label="Port">
                  <input
                    className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                    type="number"
                    value={manualForm.port}
                    onChange={(event) =>
                      setManualForm((current) => ({ ...current, port: Number(event.target.value) || 5432 }))
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Database">
                  <input
                    className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                    value={manualForm.database}
                    onChange={(event) => setManualForm((current) => ({ ...current, database: event.target.value }))}
                    placeholder="analytics"
                  />
                </Field>
                <Field label="SSL Mode">
                  <select
                    className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                    value={manualForm.sslMode}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        sslMode: event.target.value as SslMode,
                      }))
                    }
                  >
                    {["disable", "allow", "prefer", "require", "verify_ca", "verify_full"].map((sslMode) => (
                      <option key={sslMode} value={sslMode}>
                        {sslMode}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Username">
                  <input
                    className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                    value={manualForm.username}
                    onChange={(event) => setManualForm((current) => ({ ...current, username: event.target.value }))}
                  />
                </Field>
                <Field label="Password">
                  <input
                    className="w-full rounded-lg bg-surface-container border-none px-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
                    type="password"
                    value={manualForm.password}
                    onChange={(event) => setManualForm((current) => ({ ...current, password: event.target.value }))}
                  />
                </Field>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              disabled={isTesting}
              onClick={() => void handleTestConnection()}
            >
              {isTesting ? "Testing..." : "Test Connection"}
            </button>
            <button
              className="rounded-lg bg-primary-container px-4 py-2 text-xs font-bold text-on-primary-container hover:brightness-110 transition-all disabled:opacity-50"
              disabled={isSaving}
              onClick={() => void handleSaveConnection()}
            >
              {isSaving ? "Saving..." : "Save Connection"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {label}
      </div>
      <div className="mt-1 text-sm font-mono text-on-surface">{value}</div>
    </div>
  );
}

function parseConnectionPreview(connectionUrl: string): ParsedConnectionPreview | null {
  if (!connectionUrl.trim()) {
    return null;
  }

  try {
    const url = new URL(connectionUrl);

    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
      return null;
    }

    const database = url.pathname.replace(/^\/+/, "");
    if (!url.hostname || !database || !url.username) {
      return null;
    }

    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database,
      username: decodeURIComponent(url.username),
      sslMode: parseSslMode(url.searchParams.get("sslmode")),
    };
  } catch {
    return null;
  }
}

function parseSslMode(value: string | null): SslMode {
  switch (value) {
    case "disable":
    case "allow":
    case "prefer":
    case "require":
    case "verify_ca":
    case "verify_full":
      return value;
    default:
      return "require";
  }
}
