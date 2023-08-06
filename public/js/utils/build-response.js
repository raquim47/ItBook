const buildResponse = (data, error) => ({
  data: data ?? null,
  error: error ?? null,
});

export default buildResponse;
