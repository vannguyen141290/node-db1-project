const router = require('express').Router()
const { checkAccountPayload, checkAccountNameUnique, checkAccountId } = require('./accounts-middleware')
const Account = require('./accounts-model')

router.get('/', async (req, res, next) => {
  try {
    const accounts = await Account.getAll()
    res.status(200).json(accounts)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', checkAccountId, (req, res) => {
  res.status(200).json(req.found)
})

router.post('/', checkAccountPayload, async (req, res, next) => {
  try {
    const newAcc = await Account.create(req.body)
    res.status(201).json(newAcc)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try {
    const updated = await Account.updateById(req.params.id, req.body)
    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
});

router.delete('/:id', checkAccountId, async (req, res, next) => {
  try {
    const deleted = await Account.deleteById(req.params.id)
    res.status(200).json(deleted)
  } catch (err) {
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack
  })
})




module.exports = router;
