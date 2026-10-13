import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../src/features/profile/profileSlice";

const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#7c6cf6]";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const EditProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const isFreelancer = user.role === "freelancer";
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    name: user.name || "",
    headline: user.headline || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    company: user.company || "",
    skills: user.skills || [],
    education: user.education || [],
    experience: user.experience || [],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ---- skills ----
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) set("skills", [...form.skills, s]);
    setSkillInput("");
  };
  const removeSkill = (s) => set("skills", form.skills.filter((x) => x !== s));

  // ---- education / experience (generic helpers) ----
  const addItem = (key, empty) => set(key, [...form[key], empty]);
  const removeItem = (key, i) => set(key, form[key].filter((_, idx) => idx !== i));
const changeItem = (key, i, updates) =>
  setForm((prev) => ({
    ...prev,
    [key]: prev[key].map((item, idx) =>
      idx === i ? { ...item, ...updates } : item
    ),
  }));

  const save = async () => {
    if (!form.name.trim()) return alert("Name is required");
    try {
      setSaving(true);
      await dispatch(updateProfile(form));
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel text-white w-full max-w-2xl rounded-xl flex flex-col max-h-[90vh]">
        <h3 className="text-xl font-display font-bold p-6 pb-3">Edit Profile</h3>

        <div className="overflow-y-auto px-6 space-y-4">
          <input className={input} placeholder="Name" value={form.name}
                 onChange={(e) => set("name", e.target.value)} />
          <input className={input} placeholder="Headline (e.g. Full-stack Developer)" maxLength={100}
                 value={form.headline} onChange={(e) => set("headline", e.target.value)} />
          <input className={input} placeholder="Location" value={form.location}
                 onChange={(e) => set("location", e.target.value)} />
          <div>
            <textarea className={input} rows={4} placeholder="Bio" maxLength={500}
                      value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            <p className="text-xs text-white/40 text-right">{form.bio.length}/500</p>
          </div>

          {/* Client-only */}
          {!isFreelancer && (
            <input className={input} placeholder="Company name" value={form.company}
                   onChange={(e) => set("company", e.target.value)} />
          )}
          <input className={input} placeholder="Website" value={form.website}
                 onChange={(e) => set("website", e.target.value)} />

          {/* Freelancer-only */}
          {isFreelancer && (
            <>
              {/* Skills */}
              <div>
                <p className="font-semibold mb-2">Skills</p>
                <div className="flex gap-2">
                  <input className={input} placeholder="Add a skill and press Enter" value={skillInput}
                         onChange={(e) => setSkillInput(e.target.value)}
                         onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
                  <button type="button" className="btn-ghost px-4 rounded-lg" onClick={addSkill}>Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.skills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-2">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="text-white/50 hover:text-white">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Education</p>
                  <button type="button" className="text-sm text-[#7c6cf6]"
                    onClick={() => addItem("education", { school: "", degree: "", field: "", startYear: "", endYear: "" })}>
                    + Add
                  </button>
                </div>
                {form.education.map((e, i) => (
                  <div key={e._id || i} className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 space-y-2">
                    <input className={input} placeholder="School" value={e.school}
                             onChange={(ev) =>
    changeItem("education", i, {
      school: ev.target.value
    })
  } />
                    <div className="grid grid-cols-2 gap-2">
                      <input className={input} placeholder="Degree" value={e.degree || ""}
                              onChange={(ev) =>
    changeItem("education", i, {
      degree: ev.target.value
    })
  } />
                      <input className={input} placeholder="Field of study" value={e.field || ""}
                              onChange={(ev) =>
    changeItem("education", i, {
      field: ev.target.value
    })
  } />
                      <input className={input} type="number" placeholder="Start year" value={e.startYear || ""}
                              onChange={(ev) =>
    changeItem("education", i, {
      startYear: ev.target.value
    })
  } />
                      <input className={input} type="number" placeholder="End year" value={e.endYear || ""}
                            onChange={(ev) =>
    changeItem("education", i, {
      endYear: ev.target.value
    })
  } />
                    </div>
                    <button type="button" className="text-xs text-red-400" onClick={() => removeItem("education", i)}>Remove</button>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">Work Experience</p>
                  <button type="button" className="text-sm text-[#7c6cf6]"
                    onClick={() => addItem("experience", { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" })}>
                    + Add
                  </button>
                </div>
                {form.experience.map((x, i) => (
                  <div key={x._id || i} className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input className={input} placeholder="Job title" value={x.title}
                              onChange={(ev) =>
    changeItem("experience", i, {
      title: ev.target.value
    })
  } />
                      <input className={input} placeholder="Company" value={x.company}
                              onChange={(ev) =>
    changeItem("experience", i, {
      company: ev.target.value
    })
  }/>
                      <input className={input} type="date" value={toDateInput(x.startDate)}
                             onChange={(ev) =>
    changeItem("experience", i, {
      startDate: ev.target.value
    })
  } />
                      <input className={input} type="date" disabled={x.current} value={x.current ? "" : toDateInput(x.endDate)}
                              onChange={(ev) =>
    changeItem("experience", i, {
      endDate: ev.target.value
    })
  } />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-white/70">
                      <input type="checkbox" checked={x.current} className="accent-[#7c6cf6]"
                            onChange={(ev) => {
  const checked = ev.target.checked;

  changeItem("experience", i, {
    current: checked,
    ...(checked && { endDate: null }),
  });
}}/>
                      I currently work here
                    </label>
                    <textarea className={input} rows={2} maxLength={500} placeholder="Description" value={x.description || ""}
                               onChange={(ev) =>
    changeItem("experience", i, {
      description: ev.target.value
    })
  }/>
                    <button type="button" className="text-xs text-red-400" onClick={() => removeItem("experience", i)}>Remove</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-white/10 mt-4">
          <button className="px-4 py-2 btn-ghost rounded-lg" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 btn-accent rounded-lg disabled:opacity-50" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;