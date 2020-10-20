// const { remoteMongoJoin } = require(path.resolve('./src/core/businesses/common.js'));

module.exports = { timeout, remoteMongoJoin }

function timeout(time) {
  return new Promise(setTimeout(resolve, time))
}

async function remoteMongoJoin({ source, dest }) {
  if (!(Array.isArray(source.items) && source.items.length > 0)) { return }

  source.empty_keys = source.empty_keys || [null, undefined, ''];
  dest.default_value = dest.default_value || {};
  dest.limit = dest.limit || 100000;
  dest.join = dest.join || _joinData;

  let keys = [];

  for (let i in source.items) {
    let item = source.items[i];
    if (typeof item.toObject === 'function') {
      item = item.toObject();
      source.items[i] = item;
    }
    if (!source.empty_keys.includes(item[source.key])) {
      if (!keys.includes(item[source.key])) {
        keys.push(item[source.key])
      }
    }
  }

  if (keys.length === 0) {
    _assignDefault({ source, dest });
    return;
  }

  let filter = dest.filter(keys);

  if (typeof dest.find === 'function') {
    dest.items = await dest.find(filter, { keys, source, dest });
  }
  else {
    if (dest.model) {
      dest.items = await dest.model.find(filter, dest.fields).limit(dest.limit).lean(true);
    }
    else if (dest.service) {
      dest.items = await dest.service.find({ filter, fields: dest.fields, limit: dest.limit });
    }
  }

  if (!(Array.isArray(dest.items) && dest.items.length > 0)) {
    _assignDefault({ source, dest });
    return;
  }

  dest.join({ source, dest });
};

function _joinData({ source, dest }) {
  for (let s_item of source.items) {
    let d_item = dest.items.find(item => item[dest.key] == s_item[source.key]);

    if (d_item === undefined) {
      d_item = dest.default_value;
    }

    source.assign(s_item, d_item);
  }
}

function _assignDefault({ source, dest }) {
  for (let s_item of source.items) {
    source.assign(s_item, dest.default_value);
  }
}