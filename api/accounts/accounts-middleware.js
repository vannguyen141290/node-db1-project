const Account = require('./accounts-model')
const yup = require('yup')


const accountSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .typeError('name of account must be a string')
    .required('name and budget are required')
    .min(3, 'name of account must be between 3 and 100')
    .max(100, 'name of account must be between 3 and 100'),
  budget: yup
    .number()
    .typeError('budget of account must be a number')
    .required('name and budget are required')
    .min(0, 'budget of account is too large or too small')
    .max(1000000, 'budget of account is too large or too small')
})

exports.checkAccountPayload = async (req, res, next) => {
  const error = { status: 400 }
  try {
    const validated = await accountSchema.validate(req.body)
    req.body = validated
    const { name, budget } = req.body
    if (typeof name !== 'string') {
      error.message = 'name of account must be a string'
      next(error)
    }
    else if (typeof budget !== 'number') {
      error.message = 'budget of account must be a number'
      next(error)
    } else {
      next()
    }
  } catch (err) {
    next({
      status: 400,
      message: err.message
    })
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const accounts = await Account.getAll()
    const acc = accounts.find(acc => acc.name === req.body.name.trim())
    if (acc) {
      next({
        status: 400,
        message: 'that name is taken'
      })
    } else {
      next()
    }
  } catch (err) { next(err) }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const acc = await Account.getById(req.params.id)
    if (!acc) {
      next({
        status: 404,
        message: 'account not found'
      })
    } else {
      req.found = acc
      next()
    }
  } catch (err) {
    next(err)
  }

}
