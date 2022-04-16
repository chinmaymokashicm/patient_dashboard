async function getData(e, setIsLoading, collection, query = undefined, fields = undefined, sort=undefined) {
  setIsLoading(true)
  if (query === undefined) {
    query = {};
  }
  if (fields === undefined) {
    fields = { _id: 0 };
  }
  if(sort === undefined){
    sort = {}
  }
  console.log(collection)
  const res = await fetch("http://localhost:5000/api/fetch", {
    method: "POST",
    body: JSON.stringify({
      collection: collection,
      query: query,
      fields: fields,
      sort: sort
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  setIsLoading(false)
  const result = json.result;
  return result;
}

export default getData;
