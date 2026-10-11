use std::collections::HashMap;
use std::sync::Arc;

use handlebars::Handlebars;
use serde_json::Value;
use tokio::net::TcpListener;
use tokio::signal::unix::{SignalKind, signal};
use warp::{Filter, Reply};

use crate::config::Config;
use crate::routes::Route;
use crate::templates;

pub async fn serve(config: Config) {
    // --- Templates ---
    let mut hb = Handlebars::new();
    hb.set_strict_mode(true);
    templates::register_all(&mut hb, &config.templates_dir);
    let hb: Arc<Handlebars<'static>> = Arc::new(hb);

    // --- Route lookup table ---
    let route_map: HashMap<&'static str, (&'static str, fn() -> Value)> = Route::all()
        .iter()
        .map(|r| (r.path, (r.template, r.data)))
        .collect();
    let route_map = Arc::new(route_map);

    // --- Page handler (replaces per-route warp filters) ---
    let pages = warp::get()
        .and(warp::path::tail())
        .map(move |tail: warp::path::Tail| {
            let path = tail.as_str(); // "" for root, "about" for /about, etc.

            match route_map.get(path) {
                Some((template, data_fn)) => {
                    let data = data_fn();
                    match hb.render(template, &data) {
                        Ok(rendered) => warp::reply::with_status(
                            warp::reply::html(rendered),
                            warp::http::StatusCode::OK,
                        )
                        .into_response(),
                        Err(e) => {
                            eprintln!("Template error: {e}");
                            warp::reply::with_status(
                                warp::reply::html("<h1>500 — Internal Server Error</h1>"),
                                warp::http::StatusCode::INTERNAL_SERVER_ERROR,
                            )
                            .into_response()
                        }
                    }
                }
                None => warp::reply::with_status(
                    warp::reply::html("<h1>404 — Not Found</h1>".to_string()),
                    warp::http::StatusCode::NOT_FOUND,
                )
                .into_response(),
            }
        });

    // --- Static files (must come first so /static/* doesn't hit pages) ---
    let static_dir = config.static_dir.clone();
    let static_files = warp::path("static").and(warp::fs::dir(static_dir));

    // --- Combine: static first, then pages (404 fallback baked in) ---
    let routes = static_files.or(pages);

    // --- Bind & graceful shutdown ---
    let listener = TcpListener::bind(config.bind_addr)
        .await
        .unwrap_or_else(|e| panic!("Failed to bind to {}: {}", config.bind_addr, e));

    let mut sigterm = signal(SignalKind::terminate()).expect("SIGTERM register failed");
    let mut sigint = signal(SignalKind::interrupt()).expect("SIGINT register failed");

    println!("Server is up on {}", config.bind_addr);

    warp::serve(routes)
        .incoming(listener)
        .graceful(async move {
            tokio::select! {
                _ = sigterm.recv() => {},
                _ = sigint.recv() => {},
            }
        })
        .run()
        .await;
}
