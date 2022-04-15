async function getData(e, collection, query = undefined, fields = undefined) {
  if (query === undefined) {
    query = {};
  }
  if (fields === undefined) {
    fields = { _id: 0 };
  }
  const res = await fetch("http://localhost:5000/api/fetch", {
    method: "POST",
    body: JSON.stringify({
      collection: collection,
      query: query,
      fields: fields,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  const result = json.result;
  return result;
}

export default getData;
