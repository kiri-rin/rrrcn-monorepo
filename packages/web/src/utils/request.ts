const isFile = (input: any) => "File" in window && input instanceof File;
export const serializeRequestToForm = (
  request: object | any[] | string | File,
  form: FormData,
  prevKey = ""
) => {
  JSON.stringify(request);
  switch (typeof request) {
    case "object": {
      if (isFile(request)) {
        form.append(prevKey, request as File);
      } else {
        for (let [key, value] of Object.entries(request)) {
          serializeRequestToForm(
            value,
            form,
            `${prevKey}${prevKey ? "." : ""}${key}`
          );
        }
      }
      break;
    }
    default: {
      form.append(prevKey, request);
    }
  }
};
