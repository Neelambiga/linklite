import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  MousePointerClick,
  Trash2
} from "lucide-react";

import {
  useState
} from "react";


function formatDate(
  date
) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(
    new Date(date)
  );
}


function shortenDisplay(
  url
) {

  if (url.length <= 65) {
    return url;
  }

  return (
    url.slice(0, 62) +
    "..."
  );
}


export default function UrlTable({
  urls,
  onDelete
}) {

  const [
    copiedId,
    setCopiedId
  ] = useState("");


  async function copyUrl(
    url,
    id
  ) {

    try {

      await navigator.clipboard
        .writeText(url);

      setCopiedId(id);

      setTimeout(
        () =>
          setCopiedId(""),
        1500
      );

    } catch {

      alert(
        "Unable to copy URL"
      );

    }
  }


  if (!urls.length) {

    return (

      <div className="empty-state">

        <div className="empty-icon">

          <Link2 size={28} />

        </div>


        <h3>
          No shortened links yet
        </h3>


        <p>
          Paste one or multiple URLs
          above to create short links.
        </p>

      </div>

    );
  }


  return (

    <div className="table-wrap">

      <table>

        <thead>

          <tr>

            <th>
              Original URL
            </th>

            <th>
              Short URL
            </th>

            <th>
              Clicks
            </th>

            <th>
              Created
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>


        <tbody>

          {urls.map(
            (item) => (

              <tr
                key={item._id}
              >

                <td>

                  <div
                    className="original-url"
                    title={
                      item.originalUrl
                    }
                  >

                    {
                      shortenDisplay(
                        item.originalUrl
                      )
                    }

                  </div>

                </td>


                <td>

                  <a
                    className="short-url"
                    href={
                      item.shortUrl
                    }

                    target="_blank"

                    rel="noreferrer"
                  >

                    {
                      item.shortUrl
                    }

                  </a>

                </td>


                <td>

                  <span className="click-pill">

                    <MousePointerClick
                      size={14}
                    />

                    {
                      item.clicks
                    }

                  </span>

                </td>


                <td className="date-cell">

                  {
                    formatDate(
                      item.createdAt
                    )
                  }

                </td>


                <td>

                  <div className="actions">

                    <button
                      className="icon-btn"

                      onClick={() =>
                        copyUrl(
                          item.shortUrl,
                          item._id
                        )
                      }

                      title="Copy"
                    >

                      {
                        copiedId ===
                        item._id
                          ? <Check size={17} />
                          : <Copy size={17} />
                      }

                    </button>


                    <a
                      className="icon-btn"

                      href={
                        item.shortUrl
                      }

                      target="_blank"

                      rel="noreferrer"

                      title="Open"
                    >

                      <ExternalLink
                        size={17}
                      />

                    </a>


                    <button
                      className="icon-btn danger"

                      onClick={() =>
                        onDelete(
                          item._id
                        )
                      }

                      title="Delete"
                    >

                      <Trash2
                        size={17}
                      />

                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}