const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { validateUserCredentials } = require('./utils/auth');
const { createReimbursement, updateReimbursementStatus } = require('./utils/reimbursement');

const app = express();
const PORT = 3001;
const SECRET = 'your_jwt_secret';

app.use(cors());
app.use(bodyParser.json());

const reimbursements = [];

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      errorCode: 'AUTH001',
      errorType: 'Unauthorized',
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      errorCode: 'AUTH002',
      errorType: 'Unauthorized',
      message: 'Invalid token'
    });
  }
}

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = validateUserCredentials(username, password);

  if (!user) {
    return res.status(401).json({
      errorCode: 'AUTH003',
      errorType: 'InvalidCredentials',
      message: 'Invalid username or password'
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

// Get reimbursements (with optional search)
app.get('/api/reimbursements', authenticate, (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || '';

    let filtered = reimbursements;

    // Filter for regular users
    if (req.user.role !== 'admin') {
      filtered = filtered.filter(r => r.userId === req.user.id);
    }

    // Apply search filter
    if (search) {
      filtered = filtered.filter(r =>
        r.description?.toLowerCase().includes(search)
      );
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({
      errorCode: 'SRV001',
      errorType: 'ServerError',
      message: 'Unable to fetch reimbursements'
    });
  }
});


// Create new reimbursement
app.post('/api/reimbursements', authenticate, (req, res) => {
  const result = createReimbursement(req.body, req.user.id);

  if (result.error) {
    const statusCode = result.error.errorType === 'ValidationError' ? 422 : 400;
    return res.status(statusCode).json(result.error);
  }

  reimbursements.push(result.reimbursement);
  res.status(201).json(result.reimbursement);
});

// Update reimbursement status (admin only)
app.patch('/api/reimbursements/:id/status', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const reimbursement = reimbursements.find(r => r.id === id);

  if (!reimbursement) {
    return res.status(404).json({
      errorCode: 'NOT_FOUND',
      errorType: 'ResourceNotFound',
      message: 'Reimbursement not found'
    });
  }

  const { status } = req.body;
  const result = updateReimbursementStatus(reimbursement, status, req.user.role);

  if (result.error) {
    const statusCode = result.error.errorType === 'ValidationError' ? 422 : 403;
    return res.status(statusCode).json(result.error);
  }

  res.json(result.reimbursement);
});

// Delete reimbursement
app.delete('/api/reimbursements/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    const index = reimbursements.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            errorCode: 'NOT_FOUND',
            errorType: 'ResourceNotFound',
            message: 'Reimbursement not found'
        });
    }

    // Samo vlasnik ili admin može obrisati
    const reimbursement = reimbursements[index];
    if (reimbursement.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            errorCode: 'AUTH005',
            errorType: 'Forbidden',
            message: 'You are not allowed to delete this reimbursement'
        });
    }

    reimbursements.splice(index, 1);
    res.status(204).send();
});

// Update reimbursement (PUT)
app.put('/api/reimbursements/:id', authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    const reimbursement = reimbursements.find(r => r.id === id);

    if (!reimbursement) {
        return res.status(404).json({
            errorCode: 'NOT_FOUND',
            errorType: 'ResourceNotFound',
            message: 'Reimbursement not found'
        });
    }

    // Samo vlasnik može urediti
    if (reimbursement.userId !== req.user.id) {
        return res.status(403).json({
            errorCode: 'AUTH006',
            errorType: 'Forbidden',
            message: 'You are not allowed to edit this reimbursement'
        });
    }

    const result = createReimbursement(req.body, req.user.id);
    if (result.error) {
        const statusCode = result.error.errorType === 'ValidationError' ? 422 : 400;
        return res.status(statusCode).json(result.error);
    }

    reimbursement.amount = result.reimbursement.amount;
    reimbursement.description = result.reimbursement.description;
    reimbursement.type = result.reimbursement.type;

    res.json(reimbursement);
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;