import {
  useEffect,
  useMemo,
  useState
} from "react";


import {
  BarChart3,
  Link2,
  Search,
  ShieldCheck,
  Zap
} from "lucide-react";


import Header
  from "./components/Header";


import UrlForm
  from "./components/UrlForm";


import UrlTable
  from "./components/UrlTable";


import {
  createBulkShortUrls,
  deleteUrl,
  getUrls
} from "./api";


export default function App() {

  const [
    urls,
    setUrls
  ] = useState([]);


  const [
    search,
    setSearch
  ] = useState("");


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    toast,
    setToast
  ] = useState("");


  // ======================================
  // LOAD URLS
  // ======================================

  async function loadUrls(
    value = ""
  ) {

    try {

      setLoading(true);

      setError("");


      const result =
        await getUrls(value);


      setUrls(
        result.data
      );

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);

    }
  }


  // Initial load

  useEffect(() => {

    loadUrls();

  }, []);


  // Search

  useEffect(() => {

    const timer =
      setTimeout(
        () => {
          loadUrls(search);
        },
        350
      );


    return () =>
      clearTimeout(timer);

  }, [search]);


  // ======================================
  // CREATE MULTIPLE URLS
  // ======================================

  async function handleCreated(
    urlsToCreate
  ) {

    const result =
      await createBulkShortUrls(
        urlsToCreate
      );


    const successCount =
      result.data.filter(
        (item) =>
          item.success
      ).length;


    const failedCount =
      result.data.length -
      successCount;


    if (failedCount > 0) {

      setToast(
        `${successCount} created, ${failedCount} failed`
      );

    } else {

      setToast(
        `${successCount} short URL(s) created successfully!`
      );

    }


    await loadUrls(search);


    setTimeout(
      () => setToast(""),
      3000
    );


    return result;
  }


  // ======================================
  // DELETE
  // ======================================

  async function handleDelete(
    id
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this link?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteUrl(id);


      setUrls(
        (current) =>
          current.filter(
            (item) =>
              item._id !== id
          )
      );


      setToast(
        "Link deleted successfully"
      );


      setTimeout(
        () => setToast(""),
        2000
      );

    } catch (err) {

      setError(
        err.message
      );

    }
  }


  // ======================================
  // STATISTICS
  // ======================================

  const totalClicks =
    useMemo(
      () =>
        urls.reduce(
          (
            sum,
            item
          ) =>
            sum +
            item.clicks,
          0
        ),
      [urls]
    );


  return (

    <div className="app">

      <Header />


      <main>

        {/* ================================
            HERO
        ================================= */}

        <section className="hero">

          <div className="container hero-inner">

            <div className="hero-badge">

              <Zap size={15} />

              Multiple URL Shortener

            </div>


            <h1>

              Turn long links into

              <span>
                simple links.
              </span>

            </h1>


            <p className="hero-description">

              Convert one or multiple
              long URLs into clean,
              easy-to-share short links.

            </p>


            <div className="shortener-card">

              <UrlForm
                onCreated={
                  handleCreated
                }
              />


              <div className="secure-note">

                <ShieldCheck
                  size={15}
                />

                One URL per line
                · Maximum 100 URLs

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            DASHBOARD
        ================================= */}

        <section className="container dashboard">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                YOUR DASHBOARD
              </p>


              <h2>
                Link history
              </h2>

            </div>


            <div className="stats">

              <div className="stat-card">

                <Link2
                  size={18}
                />

                <div>

                  <strong>
                    {urls.length}
                  </strong>

                  <span>
                    Total links
                  </span>

                </div>

              </div>


              <div className="stat-card">

                <BarChart3
                  size={18}
                />

                <div>

                  <strong>
                    {totalClicks}
                  </strong>

                  <span>
                    Total clicks
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* SEARCH */}

          <div className="toolbar">

            <div className="search-box">

              <Search
                size={18}
              />


              <input
                value={search}

                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }

                placeholder=
                  "Search your links..."
              />

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="error-banner">

              <strong>
                Error:
              </strong>

              {error}


              <button
                onClick={() =>
                  loadUrls(search)
                }
              >
                Retry
              </button>

            </div>

          )}


          {/* TABLE */}

          {loading ? (

            <div className="loading-state">

              <div className="loader"></div>

              <p>
                Loading your links...
              </p>

            </div>

          ) : (

            <UrlTable
              urls={urls}
              onDelete={
                handleDelete
              }
            />

          )}

        </section>


        {/* ================================
            FEATURES
        ================================= */}

        <section
          className="features container"
        >

          <div className="feature-card">

            <div className="feature-icon">

              <Link2 size={20} />

            </div>


            <h3>
              Multiple URLs
            </h3>


            <p>

              Paste multiple URLs
              at once and generate
              individual short links.

            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">

              <BarChart3
                size={20}
              />

            </div>


            <h3>
              Click tracking
            </h3>


            <p>

              Each shortened link
              maintains its own
              click count.

            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">

              <ShieldCheck
                size={20}
              />

            </div>


            <h3>
              URL validation
            </h3>


            <p>

              HTTP and HTTPS URLs
              are validated before
              being stored.

            </p>

          </div>

        </section>

      </main>


      {/* TOAST */}

      {toast && (

        <div className="toast">

          {toast}

        </div>

      )}


      <footer>

        <div className="container">

          <span>
            LinkLite
          </span>

          {" · "}

          Built with MongoDB,
          Express, React & Node.js

        </div>

      </footer>

    </div>
  );
}