import type { Component } from "solid-js";
import wretch from "wretch";

const App: Component = () => {
  return (
    <button
      class="border rounded"
      onClick={async (event) => {
        event.preventDefault();
        const client = wretch("http://localhost:7890/api/");
        const { csrfToken } = await client
          .url("api/csrf_token/")
          .get()
          .json<{ csrfToken: string }>();
        console.log(csrfToken);
      }}
    >
      ATTACK!
    </button>
  );
};

export default App;
