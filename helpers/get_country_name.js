const getCountryName = (code) => {
  const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
  
  return code ? countryNames.of(code) : null;
};

module.exports = { getCountryName };
