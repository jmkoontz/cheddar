const buildUrl = (endpoint) => {
  let base;

  if (process.env.isDeployment)
    base = "https://cheddar-budgeting.herokuapp.com";
  else
    base = "http://localhost:8080";

  return base + endpoint;
};

export default buildUrl;