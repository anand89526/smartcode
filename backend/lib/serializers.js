function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || "",
    headline: user.headline || "Competitive programmer leveling up every day.",
    solvedProblems: user.solvedProblems,
    rank: user.rank,
    streak: user.streak,
    battleWins: user.battleWins,
    contests: user.contests,
    points: user.points,
    level: user.level,
    country: user.country,
    bio: user.bio,
    totalSubmissions: user.totalSubmissions || 0,
    acceptedSubmissions: user.acceptedSubmissions || 0,
    solvedProblemIds: (user.solvedProblemIds || []).map((id) => id.toString()),
    lastSolvedAt: user.lastSolvedAt || null,
    lastActiveAt: user.lastActiveAt || null,
    createdAt: user.createdAt || null
  }
}

module.exports = {
  serializeUser
}
