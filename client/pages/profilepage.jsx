import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdMenu, MdCameraAlt } from "react-icons/md";
import { useSidebar } from "../../Context/SidebarContext";
import { fetchProfile, uploadAvatar } from "../../src/features/profile/profileSlice";
import { assignDirectTasks, fetchTasks } from "../../src/features/task/taskslice";
import EditProfileModal from "./Editprofilepage";

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const fileRef = useRef();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { user: me } = useSelector((s) => s.auth);          // adjust to your auth slice
  const { user, stats, recentProjects, loading } = useSelector((s) => s.profile);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isOwner = !id || id === me?._id;
  const isFreelancer = user?.role === "freelancer";
  const canAssign = !isOwner && me?.role === "client" && isFreelancer;

  useEffect(() => { dispatch(fetchProfile(isOwner ? undefined : id)); }, [dispatch, id, isOwner]);

  const onPickAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");
    setUploading(true);
    await dispatch(uploadAvatar(file));
    setUploading(false);
  };

  if (loading || !user) return <p className="text-white/50 p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-white space-y-6">
      {!sidebarOpen && (
        <MdMenu className="fixed top-4 left-4 z-30 text-2xl cursor-pointer text-white/80"
                onClick={() => setSidebarOpen(true)} />
      )}

      {/* Header */}
      <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative">
          <img
            src={user.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c6cf6&color=fff`}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-2 border-white/20"
          />
          {isOwner && (
            <>
              <button onClick={() => fileRef.current.click()} disabled={uploading}
                className="absolute bottom-0 right-0 p-2 rounded-full btn-accent">
                <MdCameraAlt />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
            </>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-display font-bold">{user.name}</h1>
          {user.headline && <p className="text-white/70">{user.headline}</p>}
          <p className="text-white/50 text-sm">{user.location}</p>
          <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-white/10 capitalize">{user.role}</span>
          <p className="mt-4 text-white/80 whitespace-pre-line">{user.bio || (isOwner ? "Add a bio to introduce yourself." : "")}</p>

          <div className="mt-4 flex gap-3 justify-center sm:justify-start">
            {isOwner && <button className="btn-ghost px-4 py-2 rounded-lg" onClick={() => setEditing(true)}>Edit Profile</button>}
            {canAssign && <AssignTasksButton freelancerId={user._id} />}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Stat title={isFreelancer ? "Total Projects" : "Projects Posted"} value={stats.total} />
        <Stat title="Completed" value={stats.completed} />
        <Stat title="Ongoing" value={stats.ongoing} />
      </div>

      {/* Freelancer-only */}
      {isFreelancer && (
        <>
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {user.skills?.length
                ? user.skills.map((s) => <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-sm">{s}</span>)
                : <p className="text-white/40">No skills added</p>}
            </div>
          </Section>

          <Section title="Education">
            {user.education?.length ? user.education.map((e, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold">{e.school}</p>
                <p className="text-sm text-white/60">{e.degree} {e.field && `· ${e.field}`}</p>
                <p className="text-xs text-white/40">{e.startYear} – {e.endYear || "Present"}</p>
              </div>
            )) : <p className="text-white/40">No education added</p>}
          </Section>
        </>
      )}

      {/* Client-only */}
      {!isFreelancer && (user.companyName || user.website) && (
        <Section title="Company">
          <p className="font-semibold">{user.companyName}</p>
          {user.website && <a href={user.website} target="_blank" rel="noreferrer" className="text-sm text-[#7c6cf6]">{user.website}</a>}
        </Section>
      )}

      {/* Both */}
      <Section title={isFreelancer ? "Completed Projects" : "Recent Completed Projects"}>
        {recentProjects.length ? recentProjects.map((p) => (
          <div key={p._id} className="bg-white/5 border border-white/10 rounded-lg p-3 mb-2">
            <p className="font-semibold text-sm">{p.title}</p>
            <p className="text-xs text-white/50 line-clamp-2">{p.description}</p>
          </div>
        )) : <p className="text-white/40">Nothing here yet</p>}
      </Section>

      {editing && <EditProfileModal user={user} onClose={() => setEditing(false)} />}
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