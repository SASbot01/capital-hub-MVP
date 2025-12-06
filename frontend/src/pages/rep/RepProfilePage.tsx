// frontend/src/pages/rep/RepProfilePage.tsx
import { useState, useEffect } from "react";
import Topbar from "../../layouts/Topbar";
import { useFetch } from "../../hooks/useFetch";
import { apiClient } from "../../api/client";

interface RepProfile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleType: "SETTER" | "CLOSER" | "BOTH";
  bio: string;
  phone: string;
  country: string;
  linkedinUrl: string;
  avatarUrl: string;
  introVideoUrl: string;
  active: boolean;
  createdAt: string;
}

interface DashboardStats {
  monthlyStats: {
    callsMade: number;
    closures: number;
    avgTicket: number;
    estimatedCommission: number;
  };
  latestProcesses: Array<{
    id: number;
    companyName: string;
    jobTitle: string;
    status: string;
  }>;
}

export default function RepProfilePage() {
  const { data: profile, isLoading, error, refetch } = useFetch<RepProfile>("/rep/me", true);
  const { data: stats } = useFetch<DashboardStats>("/rep/dashboard/stats", true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estados para edición
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [roleType, setRoleType] = useState("CLOSER");

  // Inicializar formulario cuando lleguen los datos
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setCountry(profile.country || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setRoleType(profile.roleType || "CLOSER");
    }
  }, [profile]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    // Restaurar valores originales
    if (profile) {
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setCountry(profile.country || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setRoleType(profile.roleType || "CLOSER");
    }
    setIsEditing(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await apiClient.put("/rep/me", {
        bio,
        phone,
        country,
        linkedinUrl,
        roleType,
      }, true);
      
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error("Error guardando perfil:", err);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      SETTER: "Setter",
      CLOSER: "Closer",
      BOTH: "Setter + Closer",
    };
    return labels[role] || role;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Reciente";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Topbar title="Perfil" subtitle="Cargando tu perfil..." />
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <Topbar title="Perfil" subtitle="Error de conexión" />
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          Error al cargar el perfil.
          <button onClick={refetch} className="underline ml-2">Reintentar</button>
        </div>
      </div>
    );
  }

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Usuario";
  const initials = fullName.split(" ").map((n) => n[0] || "").join("").slice(0, 2).toUpperCase() || "U";

  // Métricas reales del dashboard
  const activeProcesses = stats?.latestProcesses?.length || 0;
  const callsMade = stats?.monthlyStats?.callsMade || 0;
  const closures = stats?.monthlyStats?.closures || 0;
  const avgTicket = stats?.monthlyStats?.avgTicket || 0;

  return (
    <div className="space-y-6">
      <Topbar
        title="Mi Perfil"
        subtitle="Tu información profesional visible para empresas"
      />

      {/* CABECERA PERFIL */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        {/* Info principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 text-white flex items-center justify-center text-lg font-semibold">
                  {initials}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{fullName}</h2>
                {isEditing ? (
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="mt-1 rounded-xl border border-neutral-200 px-2 py-1 text-xs bg-neutral-50"
                  >
                    <option value="SETTER">Setter</option>
                    <option value="CLOSER">Closer</option>
                    <option value="BOTH">Setter + Closer</option>
                  </select>
                ) : (
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {roleLabel(profile.roleType)} {profile.country ? `· ${profile.country}` : ""}
                  </p>
                )}
                <p className="text-xs text-neutral-400 mt-0.5">
                  Miembro desde {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                profile.active 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-neutral-50 text-neutral-500 border border-neutral-200"
              }`}>
                {profile.active ? "✓ Activo" : "Inactivo"}
              </span>
              
              {!isEditing ? (
                <button
                  onClick={startEditing}
                  className="mt-1 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                >
                  ✏️ Editar perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "💾 Guardar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BIO */}
          <div className="mt-5 border-t border-neutral-100 pt-4">
            <h3 className="text-sm font-medium text-neutral-900 mb-1.5">Sobre mí</h3>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm bg-neutral-50 outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                rows={4}
                placeholder="Cuéntanos sobre tu experiencia, logros y qué tipo de proyectos te interesan..."
              />
            ) : (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {profile.bio || (
                  <span className="text-neutral-400 italic">
                    Aún no has añadido una descripción. Haz clic en "Editar perfil" para contar a las empresas quién eres.
                  </span>
                )}
              </p>
            )}
          </div>

          {/* CAMPOS DE CONTACTO */}
          {isEditing ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs bg-neutral-50 outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">País / Ciudad</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs bg-neutral-50 outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="Madrid, España"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-neutral-500 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-xs bg-neutral-50 outline-none focus:ring-1 focus:ring-neutral-900"
                  placeholder="https://linkedin.com/in/tu-perfil"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.phone && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-xs text-neutral-700">
                  📞 {profile.phone}
                </span>
              )}
              {profile.country && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-xs text-neutral-700">
                  📍 {profile.country}
                </span>
              )}
              {profile.linkedinUrl && (
                <a 
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-xs text-blue-700 hover:bg-blue-100 transition"
                >
                  🔗 LinkedIn
                </a>
              )}
              {profile.email && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-xs text-neutral-700">
                  ✉️ {profile.email}
                </span>
              )}
              {!profile.phone && !profile.country && !profile.linkedinUrl && (
                <p className="text-xs text-neutral-400 italic">
                  Sin información de contacto. Edita tu perfil para añadirla.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ESTADÍSTICAS REALES */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5">
          <h3 className="text-sm font-medium text-neutral-900 mb-4">Tu actividad</h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50">
              <dt className="text-xs text-neutral-500">Procesos activos</dt>
              <dd className="text-lg font-semibold text-neutral-900">{activeProcesses}</dd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50">
              <dt className="text-xs text-neutral-500">Llamadas este mes</dt>
              <dd className="text-lg font-semibold text-neutral-900">{callsMade}</dd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50">
              <dt className="text-xs text-neutral-500">Cierres</dt>
              <dd className="text-lg font-semibold text-neutral-900">{closures}</dd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50">
              <dt className="text-xs text-neutral-500">Ticket medio</dt>
              <dd className="text-lg font-semibold text-neutral-900">
                {avgTicket > 0 ? `${avgTicket.toLocaleString()} €` : "-"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* VIDEO DE PRESENTACIÓN */}
      <section className="bg-white rounded-3xl shadow-sm border border-neutral-200 px-6 py-5 mb-10">
        <h3 className="text-sm font-medium text-neutral-900 mb-2">Video de presentación</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Un video corto aumenta tus posibilidades de ser contactado. Muestra tu personalidad y experiencia.
        </p>
        
        {profile.introVideoUrl ? (
          <div className="rounded-2xl overflow-hidden bg-neutral-100">
            <video 
              src={profile.introVideoUrl} 
              controls 
              className="w-full max-h-[400px]"
            />
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-neutral-700 mb-1">Sin video de presentación</p>
            <p className="text-xs text-neutral-500 mb-4">
              Graba un video de 1-2 minutos presentándote y destacando tu experiencia.
            </p>
            <p className="text-[11px] text-neutral-400">
              Podrás subir tu video próximamente desde Ajustes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
