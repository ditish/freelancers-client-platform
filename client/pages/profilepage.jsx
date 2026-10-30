import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdMenu, MdCameraAlt } from "react-icons/md";
import { useSidebar } from "../Context/SidebarContext";
import { fetchProfile, uploadAvatar } from "../src/features/profile/profileSlice";
import { assignDirectTasks, fetchTasks } from "../src/features/task/taskslice";
import EditProfileModal from "./Editprofilepage";
import SocialLinks, { normalizeUrl } from "../components/Sociallinks";

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileRef = useRef();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { user: me } = useSelector((s) => s.auth); // adjust to your auth slice
  const { user, stats, recentProjects, loading } = useSelector((s) => s.profile);
  const { tasks = [] } = useSelector((s) => s.tasks); // adjust to your task slice name/shape

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [assigning, setAssigning] = useState(false);

  // ---- who is being viewed ----
  const isOwner = !id || id === me?._id;
  const isFreelancer = user?.role === "freelancer";
  const isClient = user?.role === "client";
  const isCompany = isClient && user?.clientType === "company"; // <-- adjust field name if different
  const isIndividualClient = isClient && !isCompany;

  const showSkillsEducation = isFreelancer; // freelancer only
  const showExperience = isFreelancer || isIndividualClient; // freelancer + individual client

  const canAssign = !isOwner && me?.role === "client" && isFreelancer;

  useEffect(() => {
    dispatch(fetchProfile(isOwner ? undefined : id));
  }, [dispatch, id, isOwner]);

  useEffect(() => {
    if (canAssign) dispatch(fetchTasks());
  }, [dispatch, canAssign]);

  // only tasks that can still be assigned (adjust field names to your Task schema)
  const assignableTasks = useMemo(
    () =>
      tasks.filter(
        (t) => t.createdBy === me?._id && !t.assignedTo && t.status === "pending"
      ),
    [tasks, me]
  );

  const onPickAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");
    setUploading(true);
    await dispatch(uploadAvatar(file));
    setUploading(false);
  };

  const handleAssign = async () => {
    if (selectedTasks.length === 0) return;
    setAssigning(true);
    const result = await dispatch(
      assignDirectTasks({ taskIds: selectedTasks, assignedTo: user._id })
    );
    setAssigning(false);

    if (assignDirectTasks.fulfilled.match(result)) {
      setSelectedTasks([]);
      dispatch(fetchTasks()); // refresh so assigned tasks disappear from the list
    } else {
      alert(result.payload || "Failed to assign tasks");
    }
  };

  const toggleTask = (taskId) =>
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((x) => x !== taskId) : [...prev, taskId]
    );

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "";

  const fmtFull = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  if (loading || !user) return <p className="text-white/50 p-6">Loading...</p>;

  // company clients are shown by company name instead of personal name
  const displayName = isCompany ? user.companyName || user.name : user.name;
  const roleLabel = isFreelancer
    ? "Freelancer"
    : isCompany
    ? "Company"
    : "Individual client";
  const companyWebsite = user.companyWebsite || user.website;
  console.log("profile user:", user);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white space-y-6">
      {!sidebarOpen && (
        <MdMenu
          className="fixed top-4 left-4 z-30 text-2xl cursor-pointer text-white/80"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* ================= Header ================= */}
      <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative">
          <img
            src={
              user.avatar?.url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                displayName || "User"
              )}&background=7c6cf6&color=fff`
            }
            alt={displayName}
            className="w-28 h-28 rounded-full object-cover border-2 border-white/20"
          />
          {isOwner && (
            <>
              <button
                onClick={() => fileRef.current.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 rounded-full btn-accent"
              >
                <MdCameraAlt />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onPickAvatar}
              />
            </>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-display font-bold">{displayName}</h1>

          {/* headline + bio + social links: not for companies */}
          {!isCompany && user.headline && (
            <p className="text-white/70">{user.headline}</p>
          )}
          {user.location && (
            <p className="text-white/50 text-sm">{user.location}</p>
          )}
          <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-white/10">
            {roleLabel}
          </span>

          {isCompany ? (
            companyWebsite && (
              <div className="mt-4">
                <a
                  href={normalizeUrl(companyWebsite)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#7c6cf6]"
                >
                  {companyWebsite}
                </a>
              </div>
            )
          ) : (
            <>
              <p className="mt-4 text-white/80 whitespace-pre-line">
                {user.bio ||
                  (isOwner ? "Add a bio to introduce yourself." : "")}
              </p>
              <SocialLinks
                links={{
                  ...user.socialLinks,
                  portfolio:
                    user.socialLinks?.portfolio ||
                    (isFreelancer ? user.website : ""),
                }}
              />
            </>
          )}

          <div className="mt-4 flex gap-3 justify-center sm:justify-start">
            {isOwner && (
              <button
                className="btn-ghost px-4 py-2 rounded-lg"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
            {canAssign && (
              <button
                className="px-4 py-2 btn-accent rounded-lg disabled:opacity-50"
                onClick={handleAssign}
                disabled={selectedTasks.length === 0 || assigning}
              >
                {assigning
                  ? "Assigning..."
                  : `Assign${selectedTasks.length ? ` (${selectedTasks.length})` : ""}`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============ Task picker (client viewing a freelancer) ============ */}
      {canAssign && (
        <Section title="Select tasks to assign">
          {assignableTasks.length ? (
            assignableTasks.map((t) => (
              <label
                key={t._id}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selectedTasks.includes(t._id)}
                  onChange={() => toggleTask(t._id)}
                />
                <div>
                  <p className="font-semibold text-sm">{t.title}</p>
                  <p className="text-xs text-white/50 line-clamp-2">
                    {t.description}
                  </p>
                </div>
              </label>
            ))
          ) : (
            <p className="text-white/40">You have no unassigned tasks.</p>
          )}
        </Section>
      )}

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-3 gap-4">
        <Stat
          title={isFreelancer ? "Total Projects" : "Projects Posted"}
          value={stats?.total ?? 0}
        />
        <Stat title="Completed" value={stats?.completed ?? 0} />
        <Stat title="Ongoing" value={stats?.ongoing ?? 0} />
      </div>

      {/* ============ Company client: company details ============ */}
      {isCompany && (
        <Section title="About the company">
          {user.companyDescription || user.companyName || companyWebsite ? (
            <div className="space-y-3">
              {user.companyDescription ? (
                <p className="text-white/80 whitespace-pre-line">
                  {user.companyDescription}
                </p>
              ) : (
                isOwner && (
                  <p className="text-white/40">
                    Add a description so freelancers know who you are.
                  </p>
                )
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {user.companyName && (
                  <div>
                    <p className="text-white/40 text-xs">Company name</p>
                    <p className="font-semibold">{user.companyName}</p>
                  </div>
                )}
                {user.companyLocation && (
                  <div>
                    <p className="text-white/40 text-xs">Location</p>
                    <p className="font-semibold">{user.companyLocation}</p>
                  </div>
                )}
                {user.establishedDate && (
                  <div>
                    <p className="text-white/40 text-xs">Established</p>
                    <p className="font-semibold">{fmtFull(user.establishedDate)}</p>
                  </div>
                )}
                {companyWebsite && (
                  <div>
                    <p className="text-white/40 text-xs">Website</p>
                    <a
                      href={normalizeUrl(companyWebsite)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#7c6cf6] break-all"
                    >
                      {companyWebsite}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-white/40">No company details added</p>
          )}
        </Section>
      )}

      {/* ============ Freelancer only: skills + education ============ */}
      {showSkillsEducation && (
        <>
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {user.skills?.length ? (
                user.skills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-sm">
                    {s}
                  </span>
                ))
              ) : (
                <p className="text-white/40">No skills added</p>
              )}
            </div>
          </Section>

          <Section title="Education">
            {user.education?.length ? (
              user.education.map((e, i) => (
                <div key={e._id || i} className="mb-3">
                  <p className="font-semibold">{e.school}</p>
                  <p className="text-sm text-white/60">
                    {e.degree} {e.field && `· ${e.field}`}
                  </p>
                  <p className="text-xs text-white/40">
                    {e.startYear} – {e.endYear || "Present"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white/40">No education added</p>
            )}
          </Section>
        </>
      )}

      {/* ====== Freelancer + individual client: work experience ====== */}
      {showExperience && (
        <Section title="Work Experience">
          {user.experience?.length ? (
            user.experience.map((x, i) => (
              <div key={x._id || i} className="mb-3">
                <p className="font-semibold">{x.title}</p>
                <p className="text-sm text-white/60">
                  {x.company}
                  {x.location && ` · ${x.location}`}
                </p>
                <p className="text-xs text-white/40">
                  {fmt(x.startDate)} –{" "}
                  {x.current ? "Present" : fmt(x.endDate) || "Present"}
                </p>
                {x.description && (
                  <p className="text-sm text-white/70 mt-1 whitespace-pre-line">
                    {x.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-white/40">No work experience added</p>
          )}
        </Section>
      )}

      {/* ================= Both ================= */}
      <Section
        title={isFreelancer ? "Completed Projects" : "Recent Completed Projects"}
      >
        {recentProjects?.length ? (
          recentProjects.map((p) => (
            <div
              key={p._id}
              className="bg-white/5 border border-white/10 rounded-lg p-3 mb-2"
            >
              <p className="font-semibold text-sm">{p.title}</p>
              <p className="text-xs text-white/50 line-clamp-2">{p.description}</p>
            </div>
          ))
        ) : (
          <p className="text-white/40">Nothing here yet</p>
        )}
      </Section>

      {editing && (
        <EditProfileModal user={user} onClose={() => setEditing(false)} />
      )}
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="glass-card rounded-xl p-6">
    <h2 className="text-lg font-display font-bold mb-3">{title}</h2>
    {children}
  </div>
);

const Stat = ({ title, value }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
    <p className="text-sm text-white/50">{title}</p>
    <p className="text-2xl font-display font-bold">{value}</p>
  </div>
);

export default ProfilePage;