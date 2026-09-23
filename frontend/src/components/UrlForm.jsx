import {
  useState
} from "react";

import {
  ArrowRight,
  Link,
  Loader2
} from "lucide-react";


function isValidUrl(value) {

  try {

    const url =
      new URL(value);

    return (
      url.protocol ===
        "http:" ||

      url.protocol ===
        "https:"
    );

  } catch {

    return false;

  }
}


export default function UrlForm({
  onCreated
}) {

  const [value, setValue] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    const urls =
      value
        .split("\n")
        .map((url) =>
          url.trim()
        )
        .filter(Boolean);


    if (urls.length === 0) {

      setError(
        "Please enter at least one URL."
      );

      return;
    }


    if (urls.length > 100) {

      setError(
        "Maximum 100 URLs allowed."
      );

      return;
    }


    const invalidUrls =
      urls.filter(
        (url) =>
          !isValidUrl(url)
      );


    if (
      invalidUrls.length > 0
    ) {

      setError(
        `${invalidUrls.length} invalid URL(s) found. Please check your URLs.`
      );

      return;
    }


    setError("");

    setLoading(true);


    try {

      await onCreated(urls);

      setValue("");

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);

    }
  }


  return (

    <form
      className="shortener-form"
      onSubmit={handleSubmit}
    >

      <div className="input-shell textarea-shell">

        <Link
          size={20}
          className="input-icon"
        />


        <textarea
          value={value}

          onChange={(event) => {

            setValue(
              event.target.value
            );

            if (error) {
              setError("");
            }

          }}

          placeholder={
            "Paste one or multiple URLs here...\n\nExample:\nhttps://google.com\nhttps://github.com\nhttps://react.dev"
          }

          aria-label="URLs"

        />

      </div>


      <button
        className="primary-btn"
        type="submit"
        disabled={loading}
      >

        {loading ? (

          <>

            <Loader2
              size={18}
              className="spin"
            />

            Creating...

          </>

        ) : (

          <>

            Shorten URLs

            <ArrowRight
              size={18}
            />

          </>

        )}

      </button>


      {error && (

        <div className="form-error">

          {error}

        </div>

      )}

    </form>
  );
}