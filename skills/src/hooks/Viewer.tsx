import { useCookies } from "react-cookie";

export enum Query {
  name = "name"
}

const useViewer = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const viewerQuery = (value: Query) => {
    return cookies[value];
  };
  return viewerQuery;
};

export default useViewer;
