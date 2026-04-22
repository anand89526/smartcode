/* eslint-disable @typescript-eslint/no-require-imports */
const User = require("../models/User")

async function recomputeRankings() {
  const users = await User.find().sort({
    points: -1,
    solvedProblems: -1,
    acceptedSubmissions: -1,
    streak: -1,
    createdAt: 1
  })

  await Promise.all(
    users.map((user, index) => {
      user.rank = index + 1
      return user.save()
    })
  )

  return users
}

module.exports = {
  recomputeRankings
}
