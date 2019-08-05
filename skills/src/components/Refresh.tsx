import React from "react";
import { RouteComponentProps } from "react-router-dom";
import useData from "../hooks/useData";

const Refresh = (props: RouteComponentProps<{ key: string }>) => {
  const key = props.match.params.key;
  const { updateAdmin } = useData();
  (async () => {
    const didUpdate = await updateAdmin(key);
    if (didUpdate) {
      alert("Successfully updated server");
    } else {
      alert("Failed updating server");
    }
    window.location.replace("/");
  })();
  return <div>Updating</div>;
};

export default Refresh;
