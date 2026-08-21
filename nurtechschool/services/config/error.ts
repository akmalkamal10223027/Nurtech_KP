export default function errorHandler(error: any) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;
  const payload = error?.response?.config?.data;
  const path = error?.response?.config?.url;

  console.log(
    {
      status,
      message,
      path,
      payload,
    },
    "error_apis",
  );
  return Promise.reject(error);
}
