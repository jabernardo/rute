export interface RouteData {
  [key: string]: any
}

export function getCleanPath(uri: string): string {
  return "/" + uri
    .replace(/\\/ig, "/")
    .replace(/([#?].*)$/ig, "")
    .replace(/^([\/])/ig, "")
    .replace(/([\/])$/ig, "");
}

export function getRouteTranslation(route: string): string {
  return route
    .replace(/\//ig, '\/')
    // .replace(/\[([^\[]+)\]/ig, '(?:$1)?')
    .replace(/{(\w*?)}/ig, '{$1:([^\/#?]+)}');
}

export function getRouteKeys(translatedRoute: string): RegExpMatchArray {
  const keysOnly = /{(\w*?):.*?}/ig;

  let keys =  (translatedRoute.match(keysOnly) || [])
    .map(e => e.replace(keysOnly, "$1"));

   return keys;
}

export function getRouteTest(translatedRoute: string): RegExp {
  const valsOnlu = /{\w*?:(.*?)}/ig;
  return new RegExp(translatedRoute.replace(valsOnlu, "$1"));
}

export function getRouteData(translatedRoute: string, testRouteData: RegExpMatchArray): RouteData {
  let data:RouteData = <RouteData>{};
  let routeKeys: RegExpMatchArray = getRouteKeys(translatedRoute);

  if (testRouteData.length > routeKeys.length) {
    testRouteData.shift();
  }

  for (let index:number = 0; index < routeKeys.length; index++) {
    let key = routeKeys[index];
    data[key] = testRouteData[index];
  }

  return data;
}

export function test(route: string, path: string): RouteData | null {
  let translatedRoute: string = `^${ getRouteTranslation(route) }$`;
  let testRouteData: RegExpMatchArray | null = getCleanPath(path).match(getRouteTest(translatedRoute));

  return testRouteData ? getRouteData(translatedRoute, testRouteData) : null;
}
