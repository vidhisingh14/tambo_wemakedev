"use client";

import { ApplicationTracker } from "@/components/tambo/application-tracker";
import { useUserData } from "@/hooks/use-user-data";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function TrackerPage() {
  const { user } = useAuth();
  const { applications, loading, error } = useUserData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied" as const,
    applied_date: new Date().toISOString().split('T')[0],
    location: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            user_id: user.id,
            company: formData.company,
            role: formData.role,
            status: formData.status,
            applied_date: formData.applied_date,
            location: formData.location || null,
            notes: formData.notes || null,
            company_logo: `https://logo.clearbit.com/${formData.company.toLowerCase().replace(/\s/g, '')}.com`
          }
        ]);

      if (error) throw error;

      // Reset form
      setFormData({
        company: "",
        role: "",
        status: "Applied",
        applied_date: new Date().toISOString().split('T')[0],
        location: "",
        notes: ""
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error adding application:', err);
      alert('Failed to add application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0df2a6] mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          Error loading applications: {error}
        </div>
      </div>
    );
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'OA Pending').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length
  };

  const trackerData = {
    stats,
    applications: applications.map(app => ({
      company: app.company,
      logo: app.company_logo || `https://logo.clearbit.com/${app.company.toLowerCase().replace(/\s/g, '')}.com`,
      role: app.role,
      location: app.location || "Remote",
      status: app.status,
      stage: app.stage || "",
      nextStep: app.next_step || "",
      appliedDate: app.applied_date ? new Date(app.applied_date).toLocaleDateString() : ""
    }))
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Add Application Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Application Tracker</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-[#0df2a6] hover:bg-[#0bc98b] text-[#101010] px-4 py-2 rounded-lg font-semibold transition-all"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Application
            </>
          )}
        </button>
      </div>

      {/* Add Application Form */}
      {showAddForm && (
        <div className="bg-[#101413] border border-[#22493c]/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">New Application</h2>
          <form onSubmit={handleAddApplication} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0df2a6]"
                placeholder="e.g., Google"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0df2a6]"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0df2a6]"
              >
                <option value="Applied">Applied</option>
                <option value="OA Pending">OA Pending</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Applied Date
              </label>
              <input
                type="date"
                value={formData.applied_date}
                onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
                className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0df2a6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0df2a6]"
                placeholder="e.g., Remote, San Francisco, CA"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full bg-[#0a0f0d] border border-[#22493c] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0df2a6]"
                placeholder="Any additional notes..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#0df2a6] hover:bg-[#0bc98b] text-[#101010] px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Adding...' : 'Add Application'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Application Tracker Component */}
      {applications.length > 0 ? (
        <ApplicationTracker {...trackerData} />
      ) : (
        <div className="bg-[#101413] border border-[#22493c]/50 rounded-xl p-12 text-center">
          <p className="text-slate-400 mb-4">No applications yet. Start tracking your job applications!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#0df2a6] hover:bg-[#0bc98b] text-[#101010] px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Add Your First Application
          </button>
        </div>
      )}
    </div>
  );
}
