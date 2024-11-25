const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') {
      console.error('Invalid schema provided to validation middleware');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
};

module.exports = validateRequest;