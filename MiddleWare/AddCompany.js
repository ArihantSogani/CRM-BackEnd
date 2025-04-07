exports.addCompany = (req, res, next) => {
  const { companyId } = req.params;
  req.company = companyId;
  next();
}