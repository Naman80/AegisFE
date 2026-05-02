import { useMemo, useState, type ReactNode } from "react";
import {
  createDatasource,
  activateDatasource,
  testDatasourceConnection,
  deleteDatasource
} from "@/services/datasource.service";
import { useDatasource } from "@/contexts/DatasourceContext";
import { Loader2 } from "lucide-react";
import type {
  ConnectionEntryMode,
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
  const { datasources, isLoading, refreshDatasources } = useDatasource();
  const [mode, setMode] = useState<ConnectionEntryMode>("url");
  const [manualForm, setManualForm] = useState<ManualConnectionPayload>(initialManualForm);
  const [urlForm, setUrlForm] = useState<UrlConnectionPayload>(initialUrlForm);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedPreview = useMemo(
    () => parseConnectionPreview(urlForm.connectionUrl),
    [urlForm.connectionUrl],
  );

  function getActivePayload() {
    return mode === "url" ? urlForm : manualForm;
  }

  async function handleTestConnection(id: string) {
    setIsTesting(true);
    setMessage(null);
    setError(null);
    try {
      const result = await testDatasourceConnection(id);
      setMessage(result.message);
    } catch (testError: any) {
      setError(testError.message || "Connection test failed.");
    } finally {
      setIsTesting(false);
    }
  }

  async function handleSaveConnection() {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      await createDatasource(getActivePayload());
      setManualForm(initialManualForm);
      setUrlForm(initialUrlForm);
      setMessage("Connection saved successfully.");
      await refreshDatasources(); // Sync global state
    } catch (saveError: any) {
      setError(saveError.message || "Failed to save connection.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleActivateConnection(id: string) {
    setError(null);
    setMessage(null);
    try {
      await activateDatasource(id);
      setMessage("Connection activated.");
      await refreshDatasources(); // Sync global state
    } catch (activateError: any) {
      setError(activateError.message || "Failed to activate connection.");
    }
  }

  async function handleDeleteConnection(id: string) {
    if (!confirm("Are you sure you want to delete this connection?")) return;
    try {
      await deleteDatasource(id);
      await refreshDatasources();
    } catch (err: any) {
      setError(err.message || "Failed to delete connection");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4">
      <header className="mb-2">
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2 uppercase">Database Fleet</h1>
        <p className="text-on-surface-variant font-medium opacity-80">
          Manage your database connections with normalized provider-agnostic architecture.
        </p>
      </header>

      {(message || error) && (
        <div
          className={`rounded-2xl border px-6 py-4 text-sm font-bold shadow-sm transition-all animate-in fade-in slide-in-from-top-4 ${error
            ? "border-error/20 bg-error/5 text-error"
            : "border-primary/20 bg-primary/5 text-primary"
            }`}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">{error ? 'error' : 'check_circle'}</span>
            {error ?? message}
          </div>
        </div>
      )}

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] items-start">
        {/* Left: Saved Connections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">Active Fleet</h2>
            <span className="text-[10px] font-bold text-outline uppercase bg-surface-container px-2 py-0.5 rounded">
              {datasources.length} TOTAL
            </span>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high border-dashed">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-20" />
                <p className="mt-4 text-xs font-bold text-outline uppercase tracking-widest">Enlisting connections...</p>
              </div>
            ) : datasources.length === 0 ? (
              <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-container-high border-dashed">
                <span className="material-symbols-outlined text-5xl text-outline opacity-20">cloud_off</span>
                <p className="mt-4 text-sm font-medium text-on-surface-variant">No connections established yet.</p>
              </div>
            ) : (
              datasources.map((connection) => (
                <div
                  key={connection.id}
                  className={`rounded-2xl border-2 p-6 transition-all shadow-sm ${connection.isActive
                    ? "border-primary bg-primary/[0.02] shadow-primary/5"
                    : "border-surface-container-high bg-surface-container-lowest hover:border-outline-variant/30"
                    }`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${connection.isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline'}`}>
                        <span className="material-symbols-outlined text-2xl">database</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-black text-on-surface tracking-tight">{connection.name}</h3>
                          {connection.isActive && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-primary text-on-primary shadow-sm">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant/70 font-medium max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg">
                          <span className="material-symbols-outlined text-[10px] shrink-0">link</span>
                          <span className="break-all leading-relaxed">
                            {connection.username}@{connection.host}:{connection.port}/{connection.database}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-surface-container rounded-lg text-outline-variant border border-surface-container-high">
                            TYPE: {connection.type}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-surface-container rounded-lg text-outline-variant border border-surface-container-high">
                            SSL: {connection.sslMode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        className={`rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${connection.isActive
                          ? "bg-surface-container text-outline cursor-default"
                          : "bg-primary text-on-primary shadow-lg shadow-primary/10 hover:scale-105 active:scale-95"
                          }`}
                        disabled={connection.isActive}
                        onClick={() => void handleActivateConnection(connection.id)}
                      >
                        {connection.isActive ? "Selected" : "Activate"}
                      </button>
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleTestConnection(connection.id)}
                          className={`p-2 transition-colors rounded-lg ${isTesting ? 'text-primary animate-pulse' : 'text-outline hover:text-primary hover:bg-primary/5'}`}
                          title="Test Connection"
                          disabled={isTesting}
                        >
                          <span className="material-symbols-outlined text-sm">{isTesting ? 'sync' : 'network_check'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteConnection(connection.id)}
                          className="p-2 text-outline hover:text-error transition-colors rounded-lg hover:bg-error/5"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: New Connection Form */}
        <aside className="space-y-5 lg:sticky lg:top-6 h-fit max-w-[380px]">
          <div className="bg-surface-container-low rounded-3xl p-5 border border-surface-container-high shadow-xl shadow-surface-container/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-6xl">add_link</span>
            </div>

            <div className="mb-4">
              <h2 className="text-base font-black text-on-surface tracking-tight mb-1">Deploy Connection</h2>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 leading-relaxed">
                Aegis stores encrypted metadata for multiple providers.
              </p>
            </div>

            <div className="mb-4 flex rounded-2xl bg-surface-container-highest p-1 shadow-inner">
              <button
                className={`flex-1 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${mode === "url"
                  ? "bg-surface text-primary shadow-md"
                  : "text-on-surface-variant hover:text-on-surface"
                  }`}
                onClick={() => setMode("url")}
              >
                URL Path
              </button>
              <button
                className={`flex-1 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all ${mode === "manual"
                  ? "bg-surface text-primary shadow-md"
                  : "text-on-surface-variant hover:text-on-surface"
                  }`}
                onClick={() => setMode("manual")}
              >
                Manual
              </button>
            </div>

            {mode === "url" ? (
              <div className="space-y-4">
                <Field label="Alias">
                  <input
                    className="w-full rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:opacity-30"
                    value={urlForm.name}
                    onChange={(event) => setUrlForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="e.g. Primary Cluster"
                  />
                </Field>

                <Field label="URL Protocol">
                  <textarea
                    className="min-h-20 w-full rounded-xl bg-surface-container border-none px-3 py-3 text-xs font-bold text-on-surface font-mono focus:ring-2 focus:ring-primary/20 resize-none shadow-inner"
                    value={urlForm.connectionUrl}
                    onChange={(event) =>
                      setUrlForm((current) => ({ ...current, connectionUrl: event.target.value }))
                    }
                    placeholder="postgresql://user:pass@host:port/db"
                  />
                </Field>

                {parsedPreview && (
                  <div className="rounded-2xl bg-primary/5 p-4 border border-primary/10 animate-in zoom-in-95 duration-200">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-3">Normalized Data</div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold font-mono">
                      <PreviewItem label="Host" value={parsedPreview.host} />
                      <PreviewItem label="Port" value={String(parsedPreview.port)} />
                      <PreviewItem label="DB" value={parsedPreview.database} />
                      <PreviewItem label="User" value={parsedPreview.username} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Alias">
                  <input
                    className="w-full rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                    value={manualForm.name}
                    onChange={(event) => setManualForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Production DB"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-3">
                  <Field label="Host Structure">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                        value={manualForm.host}
                        onChange={(event) => setManualForm((current) => ({ ...current, host: event.target.value }))}
                        placeholder="localhost"
                      />
                      <input
                        className="w-20 rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                        type="number"
                        value={manualForm.port}
                        onChange={(event) =>
                          setManualForm((current) => ({ ...current, port: Number(event.target.value) || 5432 }))
                        }
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Database">
                    <input
                      className="w-full rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                      value={manualForm.database}
                      onChange={(event) => setManualForm((current) => ({ ...current, database: event.target.value }))}
                      placeholder="postgres"
                    />
                  </Field>
                  <Field label="SSL">
                    <select
                      className="w-full rounded-xl bg-surface-container border-none px-3 py-2.5 text-[10px] font-black uppercase text-on-surface focus:ring-2 focus:ring-primary/20"
                      value={manualForm.sslMode}
                      onChange={(event) =>
                        setManualForm((current) => ({
                          ...current,
                          sslMode: event.target.value as SslMode,
                        }))
                      }
                    >
                      {["disable", "require", "verify_full", "verify_ca"].map((ssl) => (
                        <option key={ssl} value={ssl}>{ssl.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Username">
                    <input
                      className="w-full rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                      value={manualForm.username}
                      onChange={(event) => setManualForm((current) => ({ ...current, username: event.target.value }))}
                    />
                  </Field>
                  <Field label="Password">
                    <input
                      className="w-full rounded-xl bg-surface-container border-none px-3 py-2.5 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary/20"
                      type="password"
                      value={manualForm.password}
                      onChange={(event) => setManualForm((current) => ({ ...current, password: event.target.value }))}
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                className="w-full rounded-2xl bg-primary px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-on-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                disabled={isSaving}
                onClick={() => void handleSaveConnection()}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-lg">rocket_launch</span>
                )}
                {isSaving ? "SYNCING..." : "COMMIT CONNECTION"}
              </button>
            </div>
          </div>
        </aside>
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
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-70 ml-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[8px] font-black uppercase tracking-widest text-outline mb-1">
        {label}
      </div>
      <div className="text-[11px] truncate text-on-surface opacity-90">{value}</div>
    </div>
  );
}

function parseConnectionPreview(connectionUrl: string): ParsedConnectionPreview | null {
  if (!connectionUrl.trim()) return null;
  try {
    const url = new URL(connectionUrl);
    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") return null;
    const database = url.pathname.replace(/^\/+/, "");
    if (!url.hostname || !database || !url.username) return null;
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database,
      username: decodeURIComponent(url.username),
      sslMode: parseSslMode(url.searchParams.get("sslmode")),
    };
  } catch { return null; }
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
    case "verify-full":
      return "verify_full";
    case "verify-ca":
      return "verify_ca";
    default:
      return "require";
  }
}
