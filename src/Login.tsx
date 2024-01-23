import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { token } from "./store/token";

export const Login = () => {
  const [inputKey, setInputKey] = useState("");

  useEffect(() => {
    if (token.value !== null) {
      route("/home");
    }
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    token.value = inputKey;
    localStorage.setItem("apiKey", inputKey);
    route("/home");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="apiKey">APIキー:</label>
        <input
          id="apiKey"
          type="password"
          value={inputKey}
          onChange={(e: any) => setInputKey(e.target.value)}
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};
