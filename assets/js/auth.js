const db = window.kabayanSupabase;

async function getSessionUser() {
  const { data, error } = await db.auth.getSession();
  if (error) throw error;
  return data.session?.user ?? null;
}

async function getMyProfile() {
  const user = await getSessionUser();
  if (!user) return null;

  const { data, error } = await db
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    location.replace("login.html");
    throw new Error("AUTH_REQUIRED");
  }
  return user;
}

async function requireRole(expectedRole) {
  await requireAuth();
  const profile = await getMyProfile();

  if (!profile || profile.role !== expectedRole) {
    location.replace("ruang-belajar.html");
    throw new Error("ROLE_NOT_ALLOWED");
  }
  return profile;
}

async function signOut() {
  await db.auth.signOut();
  location.replace("login.html");
}

window.KabayanAuth = {
  getSessionUser,
  getMyProfile,
  requireAuth,
  requireRole,
  signOut
};
