import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Pencil, X, Check, ShieldCheck, Users, Lock,
  LayoutDashboard, Bell, Calendar, FileText, School, BarChart2,
  Trophy, BookOpen, ClipboardList, Handshake, Newspaper, AlertTriangle,
  Search, UserPlus, UserMinus, Eye, Mail, RefreshCw, Clock,
} from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

// Mirrors ALL_NAV_ITEMS from Admin.jsx (excluding access-control itself)
const PAGES = [
  { id: 'overview',       label: 'Overview',       icon: LayoutDashboard },
  { id: 'announcements',  label: 'Announcements',  icon: Bell },
  { id: 'workshops',      label: 'Workshops',      icon: Calendar },
  { id: 'resources',      label: 'Resources',      icon: FileText },
  { id: 'rankings',       label: 'Rankings',       icon: BarChart2 },
  { id: 'chapters',       label: 'Chapters',       icon: School },
  { id: 'competition',    label: 'Competition',    icon: Trophy },
  { id: 'curriculum',     label: 'Curriculum',     icon: BookOpen },
  { id: 'registrations',  label: 'Registrations',  icon: ClipboardList },
  { id: 'qb-teams',       label: 'Quiz Bowl',      icon: Trophy },
  { id: 'applications',   label: 'Applications',   icon: ShieldCheck },
  { id: 'partner-events', label: 'Partner Events', icon: Handshake },
  { id: 'news',           label: 'News',           icon: Newspaper },
  { id: 'edit-website',   label: 'Edit Website',   icon: Pencil },
];

// Derive page_permissions from a role, handling legacy allowed_pages-only roles.
function resolvePermissions(role) {
  const perms = role.page_permissions || {};
  if (Object.keys(perms).length > 0) return perms;
  // backward compat: migrate allowed_pages → view-only permissions
  return Object.fromEntries((role.allowed_pages || []).map(id => [id, 'view']));
}

