function buildQuery(body) {
  let query = {}
  for (f in body) {
    let vl = body[f];
    if (!vl || (vl && !vl.length)) { continue }
    if (['_in'].indexOf(f.substring(f.length - 3)) != -1) {
      query = Object.assign(query, { [f.substring(0, f.length - 3)]: { $in: vl } })
    } else {
      query = Object.assign(query, { [f]: vl })
    }
  }
  return query;
}

module.exports = { buildQuery }