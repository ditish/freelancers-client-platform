import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../src/features/profile/profileSlice";

const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#7c6cf6]";

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const EditProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const isFreelancer = user.role === "freelancer";
   const isClient = user.role === "client";
  const isCompany = isClient && user.clientType === "company"; // <-- adjust
  const isIndividualClient = isClient && !isCompany;
   const showSkillsEducation = isFreelancer;
  const showExperience = isFreelancer || isIndividualClient;
  const showPersonalFields = !isCompany; // name, headline, bio, social links
  
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    name: user.name || "",
    headline: user.headline || "",
    bio: user.bio || "",
    location: user.location || "",
    company: user.company || "",
    skills: user.skills || [],
    education: user.education || [],
    experience: user.experience || [],
    socialLinks: {
      github: user.socialLinks?.github || "",
      linkedin: user.socialLinks?.linkedin || "",
      portfolio: user.socialLinks?.portfolio || "",
    },
     // company
    companyName: user.companyName || "",
    companyDescription: user.companyDescription || "",
    establishedDate: user.establishedDate || "",
    companyWebsite: user.companyWebsite || "",
    companyLocation:user.companyLocation || "",
    
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
    let payload;

    if (isCompany) {
      if (!form.companyName.trim()) return alert("Company name is required");
      if (!form.companyDescription.trim()) return alert("Company role is required");
      if (!form.establishedDate.trim()) return alert("Company established is required");
      if (!form.companyLocation.trim()) return alert("Company location  is required");
     payload = {
  companyName: form.companyName.trim(),
  companyDescription: form.companyDescription.trim(),
  establishedDate: form.establishedDate || null,
  companyWebsite: form.companyWebsite.trim(),
  companyLocation: form.companyLocation.trim(),
};
    } else {
      if (!form.name.trim()) return alert("Name is required");

      const incomplete = showExperience && form.experience.some(
        (x) => (x.title?.trim() || x.company?.trim()) && !(x.title?.trim() && x.company?.trim())
      );
      if (incomplete) return alert("Each work experience needs a job title and company.");

      payload = {
        name: form.name,
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        socialLinks: form.socialLinks,
      };
      if (showSkillsEducation) {
        payload.skills = form.skills;
        payload.education = form.education.filter((e) => e.school?.trim());
      }
      if (showExperience) {
        payload.experience = form.experience.filter((x) => x.title?.trim() && x.company?.trim());
      }
    }

    try {
      setSaving(true);
      await dispatch(updateProfile(payload));
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };
  const handleSocialChange = (e) =>
  setForm((f) => ({
    ...f,
    socialLinks: { ...f.socialLinks, [e.target.name]: e.target.value },
  }));
  const toDateInput = (d) =>
  d ? new Date(d).toISOString().slice(0, 10) : "";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel text-white w-full max-w-2xl rounded-xl flex flex-col max-h-[90vh]">
        <h3 className="text-xl font-display font-bold p-6 pb-3">Edit Profile</h3>

       <div className="overflow-y-auto px-6 space-y-4">
  {isCompany ? (
    <>
      <input className={input} placeholder="Company name" value={form.companyName}
             onChange={(e) => set("companyName", e.target.value)} />
      <input className={input} placeholder="Location" value={form.companyLocation}
             onChange={(e) => set("companyLocation", e.target.value)} />
      <div>
        <textarea className={input} rows={4} maxLength={1000} placeholder="About the company"
                  value={form.companyDescription}
                  onChange={(e) => set("companyDescription", e.target.value)} />
        <p className="text-xs text-white/40 text-right"> {(form.companyDescription || "").length}/1000</p>
      </div>
      <div>
        <label className="text-xs text-white/50 mb-1 block">Established date</label>
        <input className={input} type="date" value={toDateInput(form.establishedDate)}
               max={new Date().toISOString().slice(0, 10)}
               onChange={(e) => set("establishedDate", e.target.value)} />
      </div>
      <input className={input} type="url" placeholder="Company website (https://...)"
             value={form.companyWebsite}
             onChange={(e) => set("companyWebsite", e.target.value)} />
    </>
  ) : (
    <>
      {/* ---- common personal fields (freelancer + individual client) ---- */}
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
      <input name="github" className={input} placeholder="GitHub profile URL"
             value={form.socialLinks.github} onChange={handleSocialChange} />
      <input name="linkedin" className={input} placeholder="LinkedIn profile URL"
             value={form.socialLinks.linkedin} onChange={handleSocialChange} />
      <input name="portfolio" className={input} placeholder="Portfolio website URL"
             value={form.socialLinks.portfolio} onChange={handleSocialChange} />

      {/* ---- Skills + Education: freelancer only ---- */}
      {showSkillsEducation && (
        <>
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
        </>
      )}

      {/* ---- Experience: freelancer + individual client ---- */}
      {showExperience && (
        <>
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