const inputCls = 'w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function PagePermissions({ permissions, onChange }) {
  const toggle = (id) => {
    const next = { ...permissions };
    if (next[id]) delete next[id];
    else next[id] = 'view';
    onChange(next);
  };
  const setLevel = (id, level) => onChange({ ...permissions, [id]: level });

  return (
    <div className="space-y-1.5">
      {PAGES.map(page => {
        const Icon = page.icon;
        const perm = permissions[page.id];
        const checked = !!perm;
        return (
          <div key={page.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${checked ? 'border-foreground/25 bg-foreground/5' : 'border-border'}`}>
            <button type="button" onClick={() => toggle(page.id)}
              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-foreground border-foreground' : 'border-border hover:border-muted-foreground/60'}`}>
              {checked && <Check className="w-2.5 h-2.5 text-white" />}
            </button>
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${checked ? 'text-foreground' : 'text-muted-foreground'}`} />
            <span className={`text-sm flex-1 ${checked ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              {page.label}
            </span>
            {checked && (
              <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
                {['view', 'edit'].map(level => (
                  <button key={level} type="button"
                    onClick={() => setLevel(page.id, level)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${perm === level ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {level === 'view' ? <Eye className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                    {level === 'view' ? 'View' : 'Edit'}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAccessControl() {
  const { profile: currentProfile } = useAuth();
  const [tab, setTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [roleModal, setRoleModal] = useState(null); // null | { role: obj|null }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // null | roleId
  const [roleForm, setRoleForm] = useState({ name: '', page_permissions: {} });
  const [assignModal, setAssignModal] = useState(null); // null | admin profile obj
  const [addModal, setAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addRoleId, setAddRoleId] = useState('');
  const [addSearchResult, setAddSearchResult] = useState(null);
  const [addSearching, setAddSearching] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: rolesData, error: re }, { data: adminsData, error: ae }] = await Promise.all([
        supabase.from('admin_roles').select('*').order('name'),
        supabase.from('profiles').select('id, email, full_name, admin_role_id').eq('role', 'admin').order('full_name'),
      ]);
      if (re) throw re;
      if (ae) throw ae;
      setRoles(rolesData || []);
      setAdmins(adminsData || []);
      // Load pending invites separately so a failure here never blocks roles/admins
      const { data: invitesData } = await supabase
        .from('admin_invites').select('*').eq('status', 'pending').order('invited_at', { ascending: false });
      setPendingInvites(invitesData || []);
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreateRole = () => {
    setRoleForm({ name: '', page_permissions: {} });
    setRoleModal({ role: null });
  };

  const openEditRole = (role) => {
    setRoleForm({ name: role.name, page_permissions: resolvePermissions(role) });
    setRoleModal({ role });
  };

  const saveRole = async () => {
    if (!roleForm.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const pagePermissions = roleForm.page_permissions;
      const allowedPages = Object.keys(pagePermissions);
      if (roleModal.role) {
        const { error } = await supabase.from('admin_roles').update({
          name: roleForm.name.trim(),
          page_permissions: pagePermissions,
          allowed_pages: allowedPages,
        }).eq('id', roleModal.role.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('admin_roles').insert({
          name: roleForm.name.trim(),
          page_permissions: pagePermissions,
          allowed_pages: allowedPages,
        });
        if (error) throw error;
      }
      setRoleModal(null);
      await loadData();
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (id) => {
    setSaving(true);
    setError(null);
    try {
      await supabase.from('profiles').update({ admin_role_id: null }).eq('admin_role_id', id);
      const { error } = await supabase.from('admin_roles').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirm(null);
      await loadData();
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const assignRole = async (adminId, roleId) => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from('profiles').update({ admin_role_id: roleId || null }).eq('id', adminId);
      if (error) throw error;
      setAssignModal(null);
      await loadData();
    } catch (e) {
      setError(e.message || 'Assign failed');
    } finally {
      setSaving(false);
    }
  };

  const searchUser = async () => {
    if (!addEmail.trim()) return;
    setAddSearching(true);
    setAddSearchResult(null);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('email', addEmail.trim().toLowerCase())
        .single();
      setAddSearchResult(data || 'not_found');
    } catch {
      setAddSearchResult('not_found');
    } finally {
      setAddSearching(false);
    }
  };

  const addAdmin = async () => {
    if (!addSearchResult || addSearchResult === 'not_found') return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from('profiles').update({
        role: 'admin',
        admin_role_id: addRoleId || null,
      }).eq('id', addSearchResult.id);
      if (error) throw error;
      await sendAdminEmail(addSearchResult.email, addSearchResult.full_name, 'admin-promoted', addRoleId);
      setAddModal(false);
      setAddEmail('');
      setAddRoleId('');
      setAddSearchResult(null);
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to add admin');
    } finally {
      setSaving(false);
    }
  };

  const sendInviteEmail = async () => {
    if (!addEmail.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const email = addEmail.trim().toLowerCase();
      // Cancel any existing pending invites for this email before creating a new one
      await supabase.from('admin_invites').update({ status: 'cancelled' })
        .eq('email', email).eq('status', 'pending');
      const { error: insertErr } = await supabase.from('admin_invites').insert({
        email,
        role_id: addRoleId || null,
        invited_by: currentProfile?.full_name || currentProfile?.email || 'An admin',
      });
      if (insertErr) throw insertErr;
      await sendAdminEmail(email, '', 'admin-invite', addRoleId);
      setAddModal(false);
      setAddEmail('');
      setAddRoleId('');
      setAddSearchResult(null);
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to send invite');
    } finally {
      setSaving(false);
    }
  };

  const cancelInvite = async (inviteId) => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from('admin_invites').update({ status: 'cancelled' }).eq('id', inviteId);
      if (error) throw error;
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to cancel invite');
    } finally {
      setSaving(false);
    }
  };

  const resendInvite = async (invite) => {
    setSaving(true);
    setError(null);
    try {
      await sendAdminEmail(invite.email, '', 'admin-invite', invite.role_id);
      await supabase.from('admin_invites').update({ invited_at: new Date().toISOString() }).eq('id', invite.id);
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to resend invite');
    } finally {
      setSaving(false);
    }
  };

  const removeAdmin = async (admin) => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from('profiles').update({
        role: 'student',
        admin_role_id: null,
      }).eq('id', admin.id);
      if (error) throw error;
      setRemoveConfirm(null);
      await loadData();
    } catch (e) {
      setError(e.message || 'Failed to remove admin');
    } finally {
      setSaving(false);
    }
  };

  const roleById = (id) => roles.find(r => r.id === id);

  const sendAdminEmail = async (email, name, eventType, roleId) => {
    try {
      const roleName = roleId ? roleById(roleId)?.name : null;
      await supabase.functions.invoke('send-registration-email', {
        body: {
          email,
          name: name || '',
          event_type: eventType,
          invited_by: currentProfile?.full_name || currentProfile?.email || 'An admin',
          role_name: roleName || null,
        },
      });
    } catch {
      // email failure is non-fatal
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Access Control</h2>
        <p className="text-sm text-muted-foreground mt-1">Create custom admin roles with page-level view/edit permissions, then assign them to admin users.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: 'roles', label: 'Roles', icon: Lock },
          { id: 'users', label: 'Admin Users', icon: Users },
          { id: 'invites', label: 'Pending Invites', icon: Clock, badge: pendingInvites.length },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-4 h-4" />
              {t.label}
              {t.badge > 0 && (
                <span className="ml-0.5 bg-amber-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 leading-none">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Roles tab */}
          {tab === 'roles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{roles.length} custom role{roles.length !== 1 ? 's' : ''}</p>
                <button onClick={openCreateRole}
                  className="flex items-center gap-2 bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors">
                  <Plus className="w-4 h-4" /> New Role
                </button>
              </div>

              {roles.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  No custom roles yet. Create one to restrict admin access to specific pages.
                </div>
              ) : (
                <div className="space-y-3">
                  {roles.map(role => {
                    const perms = resolvePermissions(role);
                    const entries = Object.entries(perms);
                    return (
                      <div key={role.id} className="bg-white border border-border rounded-xl p-4 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{role.name}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entries.length === 0 ? (
                              <span className="text-xs text-muted-foreground">No pages assigned</span>
                            ) : (
                              entries.map(([pid, perm]) => {
                                const pg = PAGES.find(p => p.id === pid);
                                if (!pg) return null;
                                const Icon = pg.icon;
                                return (
                                  <span key={pid}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${perm === 'edit' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-muted text-muted-foreground border-border'}`}>
                                    <Icon className="w-3 h-3" />
                                    {pg.label}
                                    <span className={`ml-0.5 ${perm === 'edit' ? 'text-blue-500' : 'text-muted-foreground/60'}`}>
                                      · {perm}
                                    </span>
                                  </span>
                                );
                              })
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {admins.filter(a => a.admin_role_id === role.id).length} user(s) assigned
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => openEditRole(role)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(role.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pending Invites tab */}
          {tab === 'invites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {pendingInvites.length} pending invite{pendingInvites.length !== 1 ? 's' : ''}
                </p>
                <button onClick={() => { setAddEmail(''); setAddRoleId(''); setAddSearchResult(null); setAddModal(true); }}
                  className="flex items-center gap-2 bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors">
                  <UserPlus className="w-4 h-4" /> Invite Admin
                </button>
              </div>
              {pendingInvites.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  No pending invites.
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingInvites.map(invite => {
                    const role = invite.role_id ? roleById(invite.role_id) : null;
                    const sentAt = new Date(invite.invited_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div key={invite.id} className="bg-white border border-amber-200 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{invite.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Invited by {invite.invited_by} · {sentAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {role ? <><Lock className="w-3 h-3" />{role.name}</> : <><ShieldCheck className="w-3 h-3" />Full Access</>}
                          </span>
                          <button
                            onClick={() => resendInvite(invite)}
                            disabled={saving}
                            title="Resend invite email"
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => cancelInvite(invite.id)}
                            disabled={saving}
                            title="Cancel invite"
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Users tab */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{admins.length} admin user{admins.length !== 1 ? 's' : ''}</p>
                <button onClick={() => { setAddEmail(''); setAddRoleId(''); setAddSearchResult(null); setAddModal(true); }}
                  className="flex items-center gap-2 bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90 transition-colors">
                  <UserPlus className="w-4 h-4" /> Add Admin
                </button>
              </div>
              {admins.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                  No admin users found.
                </div>
              ) : (
                <div className="space-y-3">
                  {admins.map(admin => {
                    const role = admin.admin_role_id ? roleById(admin.admin_role_id) : null;
                    return (
                      <div key={admin.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                          {(admin.full_name || admin.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{admin.full_name || '—'}</p>
                          <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                            {role ? <><Lock className="w-3 h-3" />{role.name}</> : <><ShieldCheck className="w-3 h-3" />Full Access</>}
                          </span>
                          <button onClick={() => setAssignModal(admin)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setRemoveConfirm(admin)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Role create/edit modal */}
      <AnimatePresence>
        {roleModal && (
          <Modal title={roleModal.role ? `Edit Role: ${roleModal.role.name}` : 'New Role'} onClose={() => setRoleModal(null)} wide>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Role Name</label>
                <input className={inputCls} placeholder="e.g. Content Manager" value={roleForm.name}
                  onChange={e => setRoleForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Page Permissions</label>
                <p className="text-xs text-muted-foreground mb-3">
                  Check pages to grant access. Choose <strong>View</strong> (read-only) or <strong>Edit</strong> (full access) per page.
                </p>
                <PagePermissions
                  permissions={roleForm.page_permissions}
                  onChange={perms => setRoleForm(p => ({ ...p, page_permissions: perms }))}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setRoleModal(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={saveRole} disabled={saving || !roleForm.name.trim()}
                  className="flex-1 bg-foreground text-white rounded-lg py-2 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : roleModal.role ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <Modal title="Delete Role" onClose={() => setDeleteConfirm(null)}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will delete the role and remove it from all assigned users (they'll revert to Full Access). This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={() => deleteRole(deleteConfirm)} disabled={saving}
                  className="flex-1 bg-destructive text-white rounded-lg py-2 text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50">
                  {saving ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Assign role modal */}
      <AnimatePresence>
        {assignModal && (
          <Modal title={`Assign Role — ${assignModal.full_name || assignModal.email}`} onClose={() => setAssignModal(null)}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Choose a role to restrict this admin's access, or set Full Access to grant all permissions.</p>
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${!assignModal.admin_role_id ? 'border-foreground bg-foreground/5' : 'border-border hover:border-muted-foreground/50'}`}
                  onClick={() => setAssignModal(a => ({ ...a, _selectedRole: null }))}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${(assignModal._selectedRole === null || (assignModal._selectedRole === undefined && !assignModal.admin_role_id)) ? 'border-foreground' : 'border-border'}`}>
                    {(assignModal._selectedRole === null || (assignModal._selectedRole === undefined && !assignModal.admin_role_id)) && (
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Full Access</p>
                    <p className="text-xs text-muted-foreground">Can access all admin pages</p>
                  </div>
                </label>
                {roles.map(role => {
                  const selected = assignModal._selectedRole === role.id ||
                    (assignModal._selectedRole === undefined && assignModal.admin_role_id === role.id);
                  const perms = resolvePermissions(role);
                  const entries = Object.entries(perms);
                  return (
                    <label key={role.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${selected ? 'border-foreground bg-foreground/5' : 'border-border hover:border-muted-foreground/50'}`}
                      onClick={() => setAssignModal(a => ({ ...a, _selectedRole: role.id }))}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-foreground' : 'border-border'}`}>
                        {selected && <div className="w-2 h-2 rounded-full bg-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{role.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entries.length} page{entries.length !== 1 ? 's' : ''}:&nbsp;
                          {entries.map(([pid, perm]) => {
                            const pg = PAGES.find(p => p.id === pid);
                            return pg ? `${pg.label} (${perm})` : null;
                          }).filter(Boolean).join(', ') || 'none'}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setAssignModal(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const roleId = assignModal._selectedRole !== undefined
                      ? assignModal._selectedRole
                      : assignModal.admin_role_id;
                    assignRole(assignModal.id, roleId);
                  }}
                  disabled={saving}
                  className="flex-1 bg-foreground text-white rounded-lg py-2 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Apply'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Admin modal */}
      <AnimatePresence>
        {addModal && (
          <Modal title="Add Admin User" onClose={() => setAddModal(false)}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">User Email</label>
                <div className="flex gap-2">
                  <input className={inputCls} placeholder="user@example.com" value={addEmail}
                    onChange={e => { setAddEmail(e.target.value); setAddSearchResult(null); }}
                    onKeyDown={e => e.key === 'Enter' && searchUser()} />
                  <button onClick={searchUser} disabled={addSearching || !addEmail.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex-shrink-0">
                    <Search className="w-4 h-4" />
                    {addSearching ? '…' : 'Find'}
                  </button>
                </div>
              </div>

              {addSearchResult === 'not_found' && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 space-y-3">
                  <p className="text-sm text-amber-800 font-medium">No existing account found for this email.</p>
                  <p className="text-xs text-amber-700">Send them an invite email with a link to create their account. You can grant admin access once they sign up.</p>
                  <div>
                    <label className="block text-xs font-medium text-amber-800 mb-1">Assign Role (optional)</label>
                    <select className={inputCls} value={addRoleId} onChange={e => setAddRoleId(e.target.value)}>
                      <option value="">Full Access</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <button onClick={sendInviteEmail} disabled={saving}
                    className="flex items-center gap-2 bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50">
                    <UserPlus className="w-4 h-4" />
                    {saving ? 'Sending…' : 'Send Invite Email'}
                  </button>
                </div>
              )}

              {addSearchResult && addSearchResult !== 'not_found' && (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border">
                    <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                      {(addSearchResult.full_name || addSearchResult.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{addSearchResult.full_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{addSearchResult.email}</p>
                    </div>
                    {addSearchResult.role === 'admin' && (
                      <span className="ml-auto text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">Already admin</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Assign Role (optional)</label>
                    <select className={inputCls} value={addRoleId} onChange={e => setAddRoleId(e.target.value)}>
                      <option value="">Full Access</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Leave as Full Access to grant all admin permissions.</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setAddModal(false)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                {addSearchResult !== 'not_found' && (
                  <button onClick={addAdmin} disabled={saving || !addSearchResult}
                    className="flex-1 bg-foreground text-white rounded-lg py-2 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50">
                    {saving ? 'Saving…' : 'Grant Admin Access'}
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Remove Admin confirm modal */}
      <AnimatePresence>
        {removeConfirm && (
          <Modal title="Remove Admin Access" onClose={() => setRemoveConfirm(null)}>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will revoke admin access for <strong>{removeConfirm.full_name || removeConfirm.email}</strong> and set their role back to student.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setRemoveConfirm(null)}
                  className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={() => removeAdmin(removeConfirm)} disabled={saving}
                  className="flex-1 bg-destructive text-white rounded-lg py-2 text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50">
                  {saving ? 'Removing…' : 'Remove Access'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
