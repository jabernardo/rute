export interface RequestData {
  [key: string]: string
}

/**
 * URL Search Query string to Request Data
 *
 * @param    data   string   URL Search Query
 * @return   RequestData
 *
 */
export function urlSearchQuery(data: string): RequestData {
  let params: RequestData = {};
  data = data[0] == "?" ? data.substr(1, data.length) : data;

  data.split("&").forEach(param => {
    let [ key, val ] = param.split("=");

    params[key] = val;
  });

  return params;
}

/**
 * FormData (URLEncoded) to Request Data
 *
 * @param    data   string   URL Search Query
 * @return   RequestData
 *
 */
export function formDataUrlEncoded(data: string): RequestData {
  let params: RequestData = {};

  data.split("&").forEach(param => {
    let [ key, val ] = param.split("=");

    params[key] = val;
  });

  return params;
}
