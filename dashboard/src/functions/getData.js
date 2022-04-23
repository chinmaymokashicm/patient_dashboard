async function getData(e, setIsLoading, collection, query = undefined, fields = undefined, sort=undefined, limit=undefined, aggregate=undefined) {
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
  if(limit === undefined){
    limit = 10
  }
  console.log(collection)
  const body = JSON.stringify({
    collection: collection,
    query: query,
    fields: fields,
    sort: sort,
    limit: limit,
    aggregate: aggregate
  })
  const res = await fetch("http://localhost:5000/api/fetch", {
    method: "POST",
    body: body,
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
