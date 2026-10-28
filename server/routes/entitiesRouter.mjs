import express from 'express';
import crypto from 'node:crypto';
import { ENTITY_MODELS } from '../models/index.mjs';
import { isDbConnected } from '../db.mjs';

export const entitiesRouter = express.Router();

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function normalizeDoc(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj.id = obj._id;
  return obj;
}

// ─── Middleware: Validate Entity Name ────────────────────────────────────────

entitiesRouter.use('/entities/:entity', (req, res, next) => {
  const model = ENTITY_MODELS[req.params.entity];
  if (!model) {
    return res.status(404).json({ error: `Unknown entity "${req.params.entity}".` });
  }
  req.entityModel = model;
  next();
});

// ─── GET /api/entities/:entity (List & Filter) ───────────────────────────────

entitiesRouter.get('/entities/:entity', async (req, res) => {
  const userId = req.authUser.id;
  const { sort = '-created_date', limit = 100, ...filters } = req.query;

  try {
    const query = { userId };
    for (const [k, v] of Object.entries(filters)) {
      if (k === 'id') query._id = v;
      else query[k] = v;
    }

    const desc = String(sort).startsWith('-');
    const sortField = desc ? String(sort).slice(1) : String(sort);
    const sortObj = { [sortField === 'id' ? '_id' : sortField]: desc ? -1 : 1 };
    const limitNum = Math.max(1, Math.min(Number(limit) || 100, 500));

    const docs = await req.entityModel
      .find(query)
      .sort(sortObj)
      .limit(limitNum)
      .exec();

    res.json(docs.map(normalizeDoc));
  } catch (err) {
    console.error(`Error listing ${req.params.entity}:`, err.message);
    res.status(500).json({ error: `Failed to retrieve ${req.params.entity} records.` });
  }
});

// ─── GET /api/entities/:entity/:id (Retrieve Single Record) ───────────────────

entitiesRouter.get('/entities/:entity/:id', async (req, res) => {
  const userId = req.authUser.id;
  try {
    const doc = await req.entityModel.findOne({ _id: req.params.id, userId }).exec();
    if (!doc) {
      return res.status(404).json({ error: `Record ${req.params.id} not found.` });
    }
    res.json(normalizeDoc(doc));
  } catch (err) {
    console.error(`Error fetching ${req.params.entity}/${req.params.id}:`, err.message);
    res.status(500).json({ error: `Failed to retrieve record.` });
  }
});

// ─── POST /api/entities/:entity (Create Record) ──────────────────────────────

entitiesRouter.post('/entities/:entity', async (req, res) => {
  const userId = req.authUser.id;
  const payload = req.body || {};

  try {
    const recordId = payload.id || uid();

    // Idempotency check for CoinTransaction reference_id
    if (req.params.entity === 'CoinTransaction' && payload.reference_id) {
      const existing = await req.entityModel.findOne({
        userId,
        reference_id: payload.reference_id,
      }).exec();

      if (existing) {
        return res.json(normalizeDoc(existing)); // Return existing without duplicating
      }
    }

    const data = {
      ...payload,
      _id: recordId,
      userId,
      created_date: payload.created_date ? new Date(payload.created_date) : new Date(),
      updated_date: new Date(),
    };
    delete data.id;

    const doc = await req.entityModel.create(data);
    res.status(201).json(normalizeDoc(doc));
  } catch (err) {
    console.error(`Error creating ${req.params.entity}:`, err.message);
    res.status(500).json({ error: `Failed to create ${req.params.entity} record.` });
  }
});

// ─── PATCH / PUT /api/entities/:entity/:id (Update Record) ───────────────────

async function handleUpdate(req, res) {
  const userId = req.authUser.id;
  const updates = { ...(req.body || {}) };
  delete updates._id;
  delete updates.id;
  delete updates.userId; // Prevent user ownership tampering
  updates.updated_date = new Date();

  try {
    const doc = await req.entityModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    ).exec();

    if (!doc) {
      return res.status(404).json({ error: `Record ${req.params.id} not found.` });
    }
    res.json(normalizeDoc(doc));
  } catch (err) {
    console.error(`Error updating ${req.params.entity}/${req.params.id}:`, err.message);
    res.status(500).json({ error: `Failed to update record.` });
  }
}

entitiesRouter.patch('/entities/:entity/:id', handleUpdate);
entitiesRouter.put('/entities/:entity/:id', handleUpdate);

// ─── DELETE /api/entities/:entity/:id (Delete Record) ────────────────────────

entitiesRouter.delete('/entities/:entity/:id', async (req, res) => {
  const userId = req.authUser.id;
  try {
    const result = await req.entityModel.deleteOne({ _id: req.params.id, userId }).exec();
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: `Record ${req.params.id} not found.` });
    }
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error(`Error deleting ${req.params.entity}/${req.params.id}:`, err.message);
    res.status(500).json({ error: `Failed to delete record.` });
  }
});

// ─── POST /api/sync/migrate-local (Bulk Cloud Sync Endpoint) ─────────────────

entitiesRouter.post('/sync/migrate-local', async (req, res) => {
  const userId = req.authUser.id;
  const entityStores = req.body?.entityStores || {};

  const summary = {
    totalReceived: 0,
    migrated: 0,
    skipped: 0,
    errors: [],
  };

  for (const [entityName, records] of Object.entries(entityStores)) {
    const model = ENTITY_MODELS[entityName];
    if (!model || !Array.isArray(records)) continue;

    for (const record of records) {
      if (!record || typeof record !== 'object') continue;
      summary.totalReceived++;

      const recordId = record.id || record._id;
      if (!recordId) continue;

      try {
        const existing = await model.findOne({ _id: recordId, userId }).exec();

        if (existing) {
          // If server record exists, only update if client record is strictly newer
          const serverUpdated = new Date(existing.updated_date || existing.created_date || 0).getTime();
          const clientUpdated = new Date(record.updated_date || record.created_date || 0).getTime();

          if (clientUpdated > serverUpdated) {
            const dataToUpdate = { ...record };
            delete dataToUpdate.id;
            delete dataToUpdate._id;
            delete dataToUpdate.userId;
            dataToUpdate.updated_date = new Date(clientUpdated);

            await model.updateOne({ _id: recordId, userId }, { $set: dataToUpdate });
            summary.migrated++;
          } else {
            summary.skipped++;
          }
        } else {
          // Special idempotency check for CoinTransaction
          if (entityName === 'CoinTransaction' && record.reference_id) {
            const refDupe = await model.findOne({ userId, reference_id: record.reference_id }).exec();
            if (refDupe) {
              summary.skipped++;
              continue;
            }
          }

          const docData = {
            ...record,
            _id: recordId,
            userId,
            created_date: record.created_date ? new Date(record.created_date) : new Date(),
            updated_date: record.updated_date ? new Date(record.updated_date) : new Date(),
          };
          delete docData.id;

          await model.create(docData);
          summary.migrated++;
        }
      } catch (err) {
        summary.errors.push({ entity: entityName, id: recordId, error: err.message });
      }
    }
  }

  res.json({
    success: summary.errors.length === 0,
    summary,
  });
});
