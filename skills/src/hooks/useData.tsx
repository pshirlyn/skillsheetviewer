import { User } from "../Types";
import { useCookies } from "react-cookie";

const useData = () => {
  const [cookies] = useCookies(["token", "uid", "email"]);

  // Force the admin to repull the data from the admin sheets
  const updateAdmin = async (key: string): Promise<Boolean> => {
    try {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
      const response = await fetch("/api/v1/refresh/" + key, config);
      if (response.ok) {
        const json = await response.json();
        if (json["success"]) {
          return true;
        }
      }
    } catch (error) {}
    return false;
  };

  // Retrieves data from server
  // Throws Error
  const refreshData = async (): Promise<User[]> => {
    const config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: cookies["email"],
        token: cookies["token"],
        uid: cookies["uid"]
      })
    };
    // This is a client side check, however server side checks are also necessary!
    // Here we don't do a callback verify but on server side we want it
    const response = await fetch("/api/v1/users", config);
    if (response.ok) {
      const json = await response.json();
      if (json["success"]) {
        return json["users"];
      } else {
        throw new Error(json["error"]);
      }
    }
    return [];
  };
  return { updateAdmin, refreshData };
};

export default useData;
