import {
  createResource,
  type Component,
  For,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import wretch from "wretch";

type Post = {
  id: number;
  title: string;
  content: string;
};

const App: Component = () => {
  const client = wretch("/api/");

  const [csrfTokenResponse] = createResource(async () => {
    const { csrfToken } = await client
      .url("csrf_token/")
      .get()
      .json<{ csrfToken: string }>();
    return csrfToken;
  });

  const [postsResponse, { refetch }] = createResource(async () => {
    const { posts } = await client
      .url("posts/")
      .get()
      .json<{ posts: Post[] }>();
    return posts;
  });

  const [titleInputValue, setTitleInputValue] = createSignal("");
  const [contentInputValue, setContentInputValue] = createSignal("");

  return (
    <div class="flex flex-col divide-y space-y-2">
      <Show
        when={!csrfTokenResponse.loading && !postsResponse.loading}
        fallback={<p>Loading</p>}
      >
        <div>
          <input
            class="border"
            placeholder="Title"
            value={titleInputValue()}
            onInput={(event) => setTitleInputValue(event.currentTarget.value)}
          />
          <input
            class="border"
            placeholder="Content"
            value={contentInputValue()}
            onInput={(event) => setContentInputValue(event.currentTarget.value)}
          />
          <button
            class="border rounded px-2"
            onClick={(event) => {
              event.preventDefault();
              const title = titleInputValue();
              const content = contentInputValue();
              client
                .url("posts/")
                .headers({ "X-XSRF-TOKEN": csrfTokenResponse() })
                .json({ title, content })
                .post()
                .json()
                .then(() => refetch());
            }}
          >
            Submit
          </button>
          <button
            class="border rounded px-2"
            onClick={(event) => {
              event.preventDefault();
              refetch();
            }}
          >
            Refresh
          </button>
        </div>
        {postsResponse().length === 0 ? (
          <div>
            <p>No posts yet!</p>
          </div>
        ) : (
          <For each={postsResponse()}>
            {({ id, title, content }) => (
              <div>
                <p class="font-bold text-lg">
                  {id}: {title}
                </p>
                <p>{content}</p>
                <button
                  class="border rounded px-2"
                  onClick={(event) => {
                    event.preventDefault();
                    client
                      .url(`posts/${id}/`)
                      .headers({ "X-XSRF-TOKEN": csrfTokenResponse() })
                      .delete()
                      .text()
                      .then(() => refetch());
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        )}
      </Show>
    </div>
  );

  return (
    <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
  );
};

export default App;
