use std::sync::Arc;

use chrono::{DateTime, Utc};
use handlebars::Handlebars;
use serde::Serialize;
use serde_json::json;
use tokio::net::TcpListener;
use tokio::signal::unix::{SignalKind, signal};
use warp::Filter;

struct WithTemplate<T: Serialize> {
    name: &'static str,
    value: T,
}

fn render<T>(template: WithTemplate<T>, hbs: Arc<Handlebars<'_>>) -> impl warp::Reply
where
    T: Serialize,
{
    let render = hbs
        .render(template.name, &template.value)
        .unwrap_or_else(|err| err.to_string());
    warp::reply::html(render)
}

#[tokio::main]
async fn main() {
    let mut hb = Handlebars::new();

    // register the template
    hb.register_template_file("index.html", "./templates/index.html")
        .unwrap();

    // Turn Handlebars instance into a Filter so we can combine it
    // easily with others...
    let hb = Arc::new(hb);

    // Create a reusable closure to render template
    let handlebars = move |with_template| render(with_template, hb.clone());

    let exactage = DateTime::from_timestamp(1150215360, 0).expect("Invalid timestamp");

    //GET /
    let route = warp::get()
        .and(warp::path::end())
        .map(move || WithTemplate {
            name: "index.html",
            value: json!({"exactage" : Utc::now().years_since(exactage).expect("Exact years couldn't be calculated")}),
        })
        .map(handlebars);

    let static_files = warp::path("static").and(warp::fs::dir("static"));

    let routes = route.or(static_files);

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();

    let mut sig = signal(SignalKind::terminate()).expect("Not recognizing SIGTERM");

    println!("Server is up.");

    warp::serve(routes)
        .incoming(listener)
        .graceful(async move { sig.recv().await.unwrap() })
        .run()
        .await;
}
